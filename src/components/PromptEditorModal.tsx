"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Info } from "lucide-react";
import { Category, PromptItem } from "@/types/prompt";
import { extractVariables } from "@/lib/variableParser";

interface PromptEditorModalProps {
  promptToEdit: PromptItem | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (promptData: Partial<PromptItem>) => void;
}

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({
  promptToEdit,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (promptToEdit) {
      setTitle(promptToEdit.title);
      setDescription(promptToEdit.description || "");
      setContent(promptToEdit.content);
      setCategoryId(promptToEdit.categoryId);
      setTagsInput(promptToEdit.tags ? promptToEdit.tags.join(", ") : "");
    } else {
      setTitle("");
      setDescription("");
      setContent("");
      setCategoryId(categories.length > 1 ? categories[1].id : "engineering");
      setTagsInput("");
    }
  }, [promptToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const detectedVars = extractVariables(content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    onSave({
      id: promptToEdit ? promptToEdit.id : undefined,
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      categoryId: categoryId || "engineering",
      tags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/60">
          <h2 className="text-base font-semibold text-zinc-100">
            {promptToEdit ? "Edit Prompt" : "Tambah Prompt Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Judul Prompt *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Tulis PRD Lengkap..."
              className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                {categories
                  .filter((c) => c.id !== "all")
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">
                Tags (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="#prd, #design, #security"
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Deskripsi Singkat (Opsional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kegunaan prompt ini secara ringkas..."
              className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">Isi Teks Prompt *</label>
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Info className="w-3 h-3 text-blue-400" />
                Gunakan <code className="text-blue-400 font-mono">{"{{VARIABEL}}"}</code> untuk nilai dinamis
              </span>
            </div>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis prompt kamu di sini... Contoh: Kamu adalah {{ROLE}}. Saya butuh {{OUTPUT}}."
              className="w-full p-3 font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Detected Variables Badge */}
          {detectedVars.length > 0 && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-blue-300">
                Variabel Terdeteksi ({detectedVars.length}):
              </span>
              {detectedVars.map((v) => (
                <span
                  key={v.key}
                  className="px-2 py-0.5 text-[10px] font-mono rounded bg-blue-500/20 text-blue-200 border border-blue-500/30"
                >
                  {`{{${v.key}}}`}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 transition-all shadow-sm shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Prompt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
