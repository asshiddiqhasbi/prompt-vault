"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { PromptCard } from "@/components/PromptCard";
import { UsePromptModal } from "@/components/UsePromptModal";
import { PromptEditorModal } from "@/components/PromptEditorModal";
import { ExportImportModal } from "@/components/ExportImportModal";
import { Category, PromptItem } from "@/types/prompt";
import {
  getStoredCategories,
  getStoredPrompts,
  savePrompts,
} from "@/lib/storage";
import { Plus, RefreshCw, Terminal } from "lucide-react";

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals State
  const [selectedPromptForUse, setSelectedPromptForUse] = useState<PromptItem | null>(null);
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);

  const [promptToEdit, setPromptToEdit] = useState<PromptItem | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Initial Load from LocalStorage
  useEffect(() => {
    setPrompts(getStoredPrompts());
    setCategories(getStoredCategories());
  }, []);

  // Update LocalStorage whenever prompts state changes
  const updatePrompts = (newPrompts: PromptItem[]) => {
    setPrompts(newPrompts);
    savePrompts(newPrompts);
  };

  // Collect all unique tags for filter cloud
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    prompts.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [prompts]);

  // Filter Logic
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      // Filter Category
      if (selectedCategory !== "all" && prompt.categoryId !== selectedCategory) {
        return false;
      }

      // Filter Favorites
      if (showFavoritesOnly && !prompt.isFavorite) {
        return false;
      }

      // Filter Tags (Must include all selected tags)
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((t) => prompt.tags?.includes(t));
        if (!hasAllTags) return false;
      }

      // Filter Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = prompt.title.toLowerCase().includes(query);
        const matchesDesc = prompt.description?.toLowerCase().includes(query);
        const matchesContent = prompt.content.toLowerCase().includes(query);
        const matchesTag = prompt.tags?.some((t) => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesContent && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [prompts, selectedCategory, showFavoritesOnly, selectedTags, searchQuery]);

  // Handlers
  const handleUsePrompt = (prompt: PromptItem) => {
    setSelectedPromptForUse(prompt);
    setIsUseModalOpen(true);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = prompts.map((p) =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    updatePrompts(updated);
  };

  const handleSavePrompt = (data: Partial<PromptItem>) => {
    if (data.id) {
      // Edit existing
      const updated = prompts.map((p) =>
        p.id === data.id
          ? {
              ...p,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : p
      );
      updatePrompts(updated as PromptItem[]);
    } else {
      // Add new
      const newPrompt: PromptItem = {
        id: `prompt-${Date.now()}`,
        title: data.title || "Untitled Prompt",
        description: data.description || "",
        content: data.content || "",
        categoryId: data.categoryId || "engineering",
        tags: data.tags || [],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatePrompts([newPrompt, ...prompts]);
    }
  };

  const handleDeletePrompt = (id: string) => {
    if (confirm("Apakah kamu yakin ingin menghapus prompt ini?")) {
      const updated = prompts.filter((p) => p.id !== id);
      updatePrompts(updated);
    }
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImportSuccess = (importedPrompts: PromptItem[]) => {
    setPrompts(importedPrompts);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTags([]);
    setShowFavoritesOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Navbar */}
      <Navbar
        promptCount={prompts.length}
        onOpenAddModal={() => {
          setPromptToEdit(null);
          setIsEditorModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        {/* Header Title */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
              Prompt Collection
            </h1>
            <p className="text-xs text-zinc-400">
              Koleksi prompt terorganisir dengan pengisian variabel dinamis.
            </p>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          allTags={allTags}
          selectedTags={selectedTags}
          onToggleTag={handleToggleTag}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        />

        {/* Prompts Card Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrompts.map((prompt) => {
              const category = categories.find((c) => c.id === prompt.categoryId);
              return (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  category={category}
                  onUsePrompt={handleUsePrompt}
                  onToggleFavorite={handleToggleFavorite}
                  onEditPrompt={(p) => {
                    setPromptToEdit(p);
                    setIsEditorModalOpen(true);
                  }}
                  onDeletePrompt={handleDeletePrompt}
                />
              );
            })}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="my-12 text-center py-10 px-4 border border-zinc-800 rounded-lg bg-zinc-900/20 max-w-md mx-auto">
            <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-zinc-300">
              Tidak ada prompt ditemukan
            </h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4 font-mono">
              Ganti kata kunci atau reset filter.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>

              <button
                onClick={() => {
                  setPromptToEdit(null);
                  setIsEditorModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Prompt</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-4 text-center text-[11px] font-mono text-zinc-500">
        <p>PromptVault v1.0 • Modern Minimalist Developer Tool</p>
      </footer>

      {/* Modals */}
      <UsePromptModal
        prompt={selectedPromptForUse}
        isOpen={isUseModalOpen}
        onClose={() => setIsUseModalOpen(false)}
      />

      <PromptEditorModal
        promptToEdit={promptToEdit}
        categories={categories}
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        onSave={handleSavePrompt}
      />

      <ExportImportModal
        prompts={prompts}
        categories={categories}
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
