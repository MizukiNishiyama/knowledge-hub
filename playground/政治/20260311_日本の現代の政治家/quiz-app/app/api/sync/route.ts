import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as fs from "fs";
import * as path from "path";

const BASE_DIR = path.resolve(process.cwd(), "../../");
const HOUSES = ["衆議院", "参議院"];

function extractTableValue(md: string, key: string): string | null {
  const lines = md.split("\n");
  for (const line of lines) {
    if (line.includes(`| ${key}`) && line.includes("|")) {
      const parts = line.split("|").map((s) => s.trim());
      if (parts.length >= 3) return parts[2] || null;
    }
  }
  return null;
}

function extractTableValuePartial(md: string, keyPrefix: string): string | null {
  const lines = md.split("\n");
  for (const line of lines) {
    if (line.includes(`| ${keyPrefix}`) && line.includes("|")) {
      const parts = line.split("|").map((s) => s.trim());
      if (parts.length >= 3) return parts[2] || null;
    }
  }
  return null;
}

function extractSection(md: string, sectionPattern: RegExp): string[] {
  const lines = md.split("\n");
  const items: string[] = [];
  let inSection = false;
  for (const line of lines) {
    if (sectionPattern.test(line)) { inSection = true; continue; }
    if (inSection) {
      if (/^## /.test(line)) break;
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        items.push(trimmed.replace(/^[-*]\s+/, ""));
      } else if (/^\|/.test(trimmed) && !trimmed.includes("---")) {
        const parts = trimmed.split("|").map((s) => s.trim()).filter(Boolean);
        if (parts.length >= 2 && !parts[0].includes("期間") && !parts[0].includes("項目")) {
          items.push(parts.join(": "));
        }
      }
    }
  }
  return items;
}

function extractSummaryExcerpt(md: string): string | null {
  const lines = md.split("\n");
  let inSection = false;
  const paragraphs: string[] = [];
  for (const line of lines) {
    if (/^## 7\./.test(line)) { inSection = true; continue; }
    if (inSection) {
      if (/^## /.test(line)) break;
      const trimmed = line.trim();
      if (trimmed) paragraphs.push(trimmed);
    }
  }
  return paragraphs.length > 0 ? paragraphs.join(" ") : null;
}

function parseSummaryMd(md: string, sourcePath: string, house: string) {
  const name = extractTableValue(md, "氏名");
  const party = extractTableValue(md, "政党") || "不明";
  const district = extractTableValue(md, "選挙区");
  const birthDate = extractTableValue(md, "生年月日");
  const ageStr = extractTableValue(md, "年齢");
  const age = ageStr ? parseInt(ageStr.replace(/\D/g, ""), 10) || null : null;
  const electionCount = extractTableValue(md, "当選回数");
  const faction = extractTableValuePartial(md, "派閥");
  const career = extractSection(md, /^## 2\./);
  const positions = extractSection(md, /^## 3\./);
  const policyItems = extractSection(md, /^## 4\./);
  const achievementItems = extractSection(md, /^## 5\./);
  const evaluationItems = extractSection(md, /^## 6\./);
  const summaryExcerpt = extractSummaryExcerpt(md);
  return {
    name: name || path.basename(sourcePath),
    house, party, district, birthDate, age, electionCount, faction, summaryExcerpt,
    career: JSON.stringify(career),
    positions: JSON.stringify(positions),
    policy: JSON.stringify(policyItems),
    achievements: JSON.stringify(achievementItems),
    evaluations: JSON.stringify(evaluationItems),
    rawSummaryMd: md,
    sourcePath,
  };
}

export async function POST() {
  let total = 0, created = 0, updated = 0;
  try {
    for (const house of HOUSES) {
      const houseDir = path.join(BASE_DIR, house);
      if (!fs.existsSync(houseDir)) continue;
      const parties = fs.readdirSync(houseDir).filter((f) =>
        fs.statSync(path.join(houseDir, f)).isDirectory()
      );
      for (const party of parties) {
        const partyDir = path.join(houseDir, party);
        const politicians = fs.readdirSync(partyDir).filter((f) =>
          fs.statSync(path.join(partyDir, f)).isDirectory()
        );
        for (const politician of politicians) {
          const polDir = path.join(partyDir, politician);
          const summaryPath = path.join(polDir, "summary.md");
          const sourcesPath = path.join(polDir, "sources.md");
          if (!fs.existsSync(summaryPath)) continue;
          const md = fs.readFileSync(summaryPath, "utf-8");
          const sourcesMd = fs.existsSync(sourcesPath) ? fs.readFileSync(sourcesPath, "utf-8") : null;
          const sourcePath = `${house}/${party}/${politician}`;
          const data = parseSummaryMd(md, sourcePath, house);
          try {
            const existing = await prisma.politician.findUnique({ where: { sourcePath } });
            if (existing) {
              await prisma.politician.update({ where: { sourcePath }, data: { ...data, sourcesMd } });
              updated++;
            } else {
              const p = await prisma.politician.create({ data: { ...data, sourcesMd } });
              await prisma.memoryStats.create({ data: { politicianId: p.id } });
              created++;
            }
            total++;
          } catch (err) {
            console.error(`Error: ${sourcePath}`, err);
          }
        }
      }
    }
    const settingsCount = await prisma.settings.count();
    if (settingsCount === 0) await prisma.settings.create({ data: { memorizedThreshold: 10 } });
    return NextResponse.json({ success: true, total, created, updated });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
