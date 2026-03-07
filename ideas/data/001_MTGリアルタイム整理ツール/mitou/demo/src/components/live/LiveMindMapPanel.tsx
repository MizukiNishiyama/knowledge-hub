"use client";

// Wrapper around the existing MindMapPanel for live mode.
// Reuses the same graph rendering, just passes live updates through.

import MindMapPanel from "../MindMapPanel";
import { MindMapUpdate } from "@/data/transcript";

interface LiveMindMapPanelProps {
  updates: MindMapUpdate[];
}

export default function LiveMindMapPanel({ updates }: LiveMindMapPanelProps) {
  return <MindMapPanel updates={updates} />;
}
