import { NextResponse } from "next/server";
import { checkOllamaHealth } from "@/lib/ollama";

export const runtime = "nodejs";

/**
 * GET /api/health
 * Check if Ollama, Whisper, and WS-STT servers are available.
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

  // Check WS-STT bridge server via HTTP upgrade probe
  let wsSttAvailable = false;
  let wsSttError: string | undefined;
  const wsSttPort = process.env.WS_STT_PORT || "8179";
  const wsSttUrl = `http://localhost:${wsSttPort}`;
  try {
    // WebSocket servers respond to HTTP with 426 Upgrade Required or similar
    const res = await fetch(wsSttUrl, { method: "GET", signal: AbortSignal.timeout(2000) });
    // Any response means the server is running
    wsSttAvailable = true;
  } catch (err: any) {
    // Connection refused = not running. But some WS servers may reject HTTP differently.
    // If we get ECONNREFUSED, it's definitely not running.
    if (err?.cause?.code === "ECONNREFUSED" || err?.message?.includes("ECONNREFUSED")) {
      wsSttAvailable = false;
      wsSttError = `WS-STT server not running on port ${wsSttPort}. Run: npx tsx server/ws-stt-server.ts`;
    } else {
      // Got a connection (maybe rejected HTTP but TCP is open) = server is running
      wsSttAvailable = true;
    }
  }

  return NextResponse.json({
    ollama: ollamaStatus,
    whisper: {
      available: whisperAvailable,
      url: whisperUrl,
      error: whisperError,
    },
    wsStt: {
      available: wsSttAvailable,
      url: `ws://localhost:${wsSttPort}`,
      error: wsSttError,
    },
    ready: ollamaStatus.available && whisperAvailable && wsSttAvailable,
  });
}
