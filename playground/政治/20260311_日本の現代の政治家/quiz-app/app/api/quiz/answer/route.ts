import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { politicianId, isCorrect } = await req.json();

  if (!politicianId || typeof isCorrect !== "boolean") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const settings = await prisma.settings.findFirst();
  const threshold = settings?.memorizedThreshold ?? 10;

  // Record attempt
  await prisma.quizAttempt.create({
    data: { politicianId, isCorrect },
  });

  // Update memory stats
  const stats = await prisma.memoryStats.upsert({
    where: { politicianId },
    create: {
      politicianId,
      correctCount: isCorrect ? 1 : 0,
      incorrectCount: isCorrect ? 0 : 1,
      lastAnsweredAt: new Date(),
    },
    update: {
      correctCount: isCorrect ? { increment: 1 } : undefined,
      incorrectCount: isCorrect ? undefined : { increment: 1 },
      lastAnsweredAt: new Date(),
    },
  });

  // Check if memorized
  const memorized = stats.correctCount >= threshold;
  if (memorized !== stats.memorized) {
    await prisma.memoryStats.update({
      where: { politicianId },
      data: { memorized },
    });
  }

  return NextResponse.json({ success: true, stats: { ...stats, memorized } });
}
