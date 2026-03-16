"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Politician {
  id: number;
  name: string;
  house: string;
  party: string;
  district: string | null;
  age: number | null;
  electionCount: string | null;
  hasMinisterExperience: boolean;
  memoryStats?: {
    correctCount: number;
    incorrectCount: number;
    memorized: boolean;
  } | null;
}

const PARTY_COLORS: Record<string, string> = {
  "自由民主党":   "bg-red-100 text-red-700",
  "中道改革連合": "bg-blue-100 text-blue-700",
  "日本維新の会": "bg-orange-100 text-orange-700",
  "公明党":       "bg-yellow-100 text-yellow-700",
  "日本共産党":   "bg-red-200 text-red-800",
  "国民民主党":   "bg-sky-100 text-sky-700",
  "れいわ新選組": "bg-pink-100 text-pink-700",
  "参政党":       "bg-green-100 text-green-700",
  "チームみらい": "bg-teal-100 text-teal-700",
};

function partyBadge(party: string) {
  const cls = PARTY_COLORS[party] ?? "bg-gray-100 text-gray-600";
  const short = party.replace("日本", "").replace("の会", "").slice(0, 6);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {short}
    </span>
  );
}

type SortKey = "name" | "age" | "party" | "house" | "correct";

function ChipGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | "";
  options: { label: string; value: T }[];
  onChange: (v: T | "") => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onChange("")}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          value === "" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        全て
      </button>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(value === o.value ? "" : o.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value === o.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SortButton({
  label,
  sortKey,
  current,
  dir,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: "asc" | "desc";
  onClick: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <button
      onClick={() => onClick(sortKey)}
      className={`flex items-center gap-0.5 text-left text-xs font-semibold uppercase tracking-wide transition-colors ${
        active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
      {active && <span className="text-xs">{dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );
}

function PoliticianCard({ p }: { p: Politician }) {
  const correct = p.memoryStats?.correctCount ?? 0;
  const incorrect = p.memoryStats?.incorrectCount ?? 0;
  const memorized = p.memoryStats?.memorized ?? false;
  const total = correct + incorrect;

  return (
    <Link href={`/politicians/${p.id}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 p-3.5 active:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-base">{p.name}</span>
              {memorized && <span className="text-yellow-500 text-sm">⭐</span>}
              {p.hasMinisterExperience && (
                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">閣僚</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {partyBadge(p.party)}
              <span className="text-xs text-gray-500">{p.house === "衆議院" ? "衆" : "参"}</span>
              {p.district && <span className="text-xs text-gray-400 truncate max-w-[120px]">{p.district}</span>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="text-xs text-gray-500">
              <span className="text-green-600 font-medium">{correct}</span>
              <span className="text-gray-300 mx-0.5">/</span>
              <span className="text-red-500 font-medium">{incorrect}</span>
            </div>
            {total > 0 && (
              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 rounded-full"
                  style={{ width: `${Math.round((correct / total) * 100)}%` }}
                />
              </div>
            )}
            {p.age && <span className="text-xs text-gray-400">{p.age}歳</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

function PoliticianRow({ p }: { p: Politician }) {
  const correct = p.memoryStats?.correctCount ?? 0;
  const incorrect = p.memoryStats?.incorrectCount ?? 0;
  const memorized = p.memoryStats?.memorized ?? false;
  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      <td className="px-4 py-3">
        <Link href={`/politicians/${p.id}`} className="font-medium text-blue-600 hover:underline flex items-center gap-1">
          {p.name}
          {memorized && <span className="text-yellow-500 text-xs">⭐</span>}
        </Link>
      </td>
      <td className="px-3 py-3 text-xs text-gray-500">{p.house === "衆議院" ? "衆" : "参"}</td>
      <td className="px-3 py-3">{partyBadge(p.party)}</td>
      <td className="px-3 py-3 text-xs text-gray-500 hidden lg:table-cell">{p.district ?? "-"}</td>
      <td className="px-3 py-3 text-xs text-center hidden md:table-cell">
        {p.age ? `${p.age}歳` : "-"}
      </td>
      <td className="px-3 py-3 text-xs text-center hidden md:table-cell">
        {p.electionCount ?? "-"}
      </td>
      <td className="px-3 py-3 text-center hidden md:table-cell">
        {p.hasMinisterExperience && (
          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">閣僚</span>
        )}
      </td>
      <td className="px-3 py-3 text-xs">
        <span className="text-green-600">{correct}</span>
        <span className="text-gray-300 mx-0.5">/</span>
        <span className="text-red-500">{incorrect}</span>
      </td>
    </tr>
  );
}

function PoliticiansContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const house = searchParams.get("house") || "";
  const party = searchParams.get("party") || "";
  const memorized = searchParams.get("memorized") || "";
  const search = searchParams.get("search") || "";
  const ageRange = searchParams.get("ageRange") || "";
  const hasMinister = searchParams.get("hasMinister") || "";
  const sortBy = (searchParams.get("sortBy") || "name") as SortKey;
  const sortDir = (searchParams.get("sortDir") || "asc") as "asc" | "desc";

  const [searchInput, setSearchInput] = useState(search);

  const setParam = useCallback(
    (updates: Record<string, string>) => {
      const p = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) p.set(k, v); else p.delete(k);
      }
      p.delete("page");
      setPage(1);
      router.push(`/politicians?${p}`);
    },
    [searchParams, router]
  );

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setParam({ sortBy: key, sortDir: sortDir === "asc" ? "desc" : "asc" });
    } else {
      setParam({ sortBy: key, sortDir: "asc" });
    }
  };

  const fetchPoliticians = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (house) params.set("house", house);
      if (party) params.set("party", party);
      if (memorized) params.set("memorized", memorized);
      if (search) params.set("search", search);
      if (ageRange) params.set("ageRange", ageRange);
      if (hasMinister) params.set("hasMinister", hasMinister);
      params.set("sortBy", sortBy);
      params.set("sortDir", sortDir);
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
  }, [house, party, memorized, search, ageRange, hasMinister, sortBy, sortDir, page]);

  useEffect(() => { fetchPoliticians(); }, [fetchPoliticians]);

  const activeFilterCount = [house, party, memorized, ageRange, hasMinister].filter(Boolean).length;
  const totalPages = Math.ceil(total / 50);

  return (
    <div className="space-y-3 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">議員一覧</h1>
          <p className="text-sm text-gray-500">{loading ? "…" : `${total}名`}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("card")}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-colors ${viewMode === "card" ? "bg-white shadow text-gray-800" : "text-gray-500"}`}
            >
              ☰
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-colors ${viewMode === "table" ? "bg-white shadow text-gray-800" : "text-gray-500"}`}
            >
              ⊞
            </button>
          </div>
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-700"
            }`}
          >
            <span>絞り込み</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setParam({ search: searchInput })}
          placeholder="名前で検索（Enterで確定）"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {searchInput && (
          <button
            onClick={() => { setSearchInput(""); setParam({ search: "" }); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          {/* 院 */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">院</div>
            <ChipGroup
              value={house as "" | "衆議院" | "参議院"}
              options={[
                { label: "衆議院", value: "衆議院" },
                { label: "参議院", value: "参議院" },
              ]}
              onChange={(v) => setParam({ house: v })}
            />
          </div>

          {/* 政党 */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">政党</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setParam({ party: "" })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  !party ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                全て
              </button>
              {[
                "自由民主党","中道改革連合","日本維新の会","公明党",
                "国民民主党","日本共産党","れいわ新選組","参政党","チームみらい",
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => setParam({ party: party === p ? "" : p })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    party === p
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p.replace("日本", "").replace("の会", "")}
                </button>
              ))}
            </div>
          </div>

          {/* 年齢層 */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">年齢層</div>
            <ChipGroup
              value={ageRange as "" | "30s" | "40s" | "50s" | "60s" | "70plus"}
              options={[
                { label: "30代", value: "30s" },
                { label: "40代", value: "40s" },
                { label: "50代", value: "50s" },
                { label: "60代", value: "60s" },
                { label: "70代以上", value: "70plus" },
              ]}
              onChange={(v) => setParam({ ageRange: v })}
            />
          </div>

          {/* 閣僚経験 */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">閣僚経験</div>
            <ChipGroup
              value={hasMinister as "" | "true" | "false"}
              options={[
                { label: "閣僚経験あり", value: "true" },
                { label: "なし", value: "false" },
              ]}
              onChange={(v) => setParam({ hasMinister: v })}
            />
          </div>

          {/* 記憶状態 */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">記憶状態</div>
            <ChipGroup
              value={memorized as "" | "true" | "false"}
              options={[
                { label: "記憶済み ⭐", value: "true" },
                { label: "未記憶", value: "false" },
              ]}
              onChange={(v) => setParam({ memorized: v })}
            />
          </div>

          {/* ソート */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">並び順</div>
            <div className="flex flex-wrap gap-1.5">
              {([
                { label: "名前", key: "name" as SortKey },
                { label: "年齢", key: "age" as SortKey },
                { label: "政党", key: "party" as SortKey },
                { label: "正解数", key: "correct" as SortKey },
              ] as const).map(({ label, key }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                    sortBy === key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                  {sortBy === key && <span>{sortDir === "asc" ? "↑" : "↓"}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {(house || party || memorized || search || ageRange || hasMinister) && (
            <button
              onClick={() => {
                setSearchInput("");
                router.push("/politicians");
              }}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
            >
              フィルタをリセット
            </button>
          )}
        </div>
      )}

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {house && (
            <button onClick={() => setParam({ house: "" })} className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
              {house} ✕
            </button>
          )}
          {party && (
            <button onClick={() => setParam({ party: "" })} className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
              {party} ✕
            </button>
          )}
          {ageRange && (
            <button onClick={() => setParam({ ageRange: "" })} className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
              {({ "30s":"30代","40s":"40代","50s":"50代","60s":"60代","70plus":"70代+" } as Record<string,string>)[ageRange]} ✕
            </button>
          )}
          {hasMinister && (
            <button onClick={() => setParam({ hasMinister: "" })} className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
              {hasMinister === "true" ? "閣僚経験あり" : "閣僚経験なし"} ✕
            </button>
          )}
          {memorized && (
            <button onClick={() => setParam({ memorized: "" })} className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs">
              {memorized === "true" ? "記憶済み" : "未記憶"} ✕
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 animate-pulse">
          読み込み中...
        </div>
      ) : politicians.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-gray-600 font-medium">該当する議員が見つかりません</div>
          <button
            onClick={() => { setSearchInput(""); router.push("/politicians"); }}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            フィルタをリセット
          </button>
        </div>
      ) : viewMode === "card" ? (
        <div className="space-y-2">
          {politicians.map((p) => <PoliticianCard key={p.id} p={p} />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <SortButton label="名前" sortKey="name" current={sortBy} dir={sortDir} onClick={handleSort} />
                  </th>
                  <th className="px-3 py-3 text-left">
                    <SortButton label="院" sortKey="house" current={sortBy} dir={sortDir} onClick={handleSort} />
                  </th>
                  <th className="px-3 py-3 text-left">
                    <SortButton label="政党" sortKey="party" current={sortBy} dir={sortDir} onClick={handleSort} />
                  </th>
                  <th className="px-3 py-3 text-left hidden lg:table-cell text-xs font-semibold text-gray-500 uppercase tracking-wide">選挙区</th>
                  <th className="px-3 py-3 text-center hidden md:table-cell">
                    <SortButton label="年齢" sortKey="age" current={sortBy} dir={sortDir} onClick={handleSort} />
                  </th>
                  <th className="px-3 py-3 text-center hidden md:table-cell text-xs font-semibold text-gray-500 uppercase tracking-wide">当選</th>
                  <th className="px-3 py-3 text-center hidden md:table-cell text-xs font-semibold text-gray-500 uppercase tracking-wide">閣僚</th>
                  <th className="px-3 py-3 text-left">
                    <SortButton label="正解" sortKey="correct" current={sortBy} dir={sortDir} onClick={handleSort} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {politicians.map((p) => <PoliticianRow key={p.id} p={p} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-sm disabled:opacity-30 hover:bg-gray-50 active:bg-gray-100"
          >
            ‹
          </button>
          <span className="text-sm text-gray-600 min-w-[80px] text-center">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-sm disabled:opacity-30 hover:bg-gray-50 active:bg-gray-100"
          >
            ›
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
