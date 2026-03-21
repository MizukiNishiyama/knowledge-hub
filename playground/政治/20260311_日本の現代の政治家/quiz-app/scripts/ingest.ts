import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const BASE_DIR = path.resolve(
  __dirname,
  "../../"
);

const HOUSES = ["衆議院", "参議院"];

function extractTableValue(md: string, key: string): string | null {
  const lines = md.split("\n");
  for (const line of lines) {
    if (line.includes(`| ${key}`) && line.includes("|")) {
      const parts = line.split("|").map((s) => s.trim());
      // parts[0]='', parts[1]=key, parts[2]=value, parts[3]=''
      if (parts.length >= 3) {
        return parts[2] || null;
      }
    }
  }
  return null;
}

function extractTableValuePartial(md: string, keyPrefix: string): string | null {
  const lines = md.split("\n");
  for (const line of lines) {
    if (line.includes(`| ${keyPrefix}`) && line.includes("|")) {
      const parts = line.split("|").map((s) => s.trim());
      if (parts.length >= 3) {
        return parts[2] || null;
      }
    }
  }
  return null;
}

function extractSection(md: string, sectionPattern: RegExp): string[] {
  const lines = md.split("\n");
  const items: string[] = [];
  let inSection = false;

  for (const line of lines) {
    if (sectionPattern.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (/^## /.test(line)) break;
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        items.push(trimmed.replace(/^[-*]\s+/, ""));
      } else if (/^\|/.test(trimmed) && !trimmed.includes("---")) {
        // table row
        const parts = trimmed.split("|").map((s) => s.trim()).filter(Boolean);
        if (parts.length >= 2 && !parts[0].includes("期間") && !parts[0].includes("項目")) {
          items.push(parts.join(": "));
        }
      }
    }
  }
  return items;
}

function extractSectionText(md: string, sectionPattern: RegExp): string {
  const lines = md.split("\n");
  const items: string[] = [];
  let inSection = false;

  for (const line of lines) {
    if (sectionPattern.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (/^## /.test(line)) break;
      const trimmed = line.trim();
      if (trimmed) items.push(trimmed);
    }
  }
  return items.join("\n");
}

function extractSummaryExcerpt(md: string): string | null {
  const lines = md.split("\n");
  let inSection = false;
  let paragraphs: string[] = [];

  for (const line of lines) {
    if (/^## 7\./.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (/^## /.test(line)) break;
      const trimmed = line.trim();
      if (trimmed) paragraphs.push(trimmed);
    }
  }
  return paragraphs.length > 0 ? paragraphs.join(" ") : null;
}

/** ひらがな・カタカナのみの文字列かチェック */
function isKanaOnly(s: string): boolean {
  return /^[\u3040-\u309F\u30A0-\u30FF\s　ー・]+$/.test(s.trim());
}

/** 氏名フィールドから { name, reading } を抽出
 * パターン:
 *   "古賀篤（こが あつし）" → name="古賀篤",    reading="こが あつし"
 *   "いとう たつお"         → name=<dir名>,      reading="いとう たつお"
 *   "石川まさる"            → name="石川まさる",  reading=null
 */
function parseNameAndReading(
  nameField: string | null,
  dirName: string
): { name: string; reading: string | null } {
  if (!nameField) return { name: dirName, reading: null };

  const trimmed = nameField.trim();

  // パターン1: 漢字（よみ）
  const parenMatch = trimmed.match(/^(.+?)[\（(]([ぁ-ん\s　ァ-ヶー・]+)[\）)]/);
  if (parenMatch) {
    return {
      name: parenMatch[1].trim() || dirName,
      reading: parenMatch[2].trim(),
    };
  }

  // パターン2: よみのみ（ひらがな/カタカナのみ）
  if (isKanaOnly(trimmed)) {
    return { name: dirName, reading: trimmed };
  }

  // パターン3: 漢字のみ or 混合 → readingなし
  return { name: trimmed || dirName, reading: null };
}

function parseSummaryMd(md: string, sourcePath: string, house: string) {
  const nameField = extractTableValue(md, "氏名");
  const dirName = path.basename(sourcePath);
  const { name, reading } = parseNameAndReading(nameField, dirName);
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
    name,
    reading,
    house,
    party,
    district,
    birthDate,
    age,
    electionCount,
    faction,
    summaryExcerpt,
    career: career as unknown as import("@prisma/client").Prisma.InputJsonValue,
    positions: positions as unknown as import("@prisma/client").Prisma.InputJsonValue,
    policy: policyItems as unknown as import("@prisma/client").Prisma.InputJsonValue,
    achievements: achievementItems as unknown as import("@prisma/client").Prisma.InputJsonValue,
    evaluations: evaluationItems as unknown as import("@prisma/client").Prisma.InputJsonValue,
    rawSummaryMd: md,
    sourcePath,
  };
}

async function ingest() {
  console.log("Starting data ingestion...");
  let total = 0;
  let created = 0;
  let updated = 0;

  for (const house of HOUSES) {
    const houseDir = path.join(BASE_DIR, house);
    if (!fs.existsSync(houseDir)) {
      console.warn(`Directory not found: ${houseDir}`);
      continue;
    }

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
        const sourcesMd = fs.existsSync(sourcesPath)
          ? fs.readFileSync(sourcesPath, "utf-8")
          : null;

        const sourcePath = `${house}/${party}/${politician}`;
        const data = parseSummaryMd(md, sourcePath, house);

        try {
          const existing = await prisma.politician.findUnique({
            where: { sourcePath },
          });

          if (existing) {
            await prisma.politician.update({
              where: { sourcePath },
              data: { ...data, sourcesMd },
            });
            updated++;
          } else {
            // memory_stats はDBトリガーで自動作成される
            await prisma.politician.create({
              data: { ...data, sourcesMd },
            });
            created++;
          }
          total++;
        } catch (err) {
          console.error(`Error processing ${sourcePath}:`, err);
        }
      }
    }
  }

  // Ensure default settings
  const settingsCount = await prisma.settings.count();
  if (settingsCount === 0) {
    await prisma.settings.create({ data: { memorizedThreshold: 10 } });
  }

  console.log(`Done! Total: ${total}, Created: ${created}, Updated: ${updated}`);
  await prisma.$disconnect();
}

ingest().catch((e) => {
  console.error(e);
  process.exit(1);
});
