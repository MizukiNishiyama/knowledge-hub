"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useAudioCapture } from "@/lib/useAudioCapture";
import LiveTranscriptPanel from "./LiveTranscriptPanel";
import LiveMindMapPanel from "./LiveMindMapPanel";
import MeetingSummary from "../MeetingSummary";
import {
  LiveTranscriptSegment,
  StructureUpdate,
  StructuredNode,
} from "@/lib/types";
import {
  TranscriptEntry,
  MindMapUpdate,
  MindMapNode as DemoMindMapNode,
  MindMapEdge as DemoMindMapEdge,
  SuggestionItem,
} from "@/data/transcript";

interface HealthStatus {
  ready: boolean;
  ollama: { available: boolean; model: string; error?: string };
  whisper: { available: boolean; url: string; error?: string };
}

export default function LiveMeetingApp() {
  const [segments, setSegments] = useState<LiveTranscriptSegment[]>([]);
  const [structureUpdates, setStructureUpdates] = useState<StructureUpdate[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const segmentCounter = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStructure = useRef(false);

  // Check backend health on mount
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() =>
        setHealth({
          ready: false,
          ollama: { available: false, model: "qwen3.5:4b", error: "Cannot reach server" },
          whisper: { available: false, url: "", error: "Cannot reach server" },
        })
      );
  }, []);

  // Elapsed timer
  useEffect(() => {
    if (meetingStarted) {
      timerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [meetingStarted]);

  // Collect all existing node IDs
  const allNodeIds = structureUpdates.flatMap((u) => u.nodes.map((n) => n.id));

  // Build context from past segments
  const buildContext = useCallback(() => {
    return segments
      .filter((s) => s.isFinal)
      .map((s) => `${s.speaker || "Unknown"}: ${s.text}`)
      .join("\n");
  }, [segments]);

  // Send text to LLM for structuring
  const requestStructure = useCallback(
    async (newText: string) => {
      if (pendingStructure.current || !newText.trim()) return;
      pendingStructure.current = true;
      setIsProcessing(true);
      try {
        const res = await fetch("/api/structure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newText,
            previousContext: buildContext(),
            existingNodeIds: allNodeIds,
          }),
        });
        if (res.ok) {
          const update: StructureUpdate = await res.json();
          if (update.nodes.length > 0) {
            setStructureUpdates((prev) => [...prev, update]);
          }
        }
      } catch (err) {
        console.error("Structure request failed:", err);
      } finally {
        pendingStructure.current = false;
        setIsProcessing(false);
      }
    },
    [buildContext, allNodeIds]
  );

  // Handle audio chunk from mic
  const handleAudioChunk = useCallback(
    async (blob: Blob) => {
      try {
        const formData = new FormData();
        formData.append("audio", blob, "chunk.webm");
        formData.append("language", "ja");

        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!data.text || data.text.trim().length === 0) return;

        const segId = `seg_${++segmentCounter.current}`;
        const newSegment: LiveTranscriptSegment = {
          id: segId,
          text: data.text.trim(),
          timestamp: Date.now(),
          isFinal: true,
          language: data.language,
        };
        setSegments((prev) => [...prev, newSegment]);

        // Trigger structuring every 2 segments or if text is substantial
        if (segmentCounter.current % 2 === 0 || data.text.length > 50) {
          requestStructure(data.text.trim());
        }
      } catch (err) {
        console.error("Transcription failed:", err);
      }
    },
    [requestStructure]
  );

  const { isCapturing, error: micError, start: startMic, stop: stopMic } =
    useAudioCapture({
      onAudioChunk: handleAudioChunk,
      chunkIntervalMs: 3000,
    });

  const handleStart = () => {
    setMeetingStarted(true);
    startMic();
  };

  const handleStop = () => {
    stopMic();
    // Show summary after a brief delay
    setTimeout(() => setShowSummary(true), 1000);
  };

  const handleReset = () => {
    stopMic();
    setSegments([]);
    setStructureUpdates([]);
    setMeetingStarted(false);
    setShowSummary(false);
    setElapsedSec(0);
    segmentCounter.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Convert StructureUpdates → MindMapUpdate[] for reusing existing MindMapPanel
  const mindMapUpdates: MindMapUpdate[] = structureUpdates.map((su, idx) => ({
    triggeredByTranscriptId: `live_${idx}`,
    nodes: su.nodes.map((n) => ({
      id: n.id,
      label: n.label,
      type: n.type,
      parentId: n.parentId,
      detail: n.detail,
      speaker: n.speaker,
      summary: n.summary,
      evidence: n.evidence,
      priority: n.priority,
      status: n.status,
      tags: n.tags,
    })) as DemoMindMapNode[],
    edges: su.edges.map((e) => ({
      source: e.source,
      target: e.target,
      label: e.label,
    })) as DemoMindMapEdge[],
    suggestions: su.suggestions as SuggestionItem[] | undefined,
  }));

  // Convert segments → TranscriptEntry[] for MeetingSummary
  const transcriptEntries: TranscriptEntry[] = segments
    .filter((s) => s.isFinal)
    .map((s, i) => ({
      id: s.id,
      speaker: s.speaker || "参加者",
      speakerRole: "",
      text: s.text,
      timestamp: new Date(s.timestamp).toLocaleTimeString("ja-JP"),
      delayMs: 0,
      tag: "fact" as const,
    }));

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Top bar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 py-2.5 border-b border-gray-200 bg-white"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-[11px] font-bold text-white">
              MF
            </div>
            <span className="text-sm font-semibold text-gray-800 tracking-tight">
              MeetingFlow
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200">
              LIVE
            </span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          {meetingStarted && (
            <div className="flex items-center gap-2">
              {isCapturing && (
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-75" />
                </div>
              )}
              <span className="text-xs font-mono text-gray-500">
                {formatTime(elapsedSec)}
              </span>
              <span className="text-[10px] text-gray-400">
                {segments.filter((s) => s.isFinal).length} segments
              </span>
              {isProcessing && (
                <span className="text-[10px] text-indigo-500 animate-pulse">
                  AI処理中...
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Health indicators */}
          {health && (
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: health.whisper.available ? "#059669" : "#dc2626" }}
                />
                <span className="text-gray-400">Whisper</span>
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: health.ollama.available ? "#059669" : "#dc2626" }}
                />
                <span className="text-gray-400">{health.ollama.model}</span>
              </span>
            </div>
          )}

          {!meetingStarted && (
            <button
              onClick={handleStart}
              disabled={!health?.ready}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              会議を開始
            </button>
          )}

          {meetingStarted && isCapturing && (
            <button
              onClick={handleStop}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
            >
              会議を終了
            </button>
          )}

          {meetingStarted && !isCapturing && (
            <>
              <button
                onClick={() => setShowSummary(true)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-all"
              >
                議事録を表示
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                リセット
              </button>
            </>
          )}

          <a
            href="/demo"
            className="px-3 py-1.5 rounded-lg text-[10px] text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all"
          >
            Demo版
          </a>
        </div>
      </motion.header>

      {/* Error / Setup messages */}
      {micError && (
        <div className="px-6 py-2 bg-red-50 border-b border-red-100 text-[12px] text-red-600">
          マイクエラー: {micError}
        </div>
      )}
      {health && !health.ready && (
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-100">
          <div className="text-[12px] font-semibold text-amber-700 mb-1">
            セットアップが必要です
          </div>
          <div className="text-[11px] text-amber-600 space-y-1">
            {!health.whisper.available && (
              <p>
                Whisper: {health.whisper.error || "未接続"} →{" "}
                <code className="bg-amber-100 px-1 rounded text-[10px]">
                  ./server -m models/ggml-large-v3-turbo.bin -l ja --port 8178
                </code>
              </p>
            )}
            {!health.ollama.available && (
              <p>
                Ollama: {health.ollama.error || "未接続"} →{" "}
                <code className="bg-amber-100 px-1 rounded text-[10px]">
                  ollama pull {health.ollama.model} && ollama serve
                </code>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Live Transcript */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-[440px] flex-shrink-0 border-r border-gray-200 bg-white"
        >
          <LiveTranscriptPanel
            segments={segments}
            isCapturing={isCapturing}
          />
        </motion.div>

        {/* Right: Mind Map */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-1 bg-gray-50"
        >
          {mindMapUpdates.length > 0 ? (
            <LiveMindMapPanel updates={mindMapUpdates} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-sm">
                {!meetingStarted ? (
                  <>
                    <div className="text-4xl mb-4 opacity-20">
                      🎙
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      マイクから会議音声をリアルタイムで取得し
                    </p>
                    <p className="text-sm text-gray-400">
                      AIが自動で構造化マップを生成します
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-3 text-[10px] text-gray-300">
                      <span>Whisper STT</span>
                      <span>→</span>
                      <span>Qwen 3.5 LLM</span>
                      <span>→</span>
                      <span>Structure Map</span>
                    </div>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl mb-3 opacity-30"
                    >
                      🧠
                    </motion.div>
                    <p className="text-sm text-gray-300">
                      音声を認識中...構造マップがまもなく生成されます
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Meeting Summary Overlay */}
      {showSummary && (
        <MeetingSummary
          entries={transcriptEntries}
          updates={mindMapUpdates}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}
