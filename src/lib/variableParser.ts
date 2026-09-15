/**
 * Utility untuk mengekstrak dan mengganti variabel dinamis {{VAR_NAME}} pada teks prompt.
 */

// Regex untuk mencocokkan {{NAMA_VARIABEL}}
const VARIABLE_REGEX = /\{\{([A-Z0-9_]+)\}\}/gi;

export interface ExtractedVariable {
  key: string; // Misal: IDE_PRODUK
  placeholder: string; // Misal: {{IDE_PRODUK}}
  label: string; // Misal: "Ide Produk"
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

      // Ubah IDE_PRODUK menjadi "Ide Produk" untuk label UI
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
    // Cari nilai di valuesMap (case-insensitive)
    const foundKey = Object.keys(valuesMap).find(
      (k) => k.toUpperCase() === key.toUpperCase()
    );

    if (foundKey && valuesMap[foundKey]?.trim()) {
      return valuesMap[foundKey].trim();
    }
    // Jika tidak diisi, kembalikan placeholder asli
    return match;
  });
}
