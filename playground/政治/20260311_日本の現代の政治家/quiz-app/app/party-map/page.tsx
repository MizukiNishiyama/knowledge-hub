"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PartyStats {
  party: string;
  total: number;
  memorized: number;
}

const PARTY_COLORS: Record<string, string> = {
  "自由民主党": "bg-red-500",
  "立憲民主党": "bg-blue-600",
  "日本維新の会": "bg-green-500",
  "公明党": "bg-yellow-500",
  "国民民主党": "bg-orange-500",
  "日本共産党": "bg-red-700",
  "れいわ新選組": "bg-pink-500",
  "社会民主党": "bg-rose-600",
  "参政党": "bg-teal-500",
  "日本保守党": "bg-amber-700",
};

function getPartyColor(party: string): string {
  return PARTY_COLORS[party] || "bg-gray-400";
}

export default function PartyMapPage() {
  const [parties, setParties] = useState<PartyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setParties(data.byParty || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-16 text-gray-400 animate-pulse">読み込み中...</div>;

  // We also need full party list - fetch from politicians
  return <PartyMapContent />;
}

function PartyMapContent() {
  const [parties, setParties] = useState<PartyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all politicians and aggregate by party
    fetch("/api/politicians?limit=500")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, { total: number; memorized: number }> = {};
        for (const p of data.politicians) {
          if (!map[p.party]) map[p.party] = { total: 0, memorized: 0 };
          map[p.party].total++;
          if (p.memoryStats?.memorized) map[p.party].memorized++;
        }
        const list = Object.entries(map)
          .map(([party, s]) => ({ party, ...s }))
          .sort((a, b) => b.total - a.total);
        setParties(list);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-16 text-gray-400 animate-pulse">読み込み中...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">政党マップ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parties.map((p) => {
          const pct = p.total > 0 ? Math.round((p.memorized / p.total) * 100) : 0;
          const color = getPartyColor(p.party);
          return (
            <div key={p.party} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-semibold text-gray-800 text-sm leading-tight max-w-[180px]">{p.party}</h2>
                <span className="text-2xl font-bold text-gray-900">{pct}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {p.memorized}/{p.total}名 記憶済み
                </div>
                <Link
                  href={`/quiz?party=${encodeURIComponent(p.party)}`}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  クイズ →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
