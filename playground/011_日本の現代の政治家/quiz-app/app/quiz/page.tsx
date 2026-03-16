"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

interface Politician {
  id: number;
  name: string;
  reading: string | null;
  house: string;
  party: string;
  district: string | null;
  age: number | null;
  birthDate: string | null;
  electionCount: string | null;
  faction: string | null;
  summaryExcerpt: string | null;
  career: string | null;
  positions: string | null;
  memoryStats?: {
    correctCount: number;
    incorrectCount: number;
    memorized: boolean;
  } | null;
}

function parseJSON(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

function FlipCard({ politician, onAnswer }: {
  politician: Politician;
  onAnswer: (correct: boolean) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const touchStartX = useState<number | null>(null);

  const career = parseJSON(politician.career).slice(0, 3);
  const positions = parseJSON(politician.positions).slice(0, 3);

  // スワイプ操作（答え表示後: 右=正解, 左=不正解）
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX[1](e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX[0] === null || !flipped) return;
    const dx = e.changedTouches[0].clientX - touchStartX[0];
    if (Math.abs(dx) > 60) {
      const correct = dx > 0;
      setSwipeDir(correct ? "right" : "left");
      setTimeout(() => { setSwipeDir(null); onAnswer(correct); }, 300);
    }
    touchStartX[1](null);
  };

  return (
    <div className="w-full max-w-lg mx-auto select-none">
      {/* Swipe hint */}
      {flipped && (
        <div className="flex justify-between text-xs text-gray-300 px-2 mb-2">
          <span>← スワイプで不正解</span>
          <span>正解でスワイプ →</span>
        </div>
      )}

      {/* Card */}
      <div
        className="relative"
        style={{ perspective: "1200px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="w-full transition-all duration-400"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped
              ? swipeDir === "right" ? "rotateY(180deg) translateX(-40px)"
              : swipeDir === "left"  ? "rotateY(180deg) translateX(40px)"
              : "rotateY(180deg)"
              : swipeDir === "right" ? "rotateY(0deg) translateX(-40px)"
              : swipeDir === "left"  ? "rotateY(0deg) translateX(40px)"
              : "rotateY(0deg)",
            minHeight: "280px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white rounded-2xl border-2 border-gray-100 shadow-xl flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: "hidden", minHeight: "280px" }}
          >
            <div className="text-xs font-medium text-gray-400 tracking-wider mb-6">
              {politician.house} • {politician.party}
            </div>
            <div className="text-4xl md:text-5xl font-bold text-gray-900 text-center leading-tight">
              {politician.name}
            </div>
            {politician.reading && (
              <div className="mt-2 text-sm text-gray-400 tracking-wide">{politician.reading}</div>
            )}
            {politician.memoryStats && (
              <div className="mt-8 flex gap-5 text-sm">
                <span className="text-green-500 font-semibold">✓ {politician.memoryStats.correctCount}</span>
                <span className="text-red-400 font-semibold">✗ {politician.memoryStats.incorrectCount}</span>
                {politician.memoryStats.memorized && <span className="text-yellow-500">⭐ 記憶済み</span>}
              </div>
            )}
            <div className="mt-8 text-xs text-gray-300">タップして答えを見る</div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-white rounded-2xl border-2 border-blue-100 shadow-xl p-5 overflow-y-auto"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", minHeight: "280px" }}
          >
            <div className="text-lg font-bold text-gray-900 mb-4">{politician.name}</div>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm mb-4">
              <span className="text-gray-400 text-xs pt-0.5">院</span>
              <span className="font-medium">{politician.house}</span>
              <span className="text-gray-400 text-xs pt-0.5">政党</span>
              <span className="font-medium text-sm">{politician.party}</span>
              {politician.district && <>
                <span className="text-gray-400 text-xs pt-0.5">選挙区</span>
                <span className="font-medium">{politician.district}</span>
              </>}
              {politician.age && <>
                <span className="text-gray-400 text-xs pt-0.5">年齢</span>
                <span className="font-medium">{politician.age}歳</span>
              </>}
              {politician.electionCount && <>
                <span className="text-gray-400 text-xs pt-0.5">当選</span>
                <span className="font-medium">{politician.electionCount}</span>
              </>}
              {politician.faction && <>
                <span className="text-gray-400 text-xs pt-0.5">派閥</span>
                <span className="font-medium text-xs">{politician.faction}</span>
              </>}
            </div>
            {politician.summaryExcerpt && (
              <p className="text-xs text-gray-600 bg-blue-50 rounded-lg p-2.5 mb-3 leading-relaxed">
                {politician.summaryExcerpt}
              </p>
            )}
            {career.length > 0 && (
              <div>
                <div className="text-xs text-gray-400 font-semibold mb-1.5">主な経歴</div>
                {career.map((c, i) => (
                  <div key={i} className="text-xs text-gray-700 py-0.5 truncate">• {c}</div>
                ))}
              </div>
            )}
            {positions.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-400 font-semibold mb-1.5">歴任ポスト</div>
                {positions.slice(0,2).map((p, i) => (
                  <div key={i} className="text-xs text-gray-700 py-0.5 truncate">• {p}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 space-y-3">
        {!flipped ? (
          <button
            onClick={() => setFlipped(true)}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
          >
            答えを見る
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAnswer(false)}
              className="py-4 bg-red-500 text-white rounded-2xl font-bold text-lg hover:bg-red-600 active:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              ✗ 不正解
            </button>
            <button
              onClick={() => onAnswer(true)}
              className="py-4 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 active:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              ✓ 正解
            </button>
          </div>
        )}
        <Link
          href={`/politicians/${politician.id}`}
          className="block text-center text-sm text-gray-400 hover:text-blue-600 py-1 transition-colors"
        >
          詳細を見る →
        </Link>
      </div>
    </div>
  );
}

function QuizContent() {
  const searchParams = useSearchParams();
  const house = searchParams.get("house");
  const party = searchParams.get("party");

  const [politician, setPolitician] = useState<Politician | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const fetchNext = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (house) params.set("house", house);
      if (party) params.set("party", party);
      const res = await fetch(`/api/quiz/next?${params}`);
      if (res.ok) setPolitician(await res.json());
      else setPolitician(null);
    } finally {
      setLoading(false);
    }
  }, [house, party]);

  useEffect(() => { fetchNext(); }, [fetchNext]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (!politician) return;
    await fetch("/api/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ politicianId: politician.id, isCorrect }),
    });
    setSessionStats((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      incorrect: s.incorrect + (isCorrect ? 0 : 1),
    }));
    fetchNext();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          クイズ
          {house && <span className="text-base font-normal text-gray-500 ml-2">({house})</span>}
          {party && <span className="text-base font-normal text-gray-500 ml-2">({party})</span>}
        </h1>
        <div className="flex gap-3 text-sm">
          <span className="text-green-600 font-medium">✓ {sessionStats.correct}</span>
          <span className="text-red-500 font-medium">✗ {sessionStats.incorrect}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 animate-pulse text-lg">次の問題を読み込み中...</div>
        </div>
      ) : politician ? (
        <FlipCard key={politician.id} politician={politician} onAnswer={handleAnswer} />
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎉</div>
          <div className="text-xl font-bold text-gray-800 mb-2">全て完了！</div>
          <div className="text-gray-500 mb-6">
            このセッション: 正解 {sessionStats.correct} / 不正解 {sessionStats.incorrect}
          </div>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            ダッシュボードへ
          </Link>
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-400">読み込み中...</div>}>
      <QuizContent />
    </Suspense>
  );
}
