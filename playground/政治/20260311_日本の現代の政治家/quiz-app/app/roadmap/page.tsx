"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Politician {
  id: number;
  name: string;
  house: string;
  party: string;
  district: string | null;
  electionCount: string | null;
  summaryExcerpt: string | null;
  memoryStats?: {
    correctCount: number;
    incorrectCount: number;
    memorized: boolean;
  } | null;
}

// High-profile names for Phase 1
const HIGH_PROFILE_NAMES = [
  "石破茂", "林芳正", "高市早苗", "小泉進次郎", "河野太郎", "茂木敏充",
  "小林鷹之", "岸田文雄", "安倍晋三", "菅義偉", "野田佳彦", "泉健太",
  "馬場伸幸", "山口那津男", "玉木雄一郎", "松井一郎", "前原誠司",
  "志位和夫", "福島瑞穂", "山本太郎", "橋下徹",
];

function getPhase(p: Politician): 1 | 2 | 3 {
  if (HIGH_PROFILE_NAMES.includes(p.name)) return 1;
  const count = parseInt(p.electionCount?.replace(/\D/g, "") || "0");
  if (count >= 5) return 1;
  if (count >= 3) return 2;
  return 3;
}

interface PhaseGroup {
  phase: 1 | 2 | 3;
  label: string;
  description: string;
  color: string;
  politicians: Politician[];
}

export default function RoadmapPage() {
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/politicians?limit=500")
      .then((r) => r.json())
      .then((data) => {
        setPoliticians(data.politicians);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-16 text-gray-400 animate-pulse">読み込み中...</div>;

  const phases: PhaseGroup[] = [
    {
      phase: 1,
      label: "フェーズ1：閣僚・党首・重鎮",
      description: "当選5回以上または高知名度の議員",
      color: "border-red-400 bg-red-50",
      politicians: politicians.filter((p) => getPhase(p) === 1),
    },
    {
      phase: 2,
      label: "フェーズ2：中堅議員",
      description: "当選3〜4回の議員",
      color: "border-yellow-400 bg-yellow-50",
      politicians: politicians.filter((p) => getPhase(p) === 2),
    },
    {
      phase: 3,
      label: "フェーズ3：若手・新人",
      description: "当選1〜2回または新人",
      color: "border-green-400 bg-green-50",
      politicians: politicians.filter((p) => getPhase(p) === 3),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">学習ロードマップ</h1>
      <p className="text-gray-500 text-sm">重要度別に議員を3フェーズに分類。フェーズ1から順に習得しましょう。</p>

      <div className="space-y-6">
        {phases.map((ph) => {
          const memorized = ph.politicians.filter((p) => p.memoryStats?.memorized).length;
          const total = ph.politicians.length;
          const pct = total > 0 ? Math.round((memorized / total) * 100) : 0;

          return (
            <div key={ph.phase} className={`rounded-xl border-2 ${ph.color} p-5`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{ph.label}</h2>
                  <p className="text-sm text-gray-500">{ph.description}</p>
                </div>
                <span className="text-2xl font-bold text-gray-700 shrink-0">{pct}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white rounded-full h-3 mb-3 overflow-hidden border border-gray-200">
                <div
                  className="h-3 rounded-full bg-gray-700 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mb-4">{memorized}/{total}名 記憶済み</div>

              {/* Politicians grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {ph.politicians.map((p) => (
                  <Link
                    key={p.id}
                    href={`/politicians/${p.id}`}
                    className={`rounded-lg p-2 text-center text-sm border transition-colors hover:shadow-sm ${
                      p.memoryStats?.memorized
                        ? "bg-white border-green-300 text-green-700"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">{p.party}</div>
                    {p.memoryStats?.memorized && <div className="text-yellow-500 text-xs">⭐</div>}
                  </Link>
                ))}
              </div>

              {ph.politicians.length > 0 && (
                <div className="mt-3">
                  <Link
                    href={`/quiz?house=`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    このフェーズのクイズを始める →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
