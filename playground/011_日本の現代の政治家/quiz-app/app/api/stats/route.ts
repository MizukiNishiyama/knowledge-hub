import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [total, memorized, todayAttempts, byHouse, byParty] = await Promise.all([
    prisma.politician.count({ where: { isActive: true } }),
    prisma.memoryStats.count({ where: { memorized: true } }),
    prisma.quizAttempt.count({
      where: {
        answeredAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.politician.groupBy({
      by: ["house"],
      where: { isActive: true },
      _count: { id: true },
    }),
    prisma.politician.groupBy({
      by: ["party"],
      where: { isActive: true },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  // Memorized counts by house
  const memorizedByHouse = await prisma.$queryRaw<{ house: string; count: number }[]>`
    SELECT p.house, COUNT(*) as count
    FROM Politician p
    JOIN MemoryStats ms ON ms.politicianId = p.id
    WHERE ms.memorized = 1 AND p.isActive = 1
    GROUP BY p.house
  `;

  // Memorized counts by party (top 10)
  const memorizedByParty = await prisma.$queryRaw<{ party: string; count: number }[]>`
    SELECT p.party, COUNT(*) as count
    FROM Politician p
    JOIN MemoryStats ms ON ms.politicianId = p.id
    WHERE ms.memorized = 1 AND p.isActive = 1
    GROUP BY p.party
    ORDER BY count DESC
    LIMIT 10
  `;

  return NextResponse.json({
    total,
    memorized,
    unmemorized: total - memorized,
    todayAttempts,
    byHouse: byHouse.map((h) => ({
      house: h.house,
      total: h._count.id,
      memorized: memorizedByHouse.find((m) => m.house === h.house)?.count ?? 0,
    })),
    byParty: byParty.map((p) => ({
      party: p.party,
      total: p._count.id,
      memorized: memorizedByParty.find((m) => m.party === p.party)?.count ?? 0,
    })),
  });
}
