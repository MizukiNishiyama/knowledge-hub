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
  };
}

// --- Transcription ---
async function transcribeSegment(session: ClientSession): Promise<void> {
  if (session.processing) return;
  if (session.pcmTotalBytes === 0) return;

  const speechDurationMs = (session.pcmTotalBytes / 2 / SAMPLE_RATE) * 1000;
  if (speechDurationMs < MIN_SPEECH_MS) {
    // Too short, likely noise — discard
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

  try {
    // Build WAV
    const wavHeader = buildWavHeader(pcmData.length);
    const wavBuffer = Buffer.concat([wavHeader, pcmData]);

    console.log(
      `[WS-STT] Transcribing segment ${segId}: ${pcmData.length} bytes PCM, ` +
      `${(pcmData.length / 2 / SAMPLE_RATE).toFixed(1)}s duration`
    );

    // Send to whisper.cpp
    const formData = new FormData();
    const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
    formData.append("file", wavBlob, "audio.wav");
    formData.append("language", session.language);
    formData.append("response_format", "json");

    const res = await fetch(WHISPER_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "Unknown error");
      console.error(`[WS-STT] Whisper error ${res.status}: ${errText}`);
      sendMessage(session.ws, {
        type: "error",
        message: `Whisper error: ${errText}`,
      });
      return;
    }

    const data = await res.json();
    const text = data.text?.trim() || "";

    if (text.length > 0) {
      console.log(`[WS-STT] Result [${segId}]: "${text}"`);
      sendMessage(session.ws, {
        type: "final",
        text,
        id: segId,
        language: data.language,
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
