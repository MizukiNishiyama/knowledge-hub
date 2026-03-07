"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { motion } from "framer-motion";

// ─────────────────────────────────────────
// 比較表ノード (MVP案 A/B/C)
// ─────────────────────────────────────────
function ComparisonTableNodeRaw({ data }: NodeProps) {
  const isNew = data.isNew;
  const items: {
    label: string;
    values: string[];
    highlight?: number; // which column to highlight
  }[] = data.rows || [];
  const headers: string[] = data.headers || [];
  const recommendIdx: number | undefined = data.recommendIdx;

  return (
    <motion.div
      initial={isNew ? { scale: 0.5, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative"
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />

      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: "#fff",
          border: "1.5px solid #c4b5fd",
          boxShadow: isNew ? "0 2px 16px rgba(124,58,237,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
          minWidth: 340,
        }}
      >
        {/* Title */}
        <div className="px-3 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100">
          <div className="text-[9px] font-bold uppercase tracking-wider text-violet-600">比較表</div>
          <div className="text-[11px] font-semibold text-gray-800">{data.label}</div>
        </div>

        {/* Table */}
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-2.5 py-1.5 text-left text-gray-400 font-medium"></th>
              {headers.map((h: string, i: number) => (
                <th
                  key={i}
                  className="px-2.5 py-1.5 text-center font-semibold"
                  style={{
                    color: i === recommendIdx ? "#7c3aed" : "#374151",
                    background: i === recommendIdx ? "#f5f3ff" : "transparent",
                  }}
                >
                  {h}
                  {i === recommendIdx && (
                    <span className="ml-1 text-[8px] text-violet-500 font-normal">推奨</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((row, ri) => (
              <tr key={ri} className="border-b border-gray-50 last:border-b-0">
                <td className="px-2.5 py-1.5 text-gray-500 font-medium whitespace-nowrap">{row.label}</td>
                {row.values.map((v: string, ci: number) => (
                  <td
                    key={ci}
                    className="px-2.5 py-1.5 text-center"
                    style={{
                      color: ci === recommendIdx ? "#5b21b6" : "#4b5563",
                      background: ci === recommendIdx ? "#faf5ff" : "transparent",
                      fontWeight: ci === recommendIdx ? 600 : 400,
                    }}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isNew && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-violet-600"
          style={{ boxShadow: "0 0 6px rgba(124,58,237,0.6)" }}
        />
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
    </motion.div>
  );
}

// ─────────────────────────────────────────
// ガントチャートノード (スケジュール)
// ─────────────────────────────────────────
function GanttChartNodeRaw({ data }: NodeProps) {
  const isNew = data.isNew;
  const tasks: {
    label: string;
    start: number; // week offset
    duration: number; // weeks
    color: string;
    parallel?: boolean;
  }[] = data.tasks || [];
  const months: string[] = data.months || [];
  const totalWeeks = data.totalWeeks || 16;
  const milestones: { label: string; week: number; color: string }[] = data.milestones || [];

  const colWidth = 22; // px per week
  const chartWidth = totalWeeks * colWidth;

  return (
    <motion.div
      initial={isNew ? { scale: 0.5, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative"
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />

      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: "#fff",
          border: "1.5px solid #6ee7b7",
          boxShadow: isNew ? "0 2px 16px rgba(5,150,105,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
          minWidth: chartWidth + 140,
        }}
      >
        {/* Title */}
        <div className="px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
          <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">スケジュール</div>
          <div className="text-[11px] font-semibold text-gray-800">{data.label}</div>
        </div>

        <div className="px-3 py-2">
          {/* Month headers */}
          <div className="flex ml-[120px]">
            {months.map((m: string, i: number) => (
              <div
                key={i}
                className="text-[9px] text-gray-400 font-medium text-center"
                style={{ width: colWidth * 4 }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Week grid lines + tasks */}
          <div className="relative mt-1">
            {/* Grid lines */}
            <div className="absolute top-0 left-[120px] flex h-full pointer-events-none">
              {Array.from({ length: totalWeeks + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="border-l h-full"
                  style={{
                    borderColor: i % 4 === 0 ? "#e5e7eb" : "#f3f4f6",
                    width: colWidth,
                  }}
                />
              ))}
            </div>

            {/* Task bars */}
            {tasks.map((task, i) => (
              <div key={i} className="flex items-center h-[22px] mb-1 relative">
                <div className="text-[9px] text-gray-600 font-medium w-[120px] truncate pr-2">
                  {task.label}
                </div>
                <div className="relative" style={{ width: chartWidth }}>
                  <motion.div
                    initial={isNew ? { scaleX: 0 } : false}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                    className="absolute h-[14px] rounded-sm top-[4px]"
                    style={{
                      left: task.start * colWidth,
                      width: task.duration * colWidth - 2,
                      background: task.color,
                      opacity: 0.8,
                      transformOrigin: "left",
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Milestones */}
            {milestones.map((ms, i) => (
              <div key={`ms-${i}`} className="flex items-center h-[20px] relative">
                <div className="text-[9px] text-gray-500 font-medium w-[120px] truncate pr-2">
                  {ms.label}
                </div>
                <div className="relative" style={{ width: chartWidth }}>
                  <motion.div
                    initial={isNew ? { scale: 0 } : false}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                    className="absolute top-[3px]"
                    style={{ left: ms.week * colWidth - 5 }}
                  >
                    <div
                      className="w-[10px] h-[10px] rotate-45"
                      style={{ background: ms.color }}
                    />
                  </motion.div>
                  {/* Dashed line to milestone */}
                  <div
                    className="absolute top-[7px] border-t-2 border-dashed"
                    style={{
                      left: 0,
                      width: ms.week * colWidth - 5,
                      borderColor: `${ms.color}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isNew && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500"
          style={{ boxShadow: "0 0 6px rgba(5,150,105,0.6)" }}
        />
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
    </motion.div>
  );
}

// ─────────────────────────────────────────
// メトリクスカードノード (KPI / 価格)
// ─────────────────────────────────────────
function MetricsCardNodeRaw({ data }: NodeProps) {
  const isNew = data.isNew;
  const metrics: {
    label: string;
    value: string;
    sub?: string;
    color: string;
  }[] = data.metrics || [];

  return (
    <motion.div
      initial={isNew ? { scale: 0.5, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative"
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />

      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: "#fff",
          border: "1.5px solid #fcd34d",
          boxShadow: isNew ? "0 2px 16px rgba(217,119,6,0.12)" : "0 1px 4px rgba(0,0,0,0.06)",
          minWidth: 280,
        }}
      >
        {/* Title */}
        <div className="px-3 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100">
          <div className="text-[9px] font-bold uppercase tracking-wider text-amber-600">KPI</div>
          <div className="text-[11px] font-semibold text-gray-800">{data.label}</div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-0">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={isNew ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="px-3 py-2.5 border-b border-r border-gray-50 last:border-r-0"
            >
              <div className="text-[9px] text-gray-400 font-medium mb-0.5">{m.label}</div>
              <div className="text-[14px] font-bold" style={{ color: m.color }}>
                {m.value}
              </div>
              {m.sub && (
                <div className="text-[8px] text-gray-400 mt-0.5">{m.sub}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {isNew && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500"
          style={{ boxShadow: "0 0 6px rgba(217,119,6,0.6)" }}
        />
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
    </motion.div>
  );
}

export const ComparisonTableNode = memo(ComparisonTableNodeRaw);
export const GanttChartNode = memo(GanttChartNodeRaw);
export const MetricsCardNode = memo(MetricsCardNodeRaw);
