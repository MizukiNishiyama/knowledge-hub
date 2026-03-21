import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const politician = await prisma.politician.findUnique({
    where: { id: parseInt(id) },
    include: {
      memoryStats: true,
      quizAttempts: { orderBy: { answeredAt: "desc" }, take: 20 },
    },
  });
  if (!politician) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(politician);
}
