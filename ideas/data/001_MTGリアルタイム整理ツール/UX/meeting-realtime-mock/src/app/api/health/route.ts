import { NextResponse } from "next/server";
import { checkOllamaHealth } from "@/lib/ollama";

export const runtime = "nodejs";

/**
 * GET /api/health
 * Check if Ollama and Whisper servers are available.
 */
export async function GET() {
  const ollamaStatus = await checkOllamaHealth();

  // Check whisper server
  let whisperAvailable = false;
  let whisperError: string | undefined;
  const whisperUrl = process.env.WHISPER_URL || "http://localhost:8178";
  try {
    const res = await fetch(whisperUrl, { method: "GET", signal: AbortSignal.timeout(3000) });
    whisperAvailable = res.ok || res.status === 405; // 405 = server up but GET not allowed
  } catch {
    whisperAvailable = false;
    whisperError = `Cannot connect to Whisper server at ${whisperUrl}`;
  }

  return NextResponse.json({
    ollama: ollamaStatus,
    whisper: {
      available: whisperAvailable,
      url: whisperUrl,
      error: whisperError,
    },
    ready: ollamaStatus.available && whisperAvailable,
  });
}
