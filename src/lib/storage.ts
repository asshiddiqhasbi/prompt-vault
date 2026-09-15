import { DEFAULT_CATEGORIES, SEED_PROMPTS } from "@/data/seedPrompts";
import { Category, ExportData, PromptItem } from "@/types/prompt";

const PROMPTS_STORAGE_KEY = "promptvault_prompts_v1";
const CATEGORIES_STORAGE_KEY = "promptvault_categories_v1";

/**
 * Sanitasi dan validasi objek Prompt untuk mencegah XSS & Malicious Schema Injection.
 */
function sanitizePromptItem(item: unknown): PromptItem | null {
  if (!item || typeof item !== "object") return null;

  const obj = item as Record<string, unknown>;

  const id = typeof obj.id === "string" && obj.id.trim() ? obj.id.trim() : `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const title = typeof obj.title === "string" ? obj.title.trim() : "";
  const content = typeof obj.content === "string" ? obj.content.trim() : "";

  // Title dan content wajib ada dan tidak boleh kosong
  if (!title || !content) return null;

  const description = typeof obj.description === "string" ? obj.description.trim() : "";
  const categoryId = typeof obj.categoryId === "string" && obj.categoryId.trim() ? obj.categoryId.trim() : "engineering";

  let tags: string[] = [];
  if (Array.isArray(obj.tags)) {
    tags = obj.tags
      .filter((t): t is string => typeof t === "string" && Boolean(t.trim()))
      .map((t: string) => (t.trim().startsWith("#") ? t.trim() : `#${t.trim()}`));
  }

  const isFavorite = Boolean(obj.isFavorite);
  const createdAt = typeof obj.createdAt === "string" ? obj.createdAt : new Date().toISOString();
  const updatedAt = typeof obj.updatedAt === "string" ? obj.updatedAt : new Date().toISOString();

  return {
    id,
    title,
    description,
    content,
    categoryId,
    tags,
    isFavorite,
    createdAt,
    updatedAt,
  };
}

/**
 * Membaca daftar prompt dari LocalStorage dengan tipe array yang ketat.
 */
export function getStoredPrompts(): PromptItem[] {
  if (typeof window === "undefined") return SEED_PROMPTS;

  try {
    const data = localStorage.getItem(PROMPTS_STORAGE_KEY);
    if (!data) {
      savePrompts(SEED_PROMPTS);
      return SEED_PROMPTS;
    }

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.warn("Skema LocalStorage bukan array. Melakukan reset ke seed data.");
      savePrompts(SEED_PROMPTS);
      return SEED_PROMPTS;
    }

    const sanitized: PromptItem[] = [];
    for (const rawItem of parsed) {
      const cleaned = sanitizePromptItem(rawItem);
      if (cleaned) sanitized.push(cleaned);
    }

    return sanitized.length > 0 ? sanitized : SEED_PROMPTS;
  } catch (error) {
    console.error("Gagal membaca prompts dari LocalStorage:", error);
    return SEED_PROMPTS;
  }
}

/**
 * Menyimpan array prompts ke LocalStorage. Mengembalikan boolean keberhasilan.
 */
export function savePrompts(prompts: PromptItem[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(prompts));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan prompts ke LocalStorage (Kapasitas mungkin penuh):", error);
    return false;
  }
}

/**
 * Membaca daftar kategori dengan tipe array ketat.
 */
export function getStoredCategories(): Category[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;

  try {
    const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!data) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }

    return parsed;
  } catch (error) {
    console.error("Gagal membaca categories dari LocalStorage:", error);
    return DEFAULT_CATEGORIES;
  }
}

/**
 * Menyimpan array kategori.
 */
export function saveCategories(categories: Category[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan categories ke LocalStorage:", error);
    return false;
  }
}

/**
 * Memunculkan download file JSON backup seluruh data.
 */
export function exportDataToJSON(prompts: PromptItem[], categories: Category[]): void {
  const exportPayload: ExportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    prompts,
    categories,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().split("T")[0];
  const a = document.createElement("a");
  a.href = url;
  a.download = `promptvault-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Memvalidasi, memfilter, dan mengimpor file JSON backup secara aman.
 */
export function importDataFromJSON(jsonString: string): {
  success: boolean;
  prompts?: PromptItem[];
  categories?: Category[];
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== "object") {
      return { success: false, error: "Format file JSON tidak valid." };
    }

    if (!Array.isArray(parsed.prompts)) {
      return { success: false, error: "Struktur data tidak memiliki array 'prompts' yang valid." };
    }

    const sanitizedPrompts: PromptItem[] = [];
    for (const rawItem of parsed.prompts) {
      const cleaned = sanitizePromptItem(rawItem);
      if (cleaned) sanitizedPrompts.push(cleaned);
    }

    if (sanitizedPrompts.length === 0) {
      return { success: false, error: "Tidak ada prompt valid yang dapat diimpor dari file ini." };
    }

    const importedCategories: Category[] = Array.isArray(parsed.categories)
      ? parsed.categories
      : DEFAULT_CATEGORIES;

    // Simpan ke storage
    const saveSuccess = savePrompts(sanitizedPrompts);
    if (!saveSuccess) {
      return { success: false, error: "Gagal menyimpan data ke LocalStorage. Penyimpanan penuh." };
    }

    saveCategories(importedCategories);

    return {
      success: true,
      prompts: sanitizedPrompts,
      categories: importedCategories,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Gagal melakukan parse file JSON.",
    };
  }
}
