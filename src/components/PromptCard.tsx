"use client";

import React, { useState } from "react";
import { Star, Copy, Edit2, Trash2, Share2, FileCode, Check } from "lucide-react";
import { Category, PromptItem } from "@/types/prompt";
import { extractVariables, downloadSkillMarkdown, generateShareableUrl } from "@/lib/variableParser";

interface PromptCardProps {
  prompt: PromptItem;
  category?: Category;
  onUsePrompt: (prompt: PromptItem) => void;
  onToggleFavorite: (id: string) => void;
  onEditPrompt: (prompt: PromptItem) => void;
  onDeletePrompt: (id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  category,
  onUsePrompt,
  onToggleFavorite,
  onEditPrompt,
  onDeletePrompt,
}) => {
  const [isShareCopied, setIsShareCopied] = useState(false);
  const variables = extractVariables(prompt.content);

  const categoryColor = category?.color || {
    bg: "bg-zinc-800",
    text: "text-zinc-300",
    border: "border-zinc-700",
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateShareableUrl(prompt);
    try {
      await navigator.clipboard.writeText(url);
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin link share:", err);
    }
  };

  const handleExportSkill = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadSkillMarkdown(prompt);
  };

  return (
    <div className="group flex flex-col justify-between bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 transition-all">
      {/* Top Header: Category & Actions */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}
            >
              {category?.name || "Umum"}
            </span>

            {prompt.copyCount && prompt.copyCount > 0 ? (
              <span className="text-[10px] text-zinc-500 font-mono">
                {prompt.copyCount}x dipakai
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Salin Link Bagikan Prompt"
            >
              {isShareCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={handleExportSkill}
              className="p-1 text-zinc-500 hover:text-blue-400 transition-colors"
              title="Export Format Markdown SKILL"
            >
              <FileCode className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onToggleFavorite(prompt.id)}
              className="p-1 text-zinc-500 hover:text-amber-400 transition-colors"
              title={prompt.isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  prompt.isFavorite ? "fill-amber-400 text-amber-400" : ""
                }`}
              />
            </button>

            <button
              onClick={() => onEditPrompt(prompt)}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
              title="Edit Prompt"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDeletePrompt(prompt.id)}
              className="p-1 text-zinc-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
              title="Hapus Prompt"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-sm font-semibold text-zinc-100 mb-1 line-clamp-1 group-hover:text-white transition-colors">
          {prompt.title}
        </h3>
        {prompt.description && (
          <p className="text-xs text-zinc-400 mb-3 line-clamp-2 leading-relaxed font-sans">
            {prompt.description}
          </p>
        )}

        {/* Code Preview Box */}
        <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-lg p-3 my-2.5 text-[11px] text-zinc-400 line-clamp-3 leading-relaxed font-sans">
          {prompt.content}
        </div>
      </div>

      {/* Footer: Variables count & Use Button */}
      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1">
          {variables.length > 0 ? (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {variables.length} Isian Form
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
              Siap Pakai
            </span>
          )}
        </div>

        <button
          onClick={() => onUsePrompt(prompt)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/30 hover:border-emerald-500 transition-all"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Gunakan Prompt</span>
        </button>
      </div>
    </div>
  );
};
