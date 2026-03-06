"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { motion, AnimatePresence } from "framer-motion";
import { tagLabels, StatementTag } from "@/data/transcript";

function CustomNode({ data }: NodeProps) {
  const tag: StatementTag = data.nodeType || "agenda";
  const config = tagLabels[tag];
  const isNew = data.isNew;
  const suggestions: { text: string; type: string }[] = data.suggestions || [];

  return (
    <motion.div
      initial={isNew ? { scale: 0.5, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
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
        className="relative rounded-lg px-3.5 py-2.5 min-w-[130px] max-w-[220px]"
        style={{
          background: "#fff",
          border: `1.5px solid ${config.borderColor}`,
          boxShadow: isNew
            ? `0 2px 12px ${config.borderColor}80`
            : "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {/* Tag label at top */}
        <div
          className="text-[9px] font-bold uppercase tracking-wider mb-1.5"
          style={{ color: config.color }}
        >
          {config.label}
        </div>

        {/* Node content */}
        <div className="text-[11px] font-medium text-gray-800 leading-snug">
          {data.label}
        </div>
        {data.detail && (
          <div className="text-[10px] text-gray-400 mt-1 leading-snug">
            {data.detail}
          </div>
        )}

        {/* New indicator */}
        {isNew && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
            style={{
              background: config.color,
              boxShadow: `0 0 6px ${config.color}80`,
            }}
          />
        )}
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.map((s: { text: string; type: string }, i: number) => {
          const angle = -20 + i * 25;
          const rad = (angle * Math.PI) / 180;
          const distance = 120;
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;

          const isRisk = s.type === "concern";
          const isNext = s.type === "next-step";

          return (
            <motion.div
              key={`suggestion-${i}`}
              initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1, x, y }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.4, type: "spring" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ zIndex: 10 }}
            >
              <div
                className="rounded-md px-2 py-1 text-[9px] max-w-[150px] whitespace-nowrap border"
                style={{
                  background: isRisk ? "#fef2f2" : isNext ? "#f5f3ff" : "#fffbeb",
                  borderColor: isRisk ? "#fca5a5" : isNext ? "#c4b5fd" : "#fcd34d",
                  color: isRisk ? "#dc2626" : isNext ? "#7c3aed" : "#d97706",
                }}
              >
                {isRisk ? "! " : isNext ? "-> " : "? "}
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
