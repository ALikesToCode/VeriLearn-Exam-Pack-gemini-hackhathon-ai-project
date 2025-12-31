import { VaultDoc } from "./types";

function extractKeywords(value: string) {
  return Array.from(
    new Set(
      value
        .toLowerCase()
        .split(/[^a-z0-9]+/g)
        .filter((word) => word.length >= 4)
    )
  );
}

function findSnippets(content: string, keyword: string, windowSize = 120) {
  const snippets: string[] = [];
  const lower = content.toLowerCase();
  let index = 0;
  while (true) {
    const match = lower.indexOf(keyword, index);
    if (match === -1) break;
    const start = Math.max(0, match - windowSize);
    const end = Math.min(content.length, match + keyword.length + windowSize);
    const snippet = content.slice(start, end).replace(/\s+/g, " ").trim();
    snippets.push(snippet);
    index = match + keyword.length;
    if (snippets.length >= 3) break;
  }
  return snippets;
}

export function buildVaultContext(
  query: string,
  docs: VaultDoc[],
  maxChars = 4000
) {
  if (!docs.length) return "";
  const keywords = extractKeywords(query);
  const chunks: string[] = [];

  docs.forEach((doc) => {
    if (!doc.content) return;
    const snippets: string[] = [];
    keywords.forEach((keyword) => {
      snippets.push(...findSnippets(doc.content, keyword));
    });

    const unique = Array.from(new Set(snippets)).slice(0, 4);
    if (unique.length) {
      chunks.push(`Document: ${doc.name}\n${unique.join(" ... ")}`);
    }
  });

  if (!chunks.length) {
    docs.forEach((doc) => {
      const excerpt = doc.content.slice(0, 600).replace(/\s+/g, " ").trim();
      if (excerpt) chunks.push(`Document: ${doc.name}\n${excerpt}`);
    });
  }

  const combined = chunks.join("\n\n");
  return combined.slice(0, maxChars);
}
