"use client";

import React from "react";
import { Plus, Download, Bookmark } from "lucide-react";

interface NavbarProps {
  promptCount: number;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  promptCount,
  onOpenAddModal,
  onOpenBackupModal,
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo & Count Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            <Bookmark className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-zinc-50">
              Prompt<span className="text-emerald-400">Vault</span>
            </span>
            <span className="px-2 py-0.5 text-[11px] font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full">
              {promptCount} Prompts
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBackupModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all"
            title="Backup & Restore Data JSON"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Backup / Restore</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Prompt Baru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
