"use client";

import React, { useState, useRef } from "react";
import { X, Download, Upload, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { Category, PromptItem } from "@/types/prompt";
import { exportDataToJSON, importDataFromJSON } from "@/lib/storage";
import { downloadCategoryMarkdownBundle } from "@/lib/variableParser";

interface ExportImportModalProps {
  prompts: PromptItem[];
  categories: Category[];
  selectedCategoryId: string;
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (prompts: PromptItem[], categories?: Category[]) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  prompts,
  categories,
  selectedCategoryId,
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const activeCat = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const activeCategoryPrompts = selectedCategoryId === "all"
    ? prompts
    : prompts.filter((p) => p.categoryId === selectedCategoryId);

  const handleExportJSON = () => {
    exportDataToJSON(prompts, categories);
  };

  const handleExportCategoryMarkdown = () => {
    downloadCategoryMarkdownBundle(activeCat.name, activeCategoryPrompts);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDataFromJSON(content);

      if (res.success && res.prompts) {
        setImportStatus({
          type: "success",
          message: `Berhasil mengimpor ${res.prompts.length} prompt!`,
        });
        onImportSuccess(res.prompts, res.categories);
      } else {
        setImportStatus({
          type: "error",
          message: res.error || "Gagal mengimpor file JSON.",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <h2 className="text-sm font-semibold text-zinc-100">
            Backup, Restore & Export Koleksi
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Export Bundle Markdown Category */}
          <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-semibold text-zinc-100">
                Unduh Bundle Markdown Kategori ({activeCategoryPrompts.length} Prompt)
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unduh seluruh {activeCategoryPrompts.length} prompt pada kategori <span className="text-zinc-200 font-semibold">{activeCat.name}</span> menjadi 1 file dokumentasi Markdown (.md).
            </p>
            <button
              onClick={handleExportCategoryMarkdown}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-zinc-950 border border-blue-500/30 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Unduh Bundle Markdown ({activeCat.name})</span>
            </button>
          </div>

          {/* Section Export JSON */}
          <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-zinc-100">
                Ekspor Backup JSON Total ({prompts.length} Prompt)
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unduh seluruh koleksi prompt dan kategori kamu ke dalam file JSON lokal untuk pencadangan aman.
            </p>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/30 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File Backup JSON</span>
            </button>
          </div>

          {/* Section Import */}
          <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-semibold text-zinc-100">
                Impor File Backup (.json)
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unggah file backup `.json` sebelumnya untuk memulihkan koleksi prompt kamu.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Pilih File Backup JSON</span>
            </button>
          </div>

          {/* Import Status Alert */}
          {importStatus.type && (
            <div
              className={`p-3 border rounded-xl flex items-center gap-2 text-xs ${
                importStatus.type === "success"
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-800"
                  : "bg-rose-950/40 text-rose-300 border-rose-800"
              }`}
            >
              {importStatus.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-zinc-800 bg-zinc-950">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
