"use client";

import { useCallback, useRef, useState } from "react";

interface AudioCaptureOptions {
  onAudioChunk: (blob: Blob) => void;
  chunkIntervalMs?: number; // How often to send chunks (default: 3000ms)
  sampleRate?: number;
}

/**
 * Hook to capture microphone audio and emit WAV chunks at regular intervals.
 * Uses MediaRecorder API with WAV-compatible output.
 */
export function useAudioCapture({
  onAudioChunk,
  chunkIntervalMs = 3000,
}: AudioCaptureOptions) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      // Use webm/opus which is widely supported, we'll convert server-side if needed
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onAudioChunk(event.data);
        }
      };

      recorder.onerror = () => {
        setError("Recording error occurred");
        setIsCapturing(false);
      };

      recorder.start(chunkIntervalMs);
      setIsCapturing(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to access microphone";
      setError(msg);
      console.error("Audio capture error:", err);
    }
  }, [onAudioChunk, chunkIntervalMs]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    setIsCapturing(false);
  }, []);

  return { isCapturing, error, start, stop };
}
