"use client";

import React from "react";
import { X, Share2, Plus, Terminal } from "lucide-react";
import { PromptItem } from "@/types/prompt";

interface SharedPromptModalProps {
  sharedPrompt: Partial<PromptItem> | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault: (promptData: Partial<PromptItem>) => void;
}

export const SharedPromptModal: React.FC<SharedPromptModalProps> = ({
  sharedPrompt,
  isOpen,
  onClose,
  onSaveToVault,
}) => {
  if (!isOpen || !sharedPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-semibold text-zinc-200">
              Prompt Dibagikan Kepada Kamu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {sharedPrompt.categoryId || "General"}
            </span>
            <h3 className="text-sm font-semibold text-zinc-100 mt-2">
              {sharedPrompt.title}
            </h3>
            {sharedPrompt.description && (
              <p className="text-xs text-zinc-400 mt-1 leading-normal">
                {sharedPrompt.description}
              </p>
            )}
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded p-3 font-mono text-xs text-zinc-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
            {sharedPrompt.content}
          </div>

          {sharedPrompt.tags && sharedPrompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {sharedPrompt.tags.map((t) => (
                <span key={t} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-950 text-zinc-500 border border-zinc-800">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-950">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200"
          >
            Abaikan
          </button>

          <button
            onClick={() => {
              onSaveToVault(sharedPrompt);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simpan ke Vault Saya</span>
          </button>
        </div>
      </div>
    </div>
  );
};
