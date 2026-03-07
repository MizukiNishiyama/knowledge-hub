/**
 * WebSocket STT Bridge Server
 *
 * Receives raw PCM audio (Int16LE, 16kHz, mono) via WebSocket,
 * performs energy-based VAD, constructs WAV files from speech segments,
 * and forwards them to whisper.cpp HTTP API for transcription.
 *
 * Usage: npx tsx server/ws-stt-server.ts
 */

import { WebSocketServer, WebSocket } from "ws";

// --- Configuration ---
const WS_PORT = parseInt(process.env.WS_STT_PORT || "8179", 10);
const WHISPER_URL = process.env.WHISPER_URL || "http://localhost:8178/inference";
const SAMPLE_RATE = 16000;

// VAD parameters
const SILENCE_THRESHOLD = 400;      // Int16 RMS below this = silence (lowered to avoid false splits)
const SILENCE_DURATION_MS = 1800;   // Silence this long = end of speech (1.8s — tolerates pauses/breathing)
const MAX_SPEECH_MS = 25000;        // Force split at this length (25s — allows long continuous speech)
const MIN_SPEECH_MS = 800;          // Ignore speech shorter than this (0.8s — filters out noise/clicks)

// Interim transcription: send partial results while still speaking
const INTERIM_INTERVAL_MS = 2500;   // Send interim result every 2.5s during speech

// --- WAV Header Construction ---
function buildWavHeader(dataLength: number): Buffer {
  const header = Buffer.alloc(44);
  const totalLength = dataLength + 36;

  // RIFF header
  header.write("RIFF", 0);
  header.writeUInt32LE(totalLength, 4);
  header.write("WAVE", 8);

  // fmt sub-chunk
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);       // Sub-chunk size
  header.writeUInt16LE(1, 20);        // Audio format: PCM
  header.writeUInt16LE(1, 22);        // Channels: mono
  header.writeUInt32LE(SAMPLE_RATE, 24);  // Sample rate
  header.writeUInt32LE(SAMPLE_RATE * 2, 28); // Byte rate (16-bit mono)
  header.writeUInt16LE(2, 32);        // Block align
  header.writeUInt16LE(16, 34);       // Bits per sample

  // data sub-chunk
  header.write("data", 36);
  header.writeUInt32LE(dataLength, 40);

  return header;
}

// --- RMS Energy Calculation ---
function calculateRMS(samples: Int16Array): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  return Math.sqrt(sum / samples.length);
}

// --- Client Session ---
interface ClientSession {
  ws: WebSocket;
  language: string;
  pcmBuffers: Buffer[];
  pcmTotalBytes: number;
  isSpeaking: boolean;
  speechStartTime: number;
  lastSpeechTime: number;
  segmentCounter: number;
  processing: boolean;
  // Interim transcription state
  interimTimer: ReturnType<typeof setTimeout> | null;
  interimProcessing: boolean;
  lastInterimBytes: number; // how many bytes were already sent as interim
}

function createSession(ws: WebSocket): ClientSession {
  return {
    ws,
    language: "ja",
    pcmBuffers: [],
    pcmTotalBytes: 0,
    isSpeaking: false,
    speechStartTime: 0,
    lastSpeechTime: 0,
    segmentCounter: 0,
    processing: false,
    interimTimer: null,
    interimProcessing: false,
    lastInterimBytes: 0,
  };
}

// --- Whisper transcription helper ---
async function callWhisper(wavBuffer: Buffer, language: string): Promise<string> {
  const formData = new FormData();
  const wavBlob = new Blob([new Uint8Array(wavBuffer)], { type: "audio/wav" });
  formData.append("file", wavBlob, "audio.wav");
  formData.append("language", language);
  formData.append("response_format", "json");

  const res = await fetch(WHISPER_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`Whisper error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.text?.trim() || "";
}

// --- Interim transcription (partial result while still speaking) ---
function startInterimTimer(session: ClientSession): void {
  stopInterimTimer(session);
  session.lastInterimBytes = 0;

  const tick = async () => {
    if (!session.isSpeaking || session.interimProcessing) return;
    if (session.pcmTotalBytes <= session.lastInterimBytes) return;
    // Need enough new audio to be worth transcribing (~1s minimum)
    const newBytes = session.pcmTotalBytes - session.lastInterimBytes;
    if (newBytes < SAMPLE_RATE * 2 * 1) return; // less than 1s of new audio

    session.interimProcessing = true;
    try {
      // Snapshot current buffer (don't clear it — speech is ongoing)
      const pcmData = Buffer.concat(session.pcmBuffers);
      const wavHeader = buildWavHeader(pcmData.length);
      const wavBuffer = Buffer.concat([wavHeader, pcmData]);

      const durationSec = (pcmData.length / 2 / SAMPLE_RATE).toFixed(1);
      console.log(`[WS-STT] Interim transcription: ${durationSec}s`);

      const text = await callWhisper(wavBuffer, session.language);
      session.lastInterimBytes = session.pcmTotalBytes;

      if (text.length > 0) {
        console.log(`[WS-STT] Interim: "${text}"`);
        sendMessage(session.ws, { type: "interim", text });
      }
    } catch (err) {
      console.error("[WS-STT] Interim error:", err);
    } finally {
      session.interimProcessing = false;
      // Schedule next interim if still speaking
      if (session.isSpeaking) {
        session.interimTimer = setTimeout(tick, INTERIM_INTERVAL_MS);
      }
    }
  };

  // First interim after INTERIM_INTERVAL_MS
  session.interimTimer = setTimeout(tick, INTERIM_INTERVAL_MS);
}

function stopInterimTimer(session: ClientSession): void {
  if (session.interimTimer) {
    clearTimeout(session.interimTimer);
    session.interimTimer = null;
  }
}

// --- Final transcription (complete segment after speech ends) ---
async function transcribeSegment(session: ClientSession): Promise<void> {
  stopInterimTimer(session);

  if (session.processing) return;
  if (session.pcmTotalBytes === 0) return;

  const speechDurationMs = (session.pcmTotalBytes / 2 / SAMPLE_RATE) * 1000;
  if (speechDurationMs < MIN_SPEECH_MS) {
    session.pcmBuffers = [];
    session.pcmTotalBytes = 0;
    return;
  }

  session.processing = true;
  const pcmData = Buffer.concat(session.pcmBuffers);
  const segId = `seg_${++session.segmentCounter}`;

  // Clear buffer immediately so new audio can accumulate
  session.pcmBuffers = [];
  session.pcmTotalBytes = 0;
  session.lastInterimBytes = 0;

  try {
    const wavHeader = buildWavHeader(pcmData.length);
    const wavBuffer = Buffer.concat([wavHeader, pcmData]);

    const durationSec = (pcmData.length / 2 / SAMPLE_RATE).toFixed(1);
    console.log(`[WS-STT] Final transcription ${segId}: ${durationSec}s`);

    const text = await callWhisper(wavBuffer, session.language);

    if (text.length > 0) {
      console.log(`[WS-STT] Final [${segId}]: "${text}"`);
      sendMessage(session.ws, {
        type: "final",
        text,
        id: segId,
      });
    }
  } catch (err) {
    console.error("[WS-STT] Transcription error:", err);
    sendMessage(session.ws, {
      type: "error",
      message: err instanceof Error ? err.message : "Transcription failed",
    });
  } finally {
    session.processing = false;
  }
}

function sendMessage(ws: WebSocket, data: Record<string, unknown>): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

// --- Process incoming PCM frame ---
function processAudioFrame(session: ClientSession, data: Buffer): void {
  // Interpret as Int16LE samples
  const samples = new Int16Array(
    data.buffer,
    data.byteOffset,
    data.byteLength / 2
  );
  const rms = calculateRMS(samples);
  const now = Date.now();

  if (rms > SILENCE_THRESHOLD) {
    // Speech detected
    if (!session.isSpeaking) {
      session.isSpeaking = true;
      session.speechStartTime = now;
      console.log(`[WS-STT] Speech started (RMS: ${rms.toFixed(0)})`);
      // Start interim transcription timer
      startInterimTimer(session);
    }
    session.lastSpeechTime = now;
    session.pcmBuffers.push(Buffer.from(data));
    session.pcmTotalBytes += data.byteLength;

    // Check max speech duration
    const speechDuration = now - session.speechStartTime;
    if (speechDuration >= MAX_SPEECH_MS) {
      console.log(`[WS-STT] Max speech duration reached (${speechDuration}ms), force splitting`);
      session.isSpeaking = false;
      transcribeSegment(session);
    }
  } else {
    // Silence
    if (session.isSpeaking) {
      // Still accumulate a bit of trailing silence for context
      session.pcmBuffers.push(Buffer.from(data));
      session.pcmTotalBytes += data.byteLength;

      const silenceDuration = now - session.lastSpeechTime;
      if (silenceDuration >= SILENCE_DURATION_MS) {
        console.log(
          `[WS-STT] Speech ended (silence: ${silenceDuration}ms, ` +
          `total: ${now - session.speechStartTime}ms)`
        );
        session.isSpeaking = false;
        transcribeSegment(session);
      }
    }
  }
}

// --- WebSocket Server ---
const wss = new WebSocketServer({ port: WS_PORT });

console.log(`[WS-STT] WebSocket STT Bridge Server starting on port ${WS_PORT}`);
console.log(`[WS-STT] Whisper URL: ${WHISPER_URL}`);
console.log(`[WS-STT] VAD: threshold=${SILENCE_THRESHOLD}, silence=${SILENCE_DURATION_MS}ms, max=${MAX_SPEECH_MS}ms, min=${MIN_SPEECH_MS}ms`);

wss.on("connection", (ws, req) => {
  const clientAddr = req.socket.remoteAddress;
  console.log(`[WS-STT] Client connected from ${clientAddr}`);

  const session = createSession(ws);
  sendMessage(ws, { type: "ready" });

  ws.on("message", (data, isBinary) => {
    if (isBinary) {
      // Binary frame = PCM audio data
      processAudioFrame(session, data as Buffer);
    } else {
      // Text frame = control message
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "start") {
          session.language = msg.language || "ja";
          console.log(`[WS-STT] Recording started, language: ${session.language}`);
        } else if (msg.type === "stop") {
          console.log("[WS-STT] Recording stopped by client");
          stopInterimTimer(session);
          // Flush remaining buffer
          if (session.pcmTotalBytes > 0) {
            session.isSpeaking = false;
            transcribeSegment(session);
          }
        }
      } catch {
        console.warn("[WS-STT] Invalid text message:", data.toString().slice(0, 100));
      }
    }
  });

  ws.on("close", () => {
    console.log(`[WS-STT] Client disconnected from ${clientAddr}`);
    stopInterimTimer(session);
    // Flush remaining
    if (session.pcmTotalBytes > 0) {
      session.isSpeaking = false;
      transcribeSegment(session);
    }
  });

  ws.on("error", (err) => {
    console.error("[WS-STT] WebSocket error:", err.message);
  });
});

wss.on("listening", () => {
  console.log(`[WS-STT] Server ready on ws://localhost:${WS_PORT}`);
});
