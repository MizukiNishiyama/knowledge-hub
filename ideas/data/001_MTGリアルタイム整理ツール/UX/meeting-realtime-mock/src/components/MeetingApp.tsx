"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import TranscriptPanel from "./TranscriptPanel";
import MindMapPanel from "./MindMapPanel";
import {
  transcriptData,
  mindMapUpdates,
  TranscriptEntry,
  MindMapUpdate,
} from "@/data/transcript";

const CHAR_DELAY = 35; // ms per character for streaming effect
const SPEED_MULTIPLIER = 0.4; // speed up the demo (lower = faster)

export default function MeetingApp() {
  const [completedEntries, setCompletedEntries] = useState<TranscriptEntry[]>(
    []
  );
  const [currentMindMapUpdates, setCurrentMindMapUpdates] = useState<
    MindMapUpdate[]
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [streamingSpeaker, setStreamingSpeaker] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

  const streamEntry = useCallback(
    (entry: TranscriptEntry) => {
      setIsStreaming(true);
      setStreamingSpeaker(entry.speaker);
      setStreamingText("");

      let charIndex = 0;
      const text = entry.text;

      if (streamTimerRef.current) clearInterval(streamTimerRef.current);

      streamTimerRef.current = setInterval(() => {
        charIndex++;
        if (charIndex <= text.length) {
          setStreamingText(text.slice(0, charIndex));
        } else {
          if (streamTimerRef.current) clearInterval(streamTimerRef.current);
          setIsStreaming(false);
          setStreamingText("");
          setStreamingSpeaker("");
          setCompletedEntries((prev) => [...prev, entry]);

          // Trigger mind map update
          const update = mindMapUpdates.find(
            (u) => u.triggeredByTranscriptId === entry.id
          );
          if (update) {
            setCurrentMindMapUpdates((prev) => [...prev, update]);
          }
        }
      }, CHAR_DELAY);
    },
    []
  );

  useEffect(() => {
    if (!isPlaying) return;

    const tick = () => {
      setElapsedMs((prev) => prev + 100);
    };
    timerRef.current = setInterval(tick, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || isStreaming) return;

    const nextEntry = transcriptData[currentEntryIndex];
    if (!nextEntry) {
      setIsPlaying(false);
      return;
    }

    if (elapsedMs >= nextEntry.delayMs * SPEED_MULTIPLIER) {
      setCurrentEntryIndex((prev) => prev + 1);
      streamEntry(nextEntry);
    }
  }, [elapsedMs, isPlaying, isStreaming, currentEntryIndex, streamEntry]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCompletedEntries([]);
    setCurrentMindMapUpdates([]);
    setIsStreaming(false);
    setStreamingText("");
    setStreamingSpeaker("");
    setElapsedMs(0);
    setCurrentEntryIndex(0);
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
  };

  const progress =
    (completedEntries.length / transcriptData.length) * 100;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0c0c14]/80 backdrop-blur-xl"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[11px] font-bold">
              MF
            </div>
            <span className="text-sm font-semibold text-white/80 tracking-tight">
              MeetingFlow
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs text-white/30">
            新規プロダクト企画会議 - 2026/03/07
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="w-32 h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-[10px] text-white/30 font-mono w-16 text-right">
            {completedEntries.length}/{transcriptData.length}
          </span>

          {!isPlaying && completedEntries.length === 0 && (
            <button
              onClick={handlePlay}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              ▶ デモ開始
            </button>
          )}

          {(isPlaying || completedEntries.length > 0) && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs text-white/40 border border-white/10 hover:bg-white/5 transition-all"
            >
              リセット
            </button>
          )}
        </div>
      </motion.header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Transcript */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-[420px] flex-shrink-0 border-r border-white/5 bg-[#0c0c14]/60"
        >
          <TranscriptPanel
            entries={completedEntries}
            isStreaming={isStreaming}
            currentStreamingText={streamingText}
            currentStreamingSpeaker={streamingSpeaker}
          />
        </motion.div>

        {/* Right: Mind Map */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 bg-[#0e0e18]"
        >
          {currentMindMapUpdates.length > 0 ? (
            <MindMapPanel updates={currentMindMapUpdates} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-4xl mb-4 opacity-20"
                >
                  🧠
                </motion.div>
                <p className="text-sm text-white/20">
                  会議が開始されると構造マップが自動生成されます
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
