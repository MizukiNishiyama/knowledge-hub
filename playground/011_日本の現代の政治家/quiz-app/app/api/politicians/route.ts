import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const house = searchParams.get("house");
  const party = searchParams.get("party");
  const memorized = searchParams.get("memorized");
  const search = searchParams.get("search");
  const ageRange = searchParams.get("ageRange");       // 30s|40s|50s|60s|70plus
  const hasMinister = searchParams.get("hasMinister"); // true|false
  const electionMin = searchParams.get("electionMin"); // 数字文字列
  const sortBy = searchParams.get("sortBy") || "name"; // name|age|party|house
  const sortDir = (searchParams.get("sortDir") || "asc") as "asc" | "desc";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Prisma.PoliticianWhereInput = { isActive: true };

  if (house) where.house = house;
  if (party) where.party = party;
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (memorized !== null && memorized !== "") {
    where.memoryStats = { memorized: memorized === "true" };
  }
  if (hasMinister === "true") where.hasMinisterExperience = true;
  if (hasMinister === "false") where.hasMinisterExperience = false;

  // 年齢層フィルタ
  if (ageRange) {
    const ageMap: Record<string, { gte?: number; lt?: number }> = {
      "30s":    { gte: 30, lt: 40 },
      "40s":    { gte: 40, lt: 50 },
      "50s":    { gte: 50, lt: 60 },
      "60s":    { gte: 60, lt: 70 },
      "70plus": { gte: 70 },
    };
    if (ageMap[ageRange]) where.age = ageMap[ageRange];
  }

  // 当選回数フィルタ（文字列に数字が含まれるかざっくり判定）
  if (electionMin) {
    const n = parseInt(electionMin);
    if (!isNaN(n)) {
      // election_count は "3回" 形式 → 数字部分で比較
      const patterns = Array.from({ length: 20 - n + 1 }, (_, i) => `${n + i}回`);
      where.electionCount = { in: patterns };
    }
  }

  // ソート設定
  const orderBy: Prisma.PoliticianOrderByWithRelationInput[] = [];
  if (sortBy === "age") {
    orderBy.push({ age: sortDir });
  } else if (sortBy === "party") {
    orderBy.push({ party: sortDir });
  } else if (sortBy === "house") {
    orderBy.push({ house: sortDir });
  } else if (sortBy === "correct") {
    orderBy.push({ memoryStats: { correctCount: sortDir } });
  } else {
    orderBy.push({ name: sortDir });
  }

  const [politicians, total] = await Promise.all([
    prisma.politician.findMany({
      where,
      include: { memoryStats: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.politician.count({ where }),
  ]);

  return NextResponse.json({ politicians, total, page, limit });
}
