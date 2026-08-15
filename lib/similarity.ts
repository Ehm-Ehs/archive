import { RhymeEntry } from "@/types/rhyme";

export function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanTextContent(text?: string): string {
  if (!text) return "";
  return text
    .replace(/\[#\d+\]/gi, "")
    .replace(/\(stanza \d+\)/gi, "")
    .replace(/\(wisdom note #\d+\)/gi, "")
    .replace(/#\d+/gi, "")
    .trim();
}

export function cleanContributorName(name?: string): string {
  if (!name) return "Anonymous Contributor";
  const cleaned = name.replace(/\s*\d+$/g, "").trim();
  return cleaned || "Anonymous Contributor";
}

export function getCoreText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\(stanza \d+\)/gi, "")
    .replace(/\[#\d+\]/gi, "")
    .replace(/\(wisdom note #\d+\)/gi, "")
    .replace(/#\d+/gi, "")
    .replace(/stanza \d+/gi, "")
    .replace(/contributor \d+/gi, "")
    .replace(/riddle master \d+/gi, "")
    .replace(/elder wisdom \d+/gi, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateTextSimilarity(text1: string, text2: string): number {
  const norm1 = getCoreText(text1);
  const norm2 = getCoreText(text2);

  if (!norm1 || !norm2) return 0;
  if (norm1 === norm2) return 1.0;

  const words1 = new Set(norm1.split(" ").filter((w) => w.length > 2));
  const words2 = new Set(norm2.split(" ").filter((w) => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return 0;

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

export function deduplicateRhymes(rhymes: RhymeEntry[]): RhymeEntry[] {
  const result: RhymeEntry[] = [];

  for (const item of rhymes) {
    const itemText = item.text || item.riddleAnswer || item.proverbMeaning || "";
    const core1 = getCoreText(itemText);

    if (!core1) {
      result.push(item);
      continue;
    }

    const isDuplicate = result.some((existing) => {
      const existingText = existing.text || existing.riddleAnswer || existing.proverbMeaning || "";
      const core2 = getCoreText(existingText);

      if (core1 === core2) return true;
      return calculateTextSimilarity(core1, core2) >= 0.65;
    });

    if (!isDuplicate) {
      result.push({
        ...item,
        name: cleanContributorName(item.name),
        text: cleanTextContent(item.text),
        proverbMeaning: cleanTextContent(item.proverbMeaning),
      });
    }
  }

  return result;
}
