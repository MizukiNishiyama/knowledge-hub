import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export const runtime = "nodejs";

const WHISPER_URL = process.env.WHISPER_URL || "http://localhost:8178/inference";

/**
 * POST /api/transcribe
 * Receives audio from the browser, converts to WAV via ffmpeg,
 * then forwards to whisper.cpp server.
 */
export async function POST(req: NextRequest) {
  const id = Date.now();
  const tmpIn = join(tmpdir(), `whisper_in_${id}`);
  const tmpOut = join(tmpdir(), `whisper_out_${id}.wav`);

  try {
    const incomingForm = await req.formData();
    const audioFile = incomingForm.get("audio") as Blob | null;
    const language = (incomingForm.get("language") as string) || "ja";

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    console.log(`[transcribe] Received audio: ${audioFile.size} bytes, type: ${audioFile.type}`);

    // Write incoming audio to temp file
    const arrayBuffer = await audioFile.arrayBuffer();
    writeFileSync(tmpIn, Buffer.from(arrayBuffer));

    // Convert to WAV 16kHz mono using ffmpeg
    try {
      const ffResult = execSync(
        `ffmpeg -y -i "${tmpIn}" -ar 16000 -ac 1 -c:a pcm_s16le "${tmpOut}" 2>&1`,
        { timeout: 10000 }
      );
    } catch (ffErr: any) {
      const stderr = ffErr?.stderr?.toString() || ffErr?.stdout?.toString() || "";
      console.error("[transcribe] ffmpeg conversion failed:", stderr.slice(-300));
      return NextResponse.json({ error: "Audio conversion failed" }, { status: 500 });
    }

    // Read converted WAV and send to whisper
    const wavBuffer = readFileSync(tmpOut);
    console.log(`[transcribe] Converted WAV: ${wavBuffer.length} bytes`);

    const whisperForm = new FormData();
    const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
    whisperForm.append("file", wavBlob, "audio.wav");
    whisperForm.append("language", language);
    whisperForm.append("response_format", "json");

    const res = await fetch(WHISPER_URL, {
      method: "POST",
      body: whisperForm,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "Unknown error");
      console.error("[transcribe] Whisper server error:", res.status, errText);
      return NextResponse.json({ error: `Whisper error: ${errText}` }, { status: 500 });
    }

    const data = await res.json();
    console.log("[transcribe] Whisper result:", JSON.stringify(data).slice(0, 200));

    return NextResponse.json({
      text: data.text?.trim() || "",
      language: data.language,
      segments: data.segments,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Transcription failed";
    console.error("[transcribe] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    // Cleanup temp files
    try { unlinkSync(tmpIn); } catch {}
    try { unlinkSync(tmpOut); } catch {}
  }
}
