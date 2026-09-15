export interface PromptItem {
  id: string;
  title: string;
  description?: string;
  content: string; // Teks prompt dengan placeholder {{var}}
  categoryId: string; // Kategori ID
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface ExportData {
  version: string;
  exportDate: string;
  prompts: PromptItem[];
  categories: Category[];
}
