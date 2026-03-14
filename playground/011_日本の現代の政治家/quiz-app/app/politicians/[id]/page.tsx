"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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
  policy: string | null;
  achievements: string | null;
  evaluations: string | null;
  rawSummaryMd: string;
  sourcesMd: string | null;
  sourcePath: string;
  memoryStats?: {
    correctCount: number;
    incorrectCount: number;
    memorized: boolean;
    lastAnsweredAt: string | null;
  } | null;
  quizAttempts: { id: number; answeredAt: string; isCorrect: boolean }[];
}

function parseJSON(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-600 flex gap-2">
            <span className="text-gray-400 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PoliticianDetailPage() {
  const params = useParams();
  const [politician, setPolitician] = useState<Politician | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/politicians/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setPolitician(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="text-center py-16 text-gray-400 animate-pulse">読み込み中...</div>;
  if (!politician) return <div className="text-center py-16 text-gray-400">議員が見つかりません</div>;

  const career = parseJSON(politician.career);
  const positions = parseJSON(politician.positions);
  const policy = parseJSON(politician.policy);
  const achievements = parseJSON(politician.achievements);
  const evaluations = parseJSON(politician.evaluations);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/politicians" className="hover:text-gray-700">← 一覧に戻る</Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{politician.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{politician.house}</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{politician.party}</span>
              {politician.district && <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{politician.district}</span>}
            </div>
          </div>
          {politician.memoryStats?.memorized && (
            <span className="text-yellow-500 text-2xl shrink-0">⭐</span>
          )}
        </div>

        {politician.summaryExcerpt && (
          <p className="mt-4 text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">
            {politician.summaryExcerpt}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {politician.birthDate && (
            <div><span className="text-gray-400">生年月日</span><div className="font-medium">{politician.birthDate}</div></div>
          )}
          {politician.age && (
            <div><span className="text-gray-400">年齢</span><div className="font-medium">{politician.age}歳</div></div>
          )}
          {politician.electionCount && (
            <div><span className="text-gray-400">当選回数</span><div className="font-medium">{politician.electionCount}</div></div>
          )}
          {politician.faction && (
            <div className="col-span-2 md:col-span-3"><span className="text-gray-400">派閥・グループ</span><div className="font-medium text-xs">{politician.faction}</div></div>
          )}
        </div>
      </div>

      {/* Quiz Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">学習状況</h2>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{politician.memoryStats?.correctCount ?? 0}</div>
            <div className="text-xs text-gray-500">正解</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{politician.memoryStats?.incorrectCount ?? 0}</div>
            <div className="text-xs text-gray-500">不正解</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">
              {politician.memoryStats?.memorized ? "✅" : "📚"}
            </div>
            <div className="text-xs text-gray-500">
              {politician.memoryStats?.memorized ? "記憶済み" : "学習中"}
            </div>
          </div>
          {politician.memoryStats?.lastAnsweredAt && (
            <div>
              <div className="text-xs text-gray-400 mt-1">
                最終: {new Date(politician.memoryStats.lastAnsweredAt).toLocaleDateString("ja-JP")}
              </div>
            </div>
          )}
        </div>

        {politician.quizAttempts.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-400 mb-1">直近の回答履歴</div>
            <div className="flex gap-1.5 flex-wrap">
              {politician.quizAttempts.slice(0, 20).map((a) => (
                <span
                  key={a.id}
                  className={`w-5 h-5 rounded-sm text-xs flex items-center justify-center ${a.isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
                >
                  {a.isCorrect ? "○" : "×"}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <Link
            href={`/quiz?party=${encodeURIComponent(politician.party)}`}
            className="text-sm text-blue-600 hover:underline"
          >
            この政党のクイズをやる →
          </Link>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-5">
        <h2 className="text-lg font-semibold text-gray-800">詳細情報</h2>
        <Section title="経歴" items={career} />
        <Section title="歴任ポスト" items={positions} />
        <Section title="政策スタンス" items={policy} />
        <Section title="主な功績" items={achievements} />
        <Section title="第三者評価" items={evaluations} />
      </div>

      {/* Source */}
      {politician.sourcesMd && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">ソース</h2>
          <pre className="text-xs text-gray-500 whitespace-pre-wrap overflow-auto max-h-40">{politician.sourcesMd}</pre>
        </div>
      )}
    </div>
  );
}
