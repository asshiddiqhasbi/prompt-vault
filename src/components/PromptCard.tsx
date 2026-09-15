"use client";

import React from "react";
import { Star, Copy, Edit2, Trash2 } from "lucide-react";
import { Category, PromptItem } from "@/types/prompt";
import { extractVariables } from "@/lib/variableParser";

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
  const variables = extractVariables(prompt.content);

  return (
    <div className="group flex flex-col justify-between bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-lg p-4 transition-colors">
      {/* Top Header: Category & Actions */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="px-2 py-0.5 text-[10px] font-medium font-mono rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
            {category?.name || "General"}
          </span>

          <div className="flex items-center gap-1">
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
          <p className="text-xs text-zinc-400 mb-3 line-clamp-2 leading-normal font-sans">
            {prompt.description}
          </p>
        )}

        {/* Code Preview Box */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded p-2.5 my-2.5 font-mono text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
          {prompt.content}
        </div>
      </div>

      {/* Footer: Variables count & Use Button */}
      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1">
          {variables.length > 0 ? (
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              {variables.length} var
            </span>
          ) : (
            <span className="text-[10px] font-mono text-zinc-600">statis</span>
          )}
        </div>

        <button
          onClick={() => onUsePrompt(prompt)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 transition-colors"
        >
          <Copy className="w-3 h-3 text-zinc-400" />
          <span>Gunakan</span>
        </button>
      </div>
    </div>
  );
};
