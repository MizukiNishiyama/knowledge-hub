"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TranscriptEntry, tagLabels, StatementTag, participants } from "@/data/transcript";

const speakerColors: Record<string, string> = {
  "田中 (PM)": "#3b82f6",
  "鈴木 (UXR)": "#7c3aed",
  "山田 (Eng)": "#059669",
  "佐藤 (Biz)": "#d97706",
};

function TagBadge({ tag }: { tag: StatementTag }) {
  const config = tagLabels[tag];
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium leading-none"
      style={{
        color: config.color,
        background: config.bgColor,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      {config.label}
    </span>
  );
}

interface TranscriptPanelProps {
  entries: TranscriptEntry[];
  isStreaming: boolean;
  currentStreamingText: string;
  currentStreamingSpeaker: string;
  currentStreamingTag?: StatementTag;
  activeSpeaker: string | null;
}

export default function TranscriptPanel({
  entries,
  isStreaming,
  currentStreamingText,
  currentStreamingSpeaker,
  currentStreamingTag,
  activeSpeaker,
}: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, currentStreamingText]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with participants */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-75" />
            </div>
            <h2 className="text-[13px] font-semibold tracking-wide text-gray-700 uppercase">
              Transcript
            </h2>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">
            {entries.length > 0
              ? entries[entries.length - 1].timestamp
              : "00:00:00"}
          </span>
        </div>

        {/* Participants row */}
        <div className="flex items-center gap-2 px-5 pb-3">
          {participants.map((p) => {
            const isSpeaking = activeSpeaker === p.name;
            return (
              <div
                key={p.name}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] transition-all duration-300"
                style={{
                  background: isSpeaking ? `${p.color}12` : "transparent",
                  border: `1px solid ${isSpeaking ? p.color : "#e5e7eb"}`,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: isSpeaking ? p.color : "#d1d5db",
                    boxShadow: isSpeaking ? `0 0 6px ${p.color}60` : "none",
                  }}
                />
                <span
                  className="font-medium transition-colors duration-300"
                  style={{ color: isSpeaking ? p.color : "#9ca3af" }}
                >
                  {p.name}
                </span>
                <span
                  className="transition-colors duration-300"
                  style={{ color: isSpeaking ? `${p.color}99` : "#d1d5db" }}
                >
                  {p.role}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transcript entries */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-3 space-y-0"
      >
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="py-2.5 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[11px] font-bold"
                  style={{ color: speakerColors[entry.speaker] || "#6b7280" }}
                >
                  {entry.speaker}
                </span>
                <TagBadge tag={entry.tag} />
                <span className="text-[10px] text-gray-300 font-mono ml-auto">
                  {entry.timestamp}
                </span>
              </div>
              <p className="text-[13px] leading-[1.7] text-gray-700">
                {entry.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Currently streaming text */}
        {isStreaming && currentStreamingText && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="py-2.5"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[11px] font-bold"
                style={{
                  color: speakerColors[currentStreamingSpeaker] || "#6b7280",
                }}
              >
                {currentStreamingSpeaker}
              </span>
              {currentStreamingTag && <TagBadge tag={currentStreamingTag} />}
              <div className="flex gap-0.5 ml-1">
                <div className="typing-dot w-1 h-1 rounded-full bg-gray-400" />
                <div className="typing-dot w-1 h-1 rounded-full bg-gray-400" />
                <div className="typing-dot w-1 h-1 rounded-full bg-gray-400" />
              </div>
            </div>
            <p className="text-[13px] leading-[1.7] text-gray-500">
              {currentStreamingText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-[2px] h-[13px] bg-gray-400 ml-0.5 align-middle"
              />
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
