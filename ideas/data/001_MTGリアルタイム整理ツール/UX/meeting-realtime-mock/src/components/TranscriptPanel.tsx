"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TranscriptEntry } from "@/data/transcript";

const speakerColors: Record<string, string> = {
  "田中 (PM)": "#4f8ff7",
  "鈴木 (UXR)": "#8b5cf6",
  "山田 (Eng)": "#34d399",
  "佐藤 (Biz)": "#f59e0b",
};

interface TranscriptPanelProps {
  entries: TranscriptEntry[];
  isStreaming: boolean;
  currentStreamingText: string;
  currentStreamingSpeaker: string;
}

export default function TranscriptPanel({
  entries,
  isStreaming,
  currentStreamingText,
  currentStreamingSpeaker,
}: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, currentStreamingText]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide text-white/90">
            TRANSCRIPT
          </h2>
        </div>
        <span className="text-xs text-white/30 font-mono">
          {entries.length > 0
            ? entries[entries.length - 1].timestamp
            : "00:00:00"}
        </span>
      </div>

      {/* Transcript entries */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-1"
      >
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group"
            >
              <div className="flex items-baseline gap-2 mt-4 mb-1">
                <span
                  className="text-xs font-bold tracking-wide"
                  style={{ color: speakerColors[entry.speaker] || "#9090a8" }}
                >
                  {entry.speaker}
                </span>
                <span className="text-[10px] text-white/20 font-mono">
                  {entry.timestamp}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-white/75 pl-0">
                {entry.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Currently streaming text */}
        {isStreaming && currentStreamingText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-baseline gap-2 mt-4 mb-1">
              <span
                className="text-xs font-bold tracking-wide"
                style={{
                  color:
                    speakerColors[currentStreamingSpeaker] || "#9090a8",
                }}
              >
                {currentStreamingSpeaker}
              </span>
              <div className="flex gap-0.5">
                <div className="typing-dot w-1 h-1 rounded-full bg-white/40" />
                <div className="typing-dot w-1 h-1 rounded-full bg-white/40" />
                <div className="typing-dot w-1 h-1 rounded-full bg-white/40" />
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-white/50 pl-0">
              {currentStreamingText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-[2px] h-[14px] bg-white/50 ml-0.5 align-middle"
              />
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
