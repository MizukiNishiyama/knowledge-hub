"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  total: number;
  memorized: number;
  unmemorized: number;
  todayAttempts: number;
  byHouse: { house: string; total: number; memorized: number }[];
  byParty: { party: string; total: number; memorized: number }[];
}

function ProgressBar({ value, max, color = "bg-blue-500" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-12 text-right">{value}/{max}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) setStats(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/sync", { method: "POST" });
      await fetchStats();
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500 text-lg animate-pulse">読み込み中...</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {syncing ? "同期中..." : "データ同期"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
          <div className="text-3xl font-bold text-gray-900">{stats?.total ?? 0}</div>
          <div className="text-sm text-gray-500 mt-1">総議員数</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-5 text-center shadow-sm">
          <div className="text-3xl font-bold text-green-700">{stats?.memorized ?? 0}</div>
          <div className="text-sm text-green-600 mt-1">記憶済み</div>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-5 text-center shadow-sm">
          <div className="text-3xl font-bold text-orange-700">{stats?.unmemorized ?? 0}</div>
          <div className="text-sm text-orange-600 mt-1">未記憶</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 text-center shadow-sm">
          <div className="text-3xl font-bold text-blue-700">{stats?.todayAttempts ?? 0}</div>
          <div className="text-sm text-blue-600 mt-1">今日の学習数</div>
        </div>
      </div>

      {/* House Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">院別進捗</h2>
        <div className="space-y-4">
          {stats?.byHouse.map((h) => (
            <div key={h.house}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{h.house}</span>
                <span className="text-gray-500">
                  {h.total > 0 ? Math.round((h.memorized / h.total) * 100) : 0}%
                </span>
              </div>
              <ProgressBar value={h.memorized} max={h.total} color="bg-green-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Party Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">政党別進捗（上位10党）</h2>
        <div className="space-y-3">
          {stats?.byParty.map((p) => (
            <div key={p.party}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 truncate max-w-[200px]">{p.party}</span>
                <span className="text-gray-500 shrink-0 ml-2">
                  {p.memorized}/{p.total} ({p.total > 0 ? Math.round((p.memorized / p.total) * 100) : 0}%)
                </span>
              </div>
              <ProgressBar value={p.memorized} max={p.total} color="bg-blue-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/quiz" className="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition-colors text-center">
          <div className="text-2xl mb-2">🎯</div>
          <div className="font-semibold text-lg">クイズを始める</div>
          <div className="text-blue-100 text-sm mt-1">フラッシュカード形式</div>
        </Link>
        <Link href="/politicians" className="bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors text-center">
          <div className="text-2xl mb-2">📋</div>
          <div className="font-semibold text-lg text-gray-800">議員一覧</div>
          <div className="text-gray-500 text-sm mt-1">全議員を検索・閲覧</div>
        </Link>
        <Link href="/roadmap" className="bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors text-center">
          <div className="text-2xl mb-2">🗺️</div>
          <div className="font-semibold text-lg text-gray-800">学習ロードマップ</div>
          <div className="text-gray-500 text-sm mt-1">優先度別に学習</div>
        </Link>
      </div>
    </div>
  );
}
