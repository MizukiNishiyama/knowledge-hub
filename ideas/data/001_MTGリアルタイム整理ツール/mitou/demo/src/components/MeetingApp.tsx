"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import TranscriptPanel from "./TranscriptPanel";
import MindMapPanel from "./MindMapPanel";
import MeetingSummary from "./MeetingSummary";
import {
  transcriptData,
  mindMapUpdates,
  TranscriptEntry,
  MindMapUpdate,
  StatementTag,
} from "@/data/transcript";

// 1文字あたり100ms = 日本語で実際の発話速度に近いペース
const CHAR_DELAY = 100;
// delayMsをそのまま使う（実際の発話間隔ベース）が、デモ用に0.25倍速にする
const SPEED_MULTIPLIER = 0.25;

export default function MeetingApp() {
  const [completedEntries, setCompletedEntries] = useState<TranscriptEntry[]>([]);
  const [currentMindMapUpdates, setCurrentMindMapUpdates] = useState<MindMapUpdate[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [streamingSpeaker, setStreamingSpeaker] = useState("");
  const [streamingTag, setStreamingTag] = useState<StatementTag | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [meetingFinished, setMeetingFinished] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

  const streamEntry = useCallback((entry: TranscriptEntry) => {
    setIsStreaming(true);
    setStreamingSpeaker(entry.speaker);
    setStreamingTag(entry.tag);
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
        setStreamingTag(undefined);
        setCompletedEntries((prev) => [...prev, entry]);

        const update = mindMapUpdates.find(
          (u) => u.triggeredByTranscriptId === entry.id
        );
        if (update) {
          setCurrentMindMapUpdates((prev) => [...prev, update]);
        }
      }
    }, CHAR_DELAY);
  }, []);

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
      setMeetingFinished(true);
      setTimeout(() => setShowSummary(true), 1500);
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
    setShowSummary(false);
    setMeetingFinished(false);
    setCompletedEntries([]);
    setCurrentMindMapUpdates([]);
    setIsStreaming(false);
    setStreamingText("");
    setStreamingSpeaker("");
    setStreamingTag(undefined);
    setElapsedMs(0);
    setCurrentEntryIndex(0);
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
  };

  const progress = (completedEntries.length / transcriptData.length) * 100;

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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
              MF
            </div>
            <span className="text-sm font-semibold text-gray-800 tracking-tight">
              MeetingFlow
            </span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-xs text-gray-400">
            新規プロダクト企画会議 - 2026/03/07
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="w-32 h-1 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-[10px] text-gray-400 font-mono w-16 text-right">
            {completedEntries.length}/{transcriptData.length}
          </span>

          {!isPlaying && completedEntries.length === 0 && (
            <button
              onClick={handlePlay}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all hover:scale-105 active:scale-95"
            >
              デモ開始
            </button>
          )}

          {meetingFinished && !showSummary && (
            <button
              onClick={() => setShowSummary(true)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-all hover:scale-105 active:scale-95"
            >
              議事録を表示
            </button>
          )}

          {(isPlaying || completedEntries.length > 0) && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
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
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-[440px] flex-shrink-0 border-r border-gray-200 bg-white"
        >
          <TranscriptPanel
            entries={completedEntries}
            isStreaming={isStreaming}
            currentStreamingText={streamingText}
            currentStreamingSpeaker={streamingSpeaker}
            currentStreamingTag={streamingTag}
            activeSpeaker={isStreaming ? streamingSpeaker : null}
          />
        </motion.div>

        {/* Right: Mind Map */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-1 bg-gray-50"
        >
          {currentMindMapUpdates.length > 0 ? (
            <MindMapPanel updates={currentMindMapUpdates} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-3xl mb-3 opacity-30"
                >
                  🧠
                </motion.div>
                <p className="text-sm text-gray-300">
                  会議が開始されると構造マップが自動生成されます
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Meeting Summary Overlay */}
      {showSummary && (
        <MeetingSummary
          entries={completedEntries}
          updates={currentMindMapUpdates}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}
