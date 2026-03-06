"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { motion, AnimatePresence } from "framer-motion";

const typeConfig: Record<
  string,
  { bg: string; border: string; icon: string; glow: string }
> = {
  topic: {
    bg: "rgba(79, 143, 247, 0.08)",
    border: "rgba(79, 143, 247, 0.35)",
    icon: "📋",
    glow: "rgba(79, 143, 247, 0.2)",
  },
  decision: {
    bg: "rgba(52, 211, 153, 0.08)",
    border: "rgba(52, 211, 153, 0.4)",
    icon: "✅",
    glow: "rgba(52, 211, 153, 0.25)",
  },
  action: {
    bg: "rgba(139, 92, 246, 0.08)",
    border: "rgba(139, 92, 246, 0.35)",
    icon: "⚡",
    glow: "rgba(139, 92, 246, 0.2)",
  },
  question: {
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.3)",
    icon: "❓",
    glow: "rgba(245, 158, 11, 0.15)",
  },
  insight: {
    bg: "rgba(79, 143, 247, 0.06)",
    border: "rgba(79, 143, 247, 0.25)",
    icon: "💡",
    glow: "rgba(79, 143, 247, 0.15)",
  },
  risk: {
    bg: "rgba(244, 63, 94, 0.08)",
    border: "rgba(244, 63, 94, 0.35)",
    icon: "⚠️",
    glow: "rgba(244, 63, 94, 0.2)",
  },
};

function CustomNode({ data }: NodeProps) {
  const config = typeConfig[data.nodeType] || typeConfig.topic;
  const isNew = data.isNew;
  const suggestions: { text: string; type: string }[] = data.suggestions || [];

  return (
    <motion.div
      initial={isNew ? { scale: 0.3, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.5,
      }}
      className="relative"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-0 !w-3 !h-3"
      />

      {/* Main node */}
      <div
        className="relative rounded-xl px-4 py-3 min-w-[140px] max-w-[220px] backdrop-blur-sm"
        style={{
          background: config.bg,
          border: `1px solid ${config.border}`,
          boxShadow: isNew ? `0 0 24px ${config.glow}` : `0 0 12px ${config.glow}`,
        }}
      >
        <div className="flex items-start gap-2">
          <span className="text-sm flex-shrink-0 mt-0.5">{config.icon}</span>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-white/90 leading-tight">
              {data.label}
            </div>
            {data.detail && (
              <div className="text-[10px] text-white/40 mt-1 leading-snug">
                {data.detail}
              </div>
            )}
          </div>
        </div>

        {/* New indicator */}
        {isNew && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-blue-500"
            style={{ boxShadow: "0 0 8px rgba(79, 143, 247, 0.6)" }}
          />
        )}
      </div>

      {/* Suggestions floating around the node */}
      <AnimatePresence>
        {suggestions.map((s: { text: string; type: string }, i: number) => {
          const angle = -30 + i * 30;
          const rad = (angle * Math.PI) / 180;
          const distance = 130;
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;

          return (
            <motion.div
              key={`suggestion-${i}`}
              initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
              animate={{ opacity: 0.7, scale: 1, x, y }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5, type: "spring" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ zIndex: 10 }}
            >
              <div
                className="rounded-lg px-2.5 py-1.5 text-[9px] max-w-[160px] whitespace-nowrap backdrop-blur-md"
                style={{
                  background:
                    s.type === "risk"
                      ? "rgba(244, 63, 94, 0.12)"
                      : s.type === "next-step"
                      ? "rgba(139, 92, 246, 0.12)"
                      : "rgba(245, 158, 11, 0.12)",
                  border: `1px solid ${
                    s.type === "risk"
                      ? "rgba(244, 63, 94, 0.25)"
                      : s.type === "next-step"
                      ? "rgba(139, 92, 246, 0.25)"
                      : "rgba(245, 158, 11, 0.25)"
                  }`,
                  color:
                    s.type === "risk"
                      ? "rgba(244, 63, 94, 0.8)"
                      : s.type === "next-step"
                      ? "rgba(139, 92, 246, 0.8)"
                      : "rgba(245, 158, 11, 0.8)",
                }}
              >
                {s.type === "risk" ? "⚠ " : s.type === "next-step" ? "→ " : "? "}
                {s.text}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-3 !h-3"
      />
    </motion.div>
  );
}

export default memo(CustomNode);
