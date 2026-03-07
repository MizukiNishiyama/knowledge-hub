import { NextRequest, NextResponse } from "next/server";
import { structureTranscript } from "@/lib/ollama";

export const runtime = "nodejs";

/**
 * POST /api/structure
 * Receives new transcript text + context, sends to Ollama for structuring.
 * Returns structured nodes/edges/suggestions.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { newText, previousContext, existingNodeIds } = body;

    if (!newText || typeof newText !== "string") {
      return NextResponse.json({ error: "newText is required" }, { status: 400 });
    }

    const result = await structureTranscript(
      newText,
      previousContext || "",
      existingNodeIds || []
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Structuring failed";
    console.error("Structure error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
