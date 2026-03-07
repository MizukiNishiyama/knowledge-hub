// Client for local whisper.cpp server
// Default: whisper.cpp server running at http://localhost:8178/inference

const WHISPER_URL = process.env.WHISPER_URL || "http://localhost:8178/inference";

export interface WhisperResult {
  text: string;
  language?: string;
  segments?: { start: number; end: number; text: string }[];
}

/**
 * Send an audio buffer (WAV) to the local whisper.cpp server for transcription.
 */
export async function transcribeAudio(audioBuffer: Buffer, language = "ja"): Promise<WhisperResult> {
  const formData = new FormData();
  const uint8 = new Uint8Array(audioBuffer);
  const blob = new Blob([uint8], { type: "audio/wav" });
  formData.append("file", blob, "audio.wav");
  formData.append("language", language);
  formData.append("response_format", "json");
  // Enable word-level timestamps for better alignment
  formData.append("word_timestamps", "true");

  const res = await fetch(WHISPER_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`Whisper server error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return {
    text: data.text?.trim() || "",
    language: data.language,
    segments: data.segments,
  };
}
