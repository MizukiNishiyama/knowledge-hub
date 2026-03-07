"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AudioCaptureOptions {
  onAudioChunk: (blob: Blob) => void;
  chunkIntervalMs?: number;
}

/**
 * Hook to capture microphone audio and emit complete audio files at regular intervals.
 * Stops and restarts MediaRecorder each cycle to ensure each chunk is a valid,
 * self-contained audio file (fixes Safari fragmented MP4 issue).
 */
export function useAudioCapture({
  onAudioChunk,
  chunkIntervalMs = 3000,
}: AudioCaptureOptions) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(onAudioChunk);
  const mimeTypeRef = useRef("");

  useEffect(() => {
    callbackRef.current = onAudioChunk;
  }, [onAudioChunk]);

  // Record a single complete chunk by creating a fresh MediaRecorder
  const recordOneChunk = useCallback((stream: MediaStream) => {
    return new Promise<void>((resolve) => {
      const chunks: Blob[] = [];
      const recorderOptions: MediaRecorderOptions = {};
      if (mimeTypeRef.current) recorderOptions.mimeType = mimeTypeRef.current;

      const recorder = new MediaRecorder(stream, recorderOptions);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: recorder.mimeType });
          console.log("[AudioCapture] Complete chunk:", blob.size, "bytes, type:", blob.type);
          callbackRef.current(blob);
        }
        resolve();
      };

      recorder.start();

      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        } else {
          resolve();
        }
      }, chunkIntervalMs);
    });
  }, [chunkIntervalMs]);

  const start = useCallback(async () => {
    try {
      setError(null);
      console.log("[AudioCapture] Requesting microphone access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;
      console.log("[AudioCapture] Microphone access granted");

      // Detect supported MIME type
      const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];
      mimeTypeRef.current = "";
      for (const candidate of candidates) {
        if (MediaRecorder.isTypeSupported(candidate)) {
          mimeTypeRef.current = candidate;
          break;
        }
      }
      console.log("[AudioCapture] Using MIME type:", mimeTypeRef.current || "(default)");

      setIsCapturing(true);

      // Start recording loop
      const loop = async () => {
        while (streamRef.current && streamRef.current.active) {
          await recordOneChunk(streamRef.current);
        }
      };
      loop();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to access microphone";
      setError(msg);
      console.error("[AudioCapture] Error:", err);
    }
  }, [recordOneChunk]);

  const stop = useCallback(() => {
    console.log("[AudioCapture] Stopping...");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  return { isCapturing, error, start, stop };
}
