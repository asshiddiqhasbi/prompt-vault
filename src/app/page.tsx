"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { PromptCard } from "@/components/PromptCard";
import { UsePromptModal } from "@/components/UsePromptModal";
import { PromptEditorModal } from "@/components/PromptEditorModal";
import { ExportImportModal } from "@/components/ExportImportModal";
import { SharedPromptModal } from "@/components/SharedPromptModal";
import { CategoryManagerModal } from "@/components/CategoryManagerModal";
import { Category, PromptItem, SortOption } from "@/types/prompt";
import {
  getStoredCategories,
  getStoredPrompts,
  saveCategories,
  savePrompts,
} from "@/lib/storage";
import { parseShareableUrlParam } from "@/lib/variableParser";
import { Plus, RefreshCw, Bookmark } from "lucide-react";

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  // Modals State
  const [selectedPromptForUse, setSelectedPromptForUse] = useState<PromptItem | null>(null);
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);

  const [promptToEdit, setPromptToEdit] = useState<PromptItem | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  // URL Shared Prompt Modal State
  const [sharedPromptFromUrl, setSharedPromptFromUrl] = useState<Partial<PromptItem> | null>(null);
  const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);

  // Initial Load & Check URL Search Params
  useEffect(() => {
    const loadedPrompts = getStoredPrompts();
    setPrompts(loadedPrompts);
    setCategories(getStoredCategories());

    // Check ?share=... query param
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const shareParam = urlParams.get("share");
      if (shareParam) {
        const parsed = parseShareableUrlParam(shareParam);
        if (parsed) {
          setSharedPromptFromUrl(parsed);
          setIsSharedModalOpen(true);
        }
      }
    }
  }, []);

  // Update LocalStorage whenever prompts state changes
  const updatePrompts = (newPrompts: PromptItem[]) => {
    setPrompts(newPrompts);
    savePrompts(newPrompts);
  };

  // Add new Custom Category
  const handleAddCategory = ({ name, colorKey }: { name: string; colorKey: string }) => {
    const newCatId = `custom-${Date.now()}`;
    const colorMap: Record<string, Category["color"]> = {
      emerald: { bg: "bg-emerald-950/50", text: "text-emerald-300", border: "border-emerald-800/40" },
      purple: { bg: "bg-purple-950/50", text: "text-purple-300", border: "border-purple-800/40" },
      blue: { bg: "bg-blue-950/50", text: "text-blue-300", border: "border-blue-800/40" },
      cyan: { bg: "bg-cyan-950/50", text: "text-cyan-300", border: "border-cyan-800/40" },
      amber: { bg: "bg-amber-950/50", text: "text-amber-300", border: "border-amber-800/40" },
      rose: { bg: "bg-rose-950/50", text: "text-rose-300", border: "border-rose-800/40" },
      zinc: { bg: "bg-zinc-900", text: "text-zinc-300", border: "border-zinc-700" },
    };

    const newCategory: Category = {
      id: newCatId,
      name,
      slug: newCatId,
      isDefault: false,
      color: colorMap[colorKey] || colorMap.zinc,
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    setSelectedCategory(newCatId);
  };

  // Edit Existing Custom Category
  const handleEditCategory = (catId: string, newName: string, colorKey: string) => {
    const colorMap: Record<string, Category["color"]> = {
      emerald: { bg: "bg-emerald-950/50", text: "text-emerald-300", border: "border-emerald-800/40" },
      purple: { bg: "bg-purple-950/50", text: "text-purple-300", border: "border-purple-800/40" },
      blue: { bg: "bg-blue-950/50", text: "text-blue-300", border: "border-blue-800/40" },
      cyan: { bg: "bg-cyan-950/50", text: "text-cyan-300", border: "border-cyan-800/40" },
      amber: { bg: "bg-amber-950/50", text: "text-amber-300", border: "border-amber-800/40" },
      rose: { bg: "bg-rose-950/50", text: "text-rose-300", border: "border-rose-800/40" },
      zinc: { bg: "bg-zinc-900", text: "text-zinc-300", border: "border-zinc-700" },
    };

    const updatedCategories = categories.map((c) =>
      c.id === catId ? { ...c, name: newName, color: colorMap[colorKey] || c.color } : c
    );
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  };

  // Delete Custom Category
  const handleDeleteCategory = (catId: string) => {
    const updatedCategories = categories.filter((c) => c.id !== catId);
    setCategories(updatedCategories);
    saveCategories(updatedCategories);

    const updatedPrompts = prompts.map((p) =>
      p.categoryId === catId ? { ...p, categoryId: "writing" } : p
    );
    updatePrompts(updatedPrompts);

    if (selectedCategory === catId) {
      setSelectedCategory("all");
    }
  };

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    prompts.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [prompts]);

  // Filter & Sort Logic (Always pin favorites to top)
  const filteredPrompts = useMemo(() => {
    const filtered = prompts.filter((prompt) => {
      if (selectedCategory !== "all" && prompt.categoryId !== selectedCategory) {
        return false;
      }
      if (showFavoritesOnly && !prompt.isFavorite) {
        return false;
      }
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((t) => prompt.tags?.includes(t));
        if (!hasAllTags) return false;
      }
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

    // Sort Order with Pinned Favorites Prioritization
    return filtered.sort((a, b) => {
      // Pinned Favorites always stay on top unless sorting specifically by other criteria
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }

      if (sortBy === "most_used") {
        return (b.copyCount || 0) - (a.copyCount || 0);
      }
      if (sortBy === "recently_used") {
        const dateA = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
        const dateB = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [prompts, selectedCategory, showFavoritesOnly, selectedTags, searchQuery, sortBy]);

  // Handlers
  const handleUsePrompt = (prompt: PromptItem) => {
    setSelectedPromptForUse(prompt);
    setIsUseModalOpen(true);

    const updated = prompts.map((p) =>
      p.id === prompt.id
        ? {
            ...p,
            copyCount: (p.copyCount || 0) + 1,
            lastUsedAt: new Date().toISOString(),
          }
        : p
    );
    updatePrompts(updated);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = prompts.map((p) =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    updatePrompts(updated);
  };

  const handleSavePrompt = (data: Partial<PromptItem>) => {
    if (data.id) {
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
      const newPrompt: PromptItem = {
        id: `prompt-${Date.now()}`,
        title: data.title || "Untitled Prompt",
        description: data.description || "",
        content: data.content || "",
        categoryId: data.categoryId || "writing",
        tags: data.tags || [],
        isFavorite: false,
        copyCount: 0,
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

  const handleImportSuccess = (importedPrompts: PromptItem[], importedCategories?: Category[]) => {
    setPrompts(importedPrompts);
    if (importedCategories) setCategories(importedCategories);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTags([]);
    setShowFavoritesOnly(false);
    setSortBy("latest");
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Welcome Banner */}
        <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-50 flex items-center gap-2">
              <span>Universal AI Prompt Vault</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Simpan, kustomisasi form isian, dan salin template prompt AI terbaikmu untuk penulisan, bisnis, belajar, kreasi visual, hingga koding dalam 1-klik.
            </p>
          </div>

          <button
            onClick={() => {
              setPromptToEdit(null);
              setIsEditorModalOpen(true);
            }}
            className="self-start sm:self-auto shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 transition-all shadow-md shadow-emerald-500/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Prompt Baru</span>
          </button>
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
          sortBy={sortBy}
          onSortChange={setSortBy}
          onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
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
          <div className="my-12 text-center py-10 px-4 border border-zinc-800 rounded-xl bg-zinc-900/30 max-w-md mx-auto">
            <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto mb-3 text-zinc-400">
              <Bookmark className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">
              Tidak ada prompt yang cocok
            </h3>
            <p className="text-xs text-zinc-400 mt-1 mb-4">
              Coba ganti kata kunci pencarian atau reset filter kategori & tag.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>

              <button
                onClick={() => {
                  setPromptToEdit(null);
                  setIsEditorModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Prompt Baru</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-5 text-center text-xs text-zinc-500">
        <p>PromptVault • Universal AI Prompt & Workflow Manager for Everyone</p>
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
        existingTags={allTags}
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        onSave={handleSavePrompt}
      />

      <ExportImportModal
        prompts={prompts}
        categories={categories}
        selectedCategoryId={selectedCategory}
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <SharedPromptModal
        sharedPrompt={sharedPromptFromUrl}
        isOpen={isSharedModalOpen}
        onClose={() => setIsSharedModalOpen(false)}
        onSaveToVault={handleSavePrompt}
      />

      <CategoryManagerModal
        categories={categories}
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
}
