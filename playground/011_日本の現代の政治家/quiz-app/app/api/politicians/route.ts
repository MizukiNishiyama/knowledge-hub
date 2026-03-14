import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const house = searchParams.get("house");
  const party = searchParams.get("party");
  const memorized = searchParams.get("memorized");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { isActive: true };
  if (house) where.house = house;
  if (party) where.party = party;
  if (search) where.name = { contains: search };
  if (memorized !== null && memorized !== "") {
    where.memoryStats = { memorized: memorized === "true" };
  }

  const [politicians, total] = await Promise.all([
    prisma.politician.findMany({
      where,
      include: { memoryStats: true },
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.politician.count({ where }),
  ]);

  return NextResponse.json({ politicians, total, page, limit });
}
