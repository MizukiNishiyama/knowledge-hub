"use client";

import { motion } from "framer-motion";
import {
  TranscriptEntry,
  MindMapUpdate,
  tagLabels,
  participants,
  StatementTag,
} from "@/data/transcript";

const speakerColors: Record<string, string> = {
  "田中 (PM)": "#3b82f6",
  "鈴木 (UXR)": "#7c3aed",
  "山田 (Eng)": "#059669",
  "佐藤 (Biz)": "#d97706",
};

interface MeetingSummaryProps {
  entries: TranscriptEntry[];
  updates: MindMapUpdate[];
  onClose: () => void;
}

export default function MeetingSummary({
  entries,
  updates,
  onClose,
}: MeetingSummaryProps) {
  // Extract decisions
  const decisions = updates.flatMap((u) =>
    u.nodes.filter((n) => n.type === "decision")
  );

  // Extract action items
  const actions = updates.flatMap((u) =>
    u.nodes.filter((n) => n.type === "action")
  );

  // Extract concerns (resolved and open)
  const concerns = updates.flatMap((u) =>
    u.nodes.filter((n) => n.type === "concern")
  );

  // Extract key proposals
  const proposals = updates.flatMap((u) =>
    u.nodes.filter((n) => n.type === "proposal" && !n.richType)
  );

  // Speaker stats
  const speakerStats = participants.map((p) => {
    const speakerEntries = entries.filter((e) => e.speaker === p.name);
    const charCount = speakerEntries.reduce((sum, e) => sum + e.text.length, 0);
    const tagCounts: Partial<Record<StatementTag, number>> = {};
    speakerEntries.forEach((e) => {
      tagCounts[e.tag] = (tagCounts[e.tag] || 0) + 1;
    });
    return {
      ...p,
      entryCount: speakerEntries.length,
      charCount,
      tagCounts,
    };
  });

  const totalChars = speakerStats.reduce((sum, s) => sum + s.charCount, 0);

  // Meeting duration
  const firstTs = entries[0]?.timestamp || "00:00:00";
  const lastTs = entries[entries.length - 1]?.timestamp || "00:00:00";

  // Tag distribution
  const tagDist: Partial<Record<StatementTag, number>> = {};
  entries.forEach((e) => {
    tagDist[e.tag] = (tagDist[e.tag] || 0) + 1;
  });
  const tagEntries = Object.entries(tagDist)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm overflow-y-auto py-8"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="w-[880px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-6 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-50" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-white/60 mb-1">
                  Meeting Minutes
                </div>
                <h1 className="text-xl font-bold tracking-tight">
                  新規プロダクト企画会議 議事録
                </h1>
                <div className="flex items-center gap-4 mt-2 text-[12px] text-white/70">
                  <span>2026/03/07</span>
                  <span>{firstTs} - {lastTs}</span>
                  <span>{entries.length} 発言</span>
                  <span>{participants.length} 名参加</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-8 py-6 space-y-6"
        >
          {/* Overview cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-4 gap-3">
            {[
              { label: "決定事項", value: decisions.length, unit: "件", color: "#059669", bg: "#ecfdf5" },
              { label: "アクション", value: actions.length, unit: "件", color: "#7c3aed", bg: "#f5f3ff" },
              { label: "懸念・リスク", value: concerns.length, unit: "件", color: "#dc2626", bg: "#fef2f2" },
              { label: "提案", value: proposals.length, unit: "件", color: "#0284c7", bg: "#e0f2fe" },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300 }}
                className="rounded-xl border px-4 py-3"
                style={{ borderColor: `${card.color}30`, background: card.bg }}
              >
                <div className="text-[10px] font-medium" style={{ color: `${card.color}99` }}>
                  {card.label}
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold" style={{ color: card.color }}>
                    {card.value}
                  </span>
                  <span className="text-[11px]" style={{ color: `${card.color}80` }}>
                    {card.unit}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Decisions */}
          <motion.div variants={itemVariants}>
            <SectionHeader title="決定事項" color="#059669" />
            <div className="space-y-2 mt-3">
              {decisions.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex gap-3 p-3 rounded-lg border border-emerald-100 bg-emerald-50/50"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[11px] font-bold text-emerald-700 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-gray-800">{d.label}</span>
                      {d.speaker && (
                        <span className="text-[10px] font-medium" style={{ color: speakerColors[d.speaker] }}>
                          {d.speaker}
                        </span>
                      )}
                    </div>
                    {d.summary && (
                      <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">{d.summary}</div>
                    )}
                    {d.detail && (
                      <div className="text-[10px] text-gray-400 mt-1">{d.detail}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Items */}
          <motion.div variants={itemVariants}>
            <SectionHeader title="アクションアイテム" color="#7c3aed" />
            <div className="mt-3 rounded-lg border border-violet-100 overflow-hidden">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="bg-violet-50/80 border-b border-violet-100">
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-violet-600 uppercase tracking-wider">タスク</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-violet-600 uppercase tracking-wider">担当者</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-violet-600 uppercase tracking-wider">期限</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-violet-600 uppercase tracking-wider">ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map((a, i) => {
                    const deadlineMatch = a.detail?.match(/期限[:：]\s*(.+)/);
                    const deadline = deadlineMatch ? deadlineMatch[1] : "-";
                    const statusLabel = a.status === "in-progress" ? "進行中" : a.status === "resolved" ? "完了" : "未着手";
                    const statusColor = a.status === "in-progress" ? "#2563eb" : a.status === "resolved" ? "#059669" : "#6b7280";

                    return (
                      <motion.tr
                        key={a.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="border-b border-violet-50 last:border-b-0 hover:bg-violet-50/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{a.label}</div>
                          {a.summary && (
                            <div className="text-[10px] text-gray-400 mt-0.5">{a.summary}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {a.speaker && (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-medium"
                              style={{ color: speakerColors[a.speaker] }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: speakerColors[a.speaker] }} />
                              {a.speaker}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{deadline}</td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{ color: statusColor, background: `${statusColor}12`, border: `1px solid ${statusColor}30` }}
                          >
                            {statusLabel}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Concerns & Risks */}
          <motion.div variants={itemVariants}>
            <SectionHeader title="懸念・リスク" color="#dc2626" />
            <div className="grid grid-cols-2 gap-2 mt-3">
              {concerns.map((c, i) => {
                const isResolved = c.status === "resolved";
                return (
                  <motion.div
                    key={c.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    className="rounded-lg border p-3"
                    style={{
                      borderColor: isResolved ? "#6ee7b7" : "#fca5a5",
                      background: isResolved ? "#f0fdf4" : "#fef2f2",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold"
                        style={{
                          color: isResolved ? "#059669" : "#dc2626",
                          background: isResolved ? "#dcfce7" : "#fee2e2",
                        }}
                      >
                        {isResolved ? "解決済" : "未解決"}
                      </span>
                      {c.speaker && (
                        <span className="text-[9px] font-medium" style={{ color: speakerColors[c.speaker] }}>
                          {c.speaker}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-gray-800">{c.label}</div>
                    {c.summary && (
                      <div className="text-[10px] text-gray-500 mt-1">{c.summary}</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Speaker analytics & Tag distribution */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            {/* Speaker contribution */}
            <div>
              <SectionHeader title="発言者分析" color="#3b82f6" />
              <div className="mt-3 space-y-2.5">
                {speakerStats
                  .sort((a, b) => b.charCount - a.charCount)
                  .map((s, i) => {
                    const pct = totalChars > 0 ? Math.round((s.charCount / totalChars) * 100) : 0;
                    return (
                      <motion.div
                        key={s.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: s.color }}
                            />
                            <span className="text-[11px] font-semibold text-gray-700">{s.name}</span>
                            <span className="text-[10px] text-gray-400">{s.role}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">{s.entryCount}発言</span>
                            <span className="text-[11px] font-bold" style={{ color: s.color }}>{pct}%</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 1 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: s.color }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>

            {/* Tag distribution */}
            <div>
              <SectionHeader title="発言タイプ分布" color="#6366f1" />
              <div className="mt-3 space-y-2">
                {tagEntries.map(([tag, count], i) => {
                  const config = tagLabels[tag as StatementTag];
                  const pct = Math.round(((count as number) / entries.length) * 100);
                  return (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: config.color }}
                          />
                          <span className="text-[11px] font-medium text-gray-600">{config.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">{count as number}回</span>
                          <span className="text-[11px] font-semibold" style={{ color: config.color }}>{pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 1 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: config.color }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Discussion flow timeline */}
          <motion.div variants={itemVariants}>
            <SectionHeader title="議論フロー" color="#0891b2" />
            <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-2">
              {entries.map((entry, i) => {
                const config = tagLabels[entry.tag];
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.0 + i * 0.03 }}
                    className="flex-shrink-0 group relative"
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[8px] font-bold text-white cursor-default"
                      style={{ background: config.color }}
                      title={`${entry.speaker}: ${entry.text.slice(0, 40)}...`}
                    >
                      {config.label.slice(0, 1)}
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] text-gray-300 whitespace-nowrap">
                      {i === 0 || i === entries.length - 1 ? entry.timestamp : ""}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between pt-4 border-t border-gray-100"
          >
            <div className="text-[10px] text-gray-400">
              Generated by MeetingFlow AI
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-[12px] font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              閉じる
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-4 rounded-full" style={{ background: color }} />
      <h3 className="text-[13px] font-bold text-gray-800">{title}</h3>
    </div>
  );
}
