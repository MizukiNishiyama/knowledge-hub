// Client for local Ollama server running Qwen3.5
// Default: Ollama at http://localhost:11434

import { StructureUpdate } from "./types";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3.5:4b";

const SYSTEM_PROMPT = `あなたは会議のリアルタイム構造化AIアシスタントです。
会議の発言テキストを受け取り、議論の構造をマインドマップ形式のノードとエッジに変換します。

## 出力形式
必ず以下のJSON形式で出力してください。マークダウンや説明文は不要です。

{
  "nodes": [
    {
      "id": "一意のID (例: node_1)",
      "label": "ノードの短いタイトル (15文字以内)",
      "type": "以下のいずれか: agenda, fact, example, proposal, opinion, question, concern, agreement, decision, action",
      "parentId": "親ノードのID (ルートならnull)",
      "speaker": "発言者名 (わかれば)",
      "summary": "主張・論点の要約 (30文字以内)",
      "evidence": "根拠データがあれば (30文字以内、なければnull)",
      "priority": "high, medium, low のいずれか",
      "tags": ["関連キーワード"]
    }
  ],
  "edges": [
    { "source": "親ノードID", "target": "子ノードID", "label": "関係の説明 (省略可)" }
  ],
  "suggestions": [
    { "nodeId": "関連ノードID", "text": "提案テキスト", "type": "question, concern, next-step のいずれか" }
  ]
}

## ルール
- 既存のノードとの関連を考慮し、新しいノードのparentIdを適切に設定する
- 同じ内容のノードは重複させない
- typeは発言の性質を正確に分類する
- suggestionsは議論を深めるための問いかけや懸念点を1-2個提案する
- JSONのみ出力し、それ以外のテキストは出力しない`;

interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Send transcript context to Ollama for structuring.
 * Returns parsed StructureUpdate.
 */
export async function structureTranscript(
  newText: string,
  previousContext: string,
  existingNodeIds: string[]
): Promise<StructureUpdate> {
  const userPrompt = `## 既存のノードID
${existingNodeIds.length > 0 ? existingNodeIds.join(", ") : "(まだノードはありません)"}

## これまでの会議の流れ
${previousContext || "(会議開始)"}

## 新しい発言
${newText}

上記の新しい発言を構造化してJSON出力してください。既存ノードとの関連を考慮し、parentIdを適切に設定してください。`;

  const messages: OllamaMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      format: "json",
      options: {
        temperature: 0.3,
        num_predict: 2048,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`Ollama error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.message?.content || "{}";

  try {
    const parsed = JSON.parse(content);
    return {
      nodes: parsed.nodes || [],
      edges: parsed.edges || [],
      suggestions: parsed.suggestions || [],
    };
  } catch {
    console.error("Failed to parse LLM response:", content);
    return { nodes: [], edges: [], suggestions: [] };
  }
}

/**
 * Check if Ollama server is available and the model is loaded.
 */
export async function checkOllamaHealth(): Promise<{
  available: boolean;
  model: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!res.ok) return { available: false, model: OLLAMA_MODEL, error: "Ollama server not responding" };

    const data = await res.json();
    const models = data.models?.map((m: { name: string }) => m.name) || [];
    const modelAvailable = models.some((m: string) => m.startsWith(OLLAMA_MODEL.split(":")[0]));

    return {
      available: modelAvailable,
      model: OLLAMA_MODEL,
      error: modelAvailable ? undefined : `Model ${OLLAMA_MODEL} not found. Run: ollama pull ${OLLAMA_MODEL}`,
    };
  } catch {
    return { available: false, model: OLLAMA_MODEL, error: "Cannot connect to Ollama at " + OLLAMA_URL };
  }
}
