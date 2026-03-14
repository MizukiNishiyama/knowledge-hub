"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

interface Politician {
  id: number;
  name: string;
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

  const career = parseJSON(politician.career).slice(0, 3);
  const positions = parseJSON(politician.positions).slice(0, 3);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Card container with 3D flip */}
      <div className="relative h-80 md:h-96" style={{ perspective: "1000px" }}>
        <div
          className="w-full h-full transition-transform duration-500 relative"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white rounded-2xl border border-gray-200 shadow-lg flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
              {politician.house} • {politician.party}
            </div>
            <div className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
              {politician.name}
            </div>
            {politician.memoryStats && (
              <div className="mt-6 flex gap-4 text-sm">
                <span className="text-green-600">正解: {politician.memoryStats.correctCount}</span>
                <span className="text-red-500">不正解: {politician.memoryStats.incorrectCount}</span>
                {politician.memoryStats.memorized && (
                  <span className="text-yellow-500 font-medium">⭐ 記憶済み</span>
                )}
              </div>
            )}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-white rounded-2xl border border-gray-200 shadow-lg p-6 overflow-y-auto"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="text-xl font-bold text-gray-900 mb-3">{politician.name}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm mb-3">
              <div className="text-gray-500">院</div>
              <div className="font-medium">{politician.house}</div>
              <div className="text-gray-500">政党</div>
              <div className="font-medium">{politician.party}</div>
              {politician.district && (
                <>
                  <div className="text-gray-500">選挙区</div>
                  <div className="font-medium">{politician.district}</div>
                </>
              )}
              {politician.age && (
                <>
                  <div className="text-gray-500">年齢</div>
                  <div className="font-medium">{politician.age}歳</div>
                </>
              )}
              {politician.electionCount && (
                <>
                  <div className="text-gray-500">当選回数</div>
                  <div className="font-medium">{politician.electionCount}</div>
                </>
              )}
              {politician.faction && (
                <>
                  <div className="text-gray-500">派閥</div>
                  <div className="font-medium text-xs">{politician.faction}</div>
                </>
              )}
            </div>
            {politician.summaryExcerpt && (
              <p className="text-xs text-gray-600 mb-2 bg-gray-50 rounded p-2 line-clamp-3">
                {politician.summaryExcerpt}
              </p>
            )}
            {career.length > 0 && (
              <div className="text-xs">
                <div className="text-gray-500 font-medium mb-1">主な経歴</div>
                <ul className="space-y-0.5">
                  {career.map((c, i) => (
                    <li key={i} className="text-gray-700 line-clamp-1">• {c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 space-y-3">
        {!flipped ? (
          <button
            onClick={() => setFlipped(true)}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            答えを見る
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAnswer(true)}
              className="py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors text-lg flex items-center justify-center gap-2"
            >
              ✓ 正解
            </button>
            <button
              onClick={() => onAnswer(false)}
              className="py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors text-lg flex items-center justify-center gap-2"
            >
              ✗ 不正解
            </button>
          </div>
        )}
        <Link
          href={`/politicians/${politician.id}`}
          className="block text-center text-sm text-blue-600 hover:underline py-1"
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
