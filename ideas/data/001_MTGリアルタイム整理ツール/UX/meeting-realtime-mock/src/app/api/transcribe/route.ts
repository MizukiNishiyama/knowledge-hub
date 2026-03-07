import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/whisper";

export const runtime = "nodejs";

/**
 * POST /api/transcribe
 * Receives audio (WAV) from the browser, sends to local whisper.cpp server.
 * Returns transcribed text.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;
    const language = (formData.get("language") as string) || "ja";

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await transcribeAudio(buffer, language);

    return NextResponse.json({
      text: result.text,
      language: result.language,
      segments: result.segments,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Transcription failed";
    console.error("Transcribe error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
