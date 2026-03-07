"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { motion, AnimatePresence } from "framer-motion";
import { tagLabels, StatementTag, NodePriority, NodeStatus } from "@/data/transcript";

const speakerColors: Record<string, string> = {
  "田中 (PM)": "#3b82f6",
  "鈴木 (UXR)": "#7c3aed",
  "山田 (Eng)": "#059669",
  "佐藤 (Biz)": "#d97706",
};

const priorityConfig: Record<NodePriority, { label: string; color: string; bg: string }> = {
  high: { label: "HIGH", color: "#dc2626", bg: "#fef2f2" },
  medium: { label: "MED", color: "#d97706", bg: "#fffbeb" },
  low: { label: "LOW", color: "#6b7280", bg: "#f9fafb" },
};

const statusConfig: Record<NodeStatus, { label: string; color: string; bg: string; icon: string }> = {
  open: { label: "未対応", color: "#6b7280", bg: "#f3f4f6", icon: "○" },
  "in-progress": { label: "進行中", color: "#2563eb", bg: "#eff6ff", icon: "◐" },
  resolved: { label: "解決済", color: "#059669", bg: "#ecfdf5", icon: "●" },
  blocked: { label: "ブロック", color: "#dc2626", bg: "#fef2f2", icon: "✕" },
};

function CustomNode({ data }: NodeProps) {
  const tag: StatementTag = data.nodeType || "agenda";
  const config = tagLabels[tag];
  const isNew = data.isNew;
  const speaker: string | undefined = data.speaker;
  const summary: string | undefined = data.summary;
  const evidence: string | undefined = data.evidence;
  const priority: NodePriority | undefined = data.priority;
  const status: NodeStatus | undefined = data.status;
  const tags: string[] = data.tags || [];
  const suggestions: { text: string; type: string }[] = data.suggestions || [];

  const speakerColor = speaker ? speakerColors[speaker] || "#6b7280" : undefined;
  const pConfig = priority ? priorityConfig[priority] : undefined;
  const sConfig = status ? statusConfig[status] : undefined;

  return (
    <motion.div
      initial={isNew ? { scale: 0.5, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="relative"
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />

      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          background: "#fff",
          border: `1.5px solid ${config.borderColor}`,
          boxShadow: isNew
            ? `0 3px 16px ${config.borderColor}80`
            : "0 1px 6px rgba(0,0,0,0.06)",
          width: 300,
        }}
      >
        {/* Top color bar */}
        <div className="h-[3px]" style={{ background: config.color }} />

        <div className="px-3.5 py-2.5">
          {/* Row 1: Tag + Priority + Status */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
              style={{ color: config.color, background: config.bgColor }}
            >
              {config.label}
            </span>
            {pConfig && (
              <span
                className="inline-flex items-center px-1 py-0.5 rounded text-[8px] font-bold tracking-wider"
                style={{ color: pConfig.color, background: pConfig.bg }}
              >
                {pConfig.label}
              </span>
            )}
            {sConfig && (
              <span
                className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-medium"
                style={{ color: sConfig.color, background: sConfig.bg }}
              >
                <span className="text-[7px]">{sConfig.icon}</span>
                {sConfig.label}
              </span>
            )}
            {/* Spacer to push speaker right */}
            <span className="flex-1" />
            {speaker && (
              <span
                className="flex items-center gap-1 text-[9px] font-medium"
                style={{ color: speakerColor }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: speakerColor }}
                />
                {speaker}
              </span>
            )}
          </div>

          {/* Title */}
          <div className="text-[12px] font-semibold text-gray-800 leading-snug">
            {data.label}
          </div>

          {/* Summary */}
          {summary && (
            <div className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
              {summary}
            </div>
          )}

          {/* Evidence / Data */}
          {evidence && (
            <div
              className="flex items-start gap-1.5 mt-2 px-2 py-1.5 rounded-md text-[9px] leading-snug"
              style={{ background: config.bgColor, color: config.color }}
            >
              <span className="font-bold flex-shrink-0 mt-px">DATA</span>
              <span className="opacity-80">{evidence}</span>
            </div>
          )}

          {/* Detail footnote */}
          {data.detail && (
            <div className="text-[9px] text-gray-400 mt-1.5 leading-snug border-t border-gray-100 pt-1.5">
              {data.detail}
            </div>
          )}

          {/* Tags row */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((t: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-medium text-gray-500 bg-gray-100 border border-gray-200"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* New indicator */}
        {isNew && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-2 w-2 h-2 rounded-full"
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
          const distance = 170;
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
                className="rounded-md px-2 py-1 text-[9px] max-w-[180px] whitespace-nowrap border"
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

      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
    </motion.div>
  );
}

export default memo(CustomNode);
