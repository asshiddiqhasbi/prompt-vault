import { PromptItem } from "@/types/prompt";

/**
 * Utility untuk mengekstrak dan mengganti variabel dinamis {{VAR_NAME}} pada teks prompt.
 */

const VARIABLE_REGEX = /\{\{([A-Z0-9_]+)\}\}/gi;

export interface ExtractedVariable {
  key: string;
  placeholder: string;
  label: string;
}

/**
 * Mengekstrak daftar variabel unik dari isi teks prompt.
 */
export function extractVariables(content: string): ExtractedVariable[] {
  if (!content) return [];

  const matches = Array.from(content.matchAll(VARIABLE_REGEX));
  const uniqueKeys = new Set<string>();
  const variables: ExtractedVariable[] = [];

  for (const match of matches) {
    const rawKey = match[1].trim();
    const upperKey = rawKey.toUpperCase();

    if (!uniqueKeys.has(upperKey)) {
      uniqueKeys.add(upperKey);

      const label = rawKey
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

      variables.push({
        key: rawKey,
        placeholder: match[0],
        label,
      });
    }
  }

  return variables;
}

/**
 * Mengganti variabel {{VAR_NAME}} dengan nilai dari user input.
 */
export function replaceVariables(
  content: string,
  valuesMap: Record<string, string>
): string {
  if (!content) return "";

  return content.replace(VARIABLE_REGEX, (match, p1) => {
    const key = p1.trim();
    const foundKey = Object.keys(valuesMap).find(
      (k) => k.toUpperCase() === key.toUpperCase()
    );

    if (foundKey && valuesMap[foundKey]?.trim()) {
      return valuesMap[foundKey].trim();
    }
    return match;
  });
}

/**
 * Mengubah PromptItem menjadi format markdown SKILL.md
 */
export function generateSkillMarkdown(prompt: PromptItem): string {
  const vars = extractVariables(prompt.content);
  const slugTitle = prompt.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return `# Skill: ${prompt.title}

---

## 1. Nama Skill
\`${slugTitle}\`

---

## 2. Deskripsi & Trigger
${prompt.description || "Reusable prompt skill for AI Agent & LLM workflow."}

---

## 3. Variabel Dinamis
${vars.length > 0 ? vars.map((v, i) => `${i + 1}. \`{{${v.key}}}\`: ${v.label}`).join("\n") : "Prompt ini tidak memerlukan variabel dinamis."}

---

## 4. Isi Template Prompt
\`\`\`text
${prompt.content}
\`\`\`

---

## 5. Metadata
- Category: ${prompt.categoryId}
- Tags: ${prompt.tags?.join(", ") || "-"}
- Exported from: PromptVault
`;
}

/**
 * Mengunduh file .skill.md
 */
export function downloadSkillMarkdown(prompt: PromptItem): void {
  const skillContent = generateSkillMarkdown(prompt);
  const blob = new Blob([skillContent], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const slugTitle = prompt.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugTitle}.skill.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Mengunduh seluruh koleksi prompt dalam 1 file Bundle Markdown (.md)
 */
export function downloadCategoryMarkdownBundle(categoryName: string, prompts: PromptItem[]): void {
  const dateStr = new Date().toISOString().split("T")[0];
  let mdContent = `# Koleksi Prompt: ${categoryName}\n`;
  mdContent += `> Diunduh dari PromptVault pada ${dateStr} (${prompts.length} prompt)\n\n---\n\n`;

  prompts.forEach((p, idx) => {
    const vars = extractVariables(p.content);
    mdContent += `## ${idx + 1}. ${p.title}\n`;
    if (p.description) mdContent += `*${p.description}*\n\n`;
    if (p.tags && p.tags.length > 0) mdContent += `**Tags**: ${p.tags.join(" ")}\n\n`;
    if (vars.length > 0) mdContent += `**Variabel Form**: ${vars.map((v) => `\`{{${v.key}}}\``).join(", ")}\n\n`;
    mdContent += `\`\`\`text\n${p.content}\n\`\`\`\n\n---\n\n`;
  });

  const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const a = document.createElement("a");
  a.href = url;
  a.download = `koleksi-prompt-${slug}-${dateStr}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Mengencode prompt menjadi URL Shareable
 */
export function generateShareableUrl(prompt: PromptItem): string {
  if (typeof window === "undefined") return "";

  const payload = {
    t: prompt.title,
    d: prompt.description || "",
    c: prompt.content,
    cat: prompt.categoryId,
    tags: prompt.tags || [],
  };

  const jsonStr = JSON.stringify(payload);
  const encoded = btoa(encodeURIComponent(jsonStr));
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?share=${encoded}`;
}

/**
 * Meng-decode data prompt dari URL query parameter ?share=...
 */
export function parseShareableUrlParam(encodedStr: string): Partial<PromptItem> | null {
  try {
    const jsonStr = decodeURIComponent(atob(encodedStr));
    const parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed !== "object" || !parsed.t || !parsed.c) {
      return null;
    }

    return {
      title: String(parsed.t).trim(),
      description: typeof parsed.d === "string" ? parsed.d.trim() : "",
      content: String(parsed.c).trim(),
      categoryId: typeof parsed.cat === "string" ? parsed.cat : "writing",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch (err) {
    console.error("Gagal parse shareable URL parameter:", err);
    return null;
  }
}
