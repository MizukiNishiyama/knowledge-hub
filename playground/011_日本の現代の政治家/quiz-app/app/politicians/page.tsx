"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Politician {
  id: number;
  name: string;
  house: string;
  party: string;
  district: string | null;
  electionCount: string | null;
  memoryStats?: {
    correctCount: number;
    incorrectCount: number;
    memorized: boolean;
  } | null;
}

function PoliticiansContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const house = searchParams.get("house") || "";
  const party = searchParams.get("party") || "";
  const memorized = searchParams.get("memorized") || "";
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page");
    setPage(1);
    router.push(`/politicians?${p}`);
  };

  const fetchPoliticians = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (house) params.set("house", house);
      if (party) params.set("party", party);
      if (memorized) params.set("memorized", memorized);
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", "50");
      const res = await fetch(`/api/politicians?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPoliticians(data.politicians);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [house, party, memorized, search, page]);

  useEffect(() => { fetchPoliticians(); }, [fetchPoliticians]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">議員一覧 <span className="text-base font-normal text-gray-500">({total}名)</span></h1>
        <Link href="/quiz" className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
          クイズを始める
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <select
            value={house}
            onChange={(e) => updateParam("house", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">院（全て）</option>
            <option value="衆議院">衆議院</option>
            <option value="参議院">参議院</option>
          </select>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && updateParam("search", searchInput)}
            placeholder="名前で検索..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-40"
          />
          <select
            value={memorized}
            onChange={(e) => updateParam("memorized", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">記憶状態（全て）</option>
            <option value="false">未記憶</option>
            <option value="true">記憶済み</option>
          </select>
          {(house || party || memorized || search) && (
            <button
              onClick={() => { router.push("/politicians"); setSearchInput(""); setPage(1); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
            >
              リセット
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400 animate-pulse">読み込み中...</div>
        ) : politicians.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🔍</div>
            <div>該当する議員が見つかりません</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">名前</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">院</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">政党</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden md:table-cell">選挙区</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden md:table-cell">正解数</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">状態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {politicians.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/politicians/${p.id}`} className="font-medium text-blue-600 hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.house}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[120px] truncate">{p.party}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.district ?? "-"}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-green-600">{p.memoryStats?.correctCount ?? 0}</span>
                      <span className="text-gray-400"> / </span>
                      <span className="text-red-500">{p.memoryStats?.incorrectCount ?? 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.memoryStats?.memorized ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">記憶済み</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">未記憶</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 50 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            前へ
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            {page} / {Math.ceil(total / 50)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 50)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}

export default function PoliticiansPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-400">読み込み中...</div>}>
      <PoliticiansContent />
    </Suspense>
  );
}
