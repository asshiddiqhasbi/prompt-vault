"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Save, Info, PlusCircle } from "lucide-react";
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
  const [newVarName, setNewVarName] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    setNewVarName("");
  }, [promptToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const detectedVars = extractVariables(content);

  const handleInsertVariable = () => {
    if (!newVarName.trim()) return;
    const cleanVar = newVarName.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    const varString = `{{${cleanVar}}}`;

    // Insert at cursor position
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = content.substring(0, start) + varString + content.substring(end);
      setContent(newText);
      setNewVarName("");
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + varString.length, start + varString.length);
      }, 50);
    } else {
      setContent(content + " " + varString);
      setNewVarName("");
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950">
          <h2 className="text-xs font-semibold text-zinc-100">
            {promptToEdit ? "Edit Prompt" : "Tambah Prompt Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Judul Prompt *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Tulis PRD Lengkap..."
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-100 focus:outline-none focus:border-zinc-700"
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
                className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 font-mono"
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
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
            />
          </div>

          {/* Quick Insert Variable Helper */}
          <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded flex items-center gap-2">
            <input
              type="text"
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInsertVariable();
                }
              }}
              placeholder="Nama Variabel (contoh: NAMA_PRODUK)"
              className="flex-1 px-2 py-1 text-[11px] font-mono bg-zinc-900 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleInsertVariable}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded transition-colors"
            >
              <PlusCircle className="w-3 h-3 text-emerald-400" />
              <span>Sisipkan {"{{VAR}}"}</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">Isi Teks Prompt *</label>
              <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                <Info className="w-3 h-3 text-zinc-400" />
                Sintaks: <code className="text-zinc-300">{"{{VAR}}"}</code>
              </span>
            </div>
            <textarea
              ref={textareaRef}
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis prompt kamu di sini... Contoh: Kamu adalah {{ROLE}}. Saya butuh {{OUTPUT}}."
              className="w-full p-3 font-mono text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 leading-relaxed"
            />
          </div>

          {/* Detected Variables Badge */}
          {detectedVars.length > 0 && (
            <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-zinc-400">
                Variabel ({detectedVars.length}):
              </span>
              {detectedVars.map((v) => (
                <span
                  key={v.key}
                  className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                >
                  {`{{${v.key}}}`}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Prompt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
