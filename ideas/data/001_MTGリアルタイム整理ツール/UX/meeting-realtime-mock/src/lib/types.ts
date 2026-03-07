// Shared types for the live meeting processing pipeline

export interface LiveTranscriptSegment {
  id: string;
  text: string;
  speaker?: string;
  timestamp: number; // Unix ms
  isFinal: boolean;  // false = interim result
  language?: string;
}

export type StatementTag =
  | "agenda"
  | "fact"
  | "example"
  | "proposal"
  | "opinion"
  | "question"
  | "concern"
  | "agreement"
  | "decision"
  | "action";

export type NodePriority = "high" | "medium" | "low";
export type NodeStatus = "open" | "in-progress" | "resolved" | "blocked";

export interface StructuredNode {
  id: string;
  label: string;
  type: StatementTag;
  parentId?: string;
  detail?: string;
  speaker?: string;
  summary?: string;
  evidence?: string;
  priority?: NodePriority;
  status?: NodeStatus;
  tags?: string[];
}

export interface StructuredEdge {
  source: string;
  target: string;
  label?: string;
}

export interface StructureUpdate {
  nodes: StructuredNode[];
  edges: StructuredEdge[];
  suggestions?: { nodeId: string; text: string; type: "question" | "concern" | "next-step" }[];
}

export interface MeetingState {
  isRecording: boolean;
  segments: LiveTranscriptSegment[];
  structureUpdates: StructureUpdate[];
  error?: string;
}
