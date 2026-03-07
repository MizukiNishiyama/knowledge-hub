"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface StreamingSTTOptions {
  wsUrl?: string;
  language?: string;
  onTranscript: (text: string, id: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

interface StreamingSTTState {
  isConnected: boolean;
  isCapturing: boolean;
  error: string | null;
}

/**
 * Hook for streaming Speech-to-Text via AudioWorklet + WebSocket.
 *
 * 1. Captures mic audio via AudioWorklet (raw PCM, downsampled to 16kHz)
 * 2. Streams Int16LE PCM frames via WebSocket to WS-STT server
 * 3. Receives transcription results (final/interim) via WebSocket
 */
export function useStreamingSTT({
  wsUrl = "ws://localhost:8179",
  language = "ja",
  onTranscript,
  onError,
}: StreamingSTTOptions) {
  const [state, setState] = useState<StreamingSTTState>({
    isConnected: false,
    isCapturing: false,
    error: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const callbackRef = useRef(onTranscript);
  const errorCallbackRef = useRef(onError);

  // Keep callbacks up to date
  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    errorCallbackRef.current = onError;
  }, [onError]);

  const start = useCallback(async () => {
    try {
      setState((s) => ({ ...s, error: null }));
      console.log("[StreamingSTT] Starting...");

      // 1. Connect WebSocket
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("WebSocket connection timeout"));
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          console.log("[StreamingSTT] WebSocket connected");
          setState((s) => ({ ...s, isConnected: true }));
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === "ready") {
              console.log("[StreamingSTT] Server ready");
              resolve();
            } else if (msg.type === "final") {
              console.log(`[StreamingSTT] Final [${msg.id}]: "${msg.text}"`);
              callbackRef.current(msg.text, msg.id, true);
            } else if (msg.type === "interim") {
              callbackRef.current(msg.text, msg.id || "interim", false);
            } else if (msg.type === "error") {
              console.error("[StreamingSTT] Server error:", msg.message);
              errorCallbackRef.current?.(msg.message);
            }
          } catch {
            // ignore parse errors on non-JSON messages
          }
        };

        ws.onerror = (err) => {
          clearTimeout(timeout);
          console.error("[StreamingSTT] WebSocket error:", err);
          reject(new Error("WebSocket connection failed. Is ws-stt-server running on " + wsUrl + "?"));
        };

        ws.onclose = () => {
          console.log("[StreamingSTT] WebSocket closed");
          setState((s) => ({ ...s, isConnected: false, isCapturing: false }));
        };
      });

      // Set up persistent message handler (the one in the promise only handles 'ready')
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "final") {
            callbackRef.current(msg.text, msg.id, true);
          } else if (msg.type === "interim") {
            callbackRef.current(msg.text, msg.id || "interim", false);
          } else if (msg.type === "error") {
            errorCallbackRef.current?.(msg.message);
          }
        } catch {
          // ignore
        }
      };

      // Send start command
      ws.send(JSON.stringify({ type: "start", language }));

      // 2. Get microphone access
      console.log("[StreamingSTT] Requesting microphone...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      console.log("[StreamingSTT] Microphone access granted");

      // 3. Create AudioContext and AudioWorklet
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      console.log(`[StreamingSTT] AudioContext sampleRate: ${audioContext.sampleRate}`);

      // Load the AudioWorklet processor
      await audioContext.audioWorklet.addModule("/audio-worklet-processor.js");
      console.log("[StreamingSTT] AudioWorklet module loaded");

      // Create worklet node
      const workletNode = new AudioWorkletNode(audioContext, "pcm-processor");
      workletNodeRef.current = workletNode;

      // Handle PCM frames from the worklet
      workletNode.port.onmessage = (event) => {
        const pcmBuffer = event.data as ArrayBuffer;
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(pcmBuffer);
        }
      };

      // Connect: mic → worklet
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(workletNode);
      // Don't connect worklet to destination (no playback)

      setState((s) => ({ ...s, isCapturing: true, error: null }));
      console.log("[StreamingSTT] Streaming started");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start streaming STT";
      console.error("[StreamingSTT] Error:", msg);
      setState((s) => ({ ...s, error: msg, isCapturing: false }));
      errorCallbackRef.current?.(msg);
      // Cleanup on error
      cleanup();
    }
  }, [wsUrl, language]);

  const cleanup = useCallback(() => {
    // Send stop command
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "stop" }));
    }

    // Disconnect worklet
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }

    // Close AudioContext
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    // Stop mic tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    console.log("[StreamingSTT] Stopping...");
    cleanup();
    setState({ isConnected: false, isCapturing: false, error: null });
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isConnected: state.isConnected,
    isCapturing: state.isCapturing,
    error: state.error,
    start,
    stop,
  };
}
