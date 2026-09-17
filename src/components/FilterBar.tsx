"use client";

import React, { useEffect, useRef } from "react";
import { Search, X, Star, ArrowUpDown, Settings2 } from "lucide-react";
import { Category, SortOption } from "@/types/prompt";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenCategoryManager: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  allTags,
  selectedTags,
  onToggleTag,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  sortBy,
  onSortChange,
  onOpenCategoryManager,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-3 mb-6">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari prompt, judul, atau kata kunci..."
          className="w-full pl-9 pr-16 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors font-sans"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5 pointer-events-none">
          {searchQuery ? (
            <button
              onClick={() => onSearchChange("")}
              className="pointer-events-auto text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.5 border border-zinc-800 rounded bg-zinc-950">
              ⌘K
            </span>
          )}
        </div>
      </div>

      {/* Category Tabs, Custom Manage Button, Sort & Favorites */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isSelected
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                {cat.name}
              </button>
            );
          })}

          {/* Manage Categories Button */}
          <button
            onClick={onOpenCategoryManager}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 border border-emerald-800/40 rounded-lg hover:bg-emerald-950/60 transition-colors whitespace-nowrap ml-1"
            title="Kelola & Tambah Kategori"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Kelola Kategori</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sorting Dropdown with Dark Styled Native Options */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1">
            <ArrowUpDown className="w-3 h-3 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-zinc-900 text-[11px] text-zinc-200 font-sans focus:outline-none cursor-pointer border-none"
            >
              <option value="latest" className="bg-zinc-900 text-zinc-100 py-1">
                Terbaru
              </option>
              <option value="most_used" className="bg-zinc-900 text-zinc-100 py-1">
                Paling Sering Dipakai
              </option>
              <option value="recently_used" className="bg-zinc-900 text-zinc-100 py-1">
                Terakhir Dipakai
              </option>
              <option value="alphabetical" className="bg-zinc-900 text-zinc-100 py-1">
                Abjad A-Z
              </option>
            </select>
          </div>

          {/* Favorite Filter Toggle */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors border ${
              showFavoritesOnly
                ? "bg-zinc-800 text-amber-300 border-zinc-700"
                : "text-zinc-400 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? "fill-amber-400 text-amber-400" : ""}`} />
            <span>Favorit</span>
          </button>
        </div>
      </div>

      {/* Tags Filter Bar */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-zinc-500 mr-1">Tags:</span>
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors border ${
                  isSelected
                    ? "bg-zinc-800 text-zinc-100 border-zinc-700"
                    : "bg-zinc-950 text-zinc-500 border-zinc-900 hover:text-zinc-300 hover:border-zinc-800"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
