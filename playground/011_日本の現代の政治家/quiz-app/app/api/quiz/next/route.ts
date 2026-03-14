import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const house = searchParams.get("house");
  const party = searchParams.get("party");

  const where: Record<string, unknown> = { isActive: true };
  if (house) where.house = house;
  if (party) where.party = party;

  // Find non-memorized politicians, ordered by incorrectCount desc, then lastAnsweredAt asc (nulls first)
  const politician = await prisma.politician.findFirst({
    where: {
      ...where,
      memoryStats: { memorized: false },
    },
    include: { memoryStats: true },
    orderBy: [
      { memoryStats: { incorrectCount: "desc" } },
      { memoryStats: { lastAnsweredAt: "asc" } },
    ],
  });

  if (!politician) {
    // All memorized - pick any
    const any = await prisma.politician.findFirst({
      where,
      include: { memoryStats: true },
      orderBy: { memoryStats: { lastAnsweredAt: "asc" } },
    });
    if (!any) return NextResponse.json({ error: "No politicians found" }, { status: 404 });
    return NextResponse.json(any);
  }

  return NextResponse.json(politician);
}
