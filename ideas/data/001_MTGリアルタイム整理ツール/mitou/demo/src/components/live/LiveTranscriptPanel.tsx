"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveTranscriptSegment } from "@/lib/types";

export default function LiveTranscriptPanel({
  segments,
  isCapturing,
}: {
  segments: LiveTranscriptSegment[];
  isCapturing: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [segments]);

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString("ja-JP");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            {isCapturing ? (
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-75" />
              </div>
            ) : (
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            )}
            <h2 className="text-[13px] font-semibold tracking-wide text-gray-700 uppercase">
              Live Transcript
            </h2>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">
            {segments.length > 0
              ? formatTime(segments[segments.length - 1].timestamp)
              : "--:--:--"}
          </span>
        </div>

        {/* Audio level indicator */}
        {isCapturing && (
          <div className="px-5 pb-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [4, 8 + Math.random() * 8, 4],
                  }}
                  transition={{
                    duration: 0.4 + Math.random() * 0.3,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="w-1 rounded-full bg-emerald-400"
                  style={{ minHeight: 4 }}
                />
              ))}
            </div>
            <span className="text-[10px] text-emerald-500 font-medium">
              録音中 - ストリーミングSTT
            </span>
          </div>
        )}
      </div>

      {/* Segments */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-3 space-y-0">
        <AnimatePresence mode="popLayout">
          {segments.map((segment) => (
            <motion.div
              key={segment.isFinal ? segment.id : "interim_live"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`py-2.5 border-b last:border-b-0 ${
                segment.isFinal ? "border-gray-100" : "border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {segment.speaker && (
                  <span className="text-[11px] font-bold text-gray-600">
                    {segment.speaker}
                  </span>
                )}
                {!segment.isFinal && (
                  <span className="flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] text-emerald-500 font-medium">
                      認識中
                    </span>
                  </span>
                )}
                <span className="text-[10px] text-gray-300 font-mono ml-auto">
                  {formatTime(segment.timestamp)}
                </span>
              </div>
              <p className={`text-[13px] leading-[1.7] ${
                segment.isFinal ? "text-gray-700" : "text-gray-400 italic"
              }`}>
                {segment.text}
                {!segment.isFinal && (
                  <span className="inline-block w-0.5 h-4 bg-emerald-400 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Listening indicator */}
        {isCapturing && segments.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[13px] text-gray-300"
              >
                音声を待機中...
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
