"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Save, Info, PlusCircle, Tag as TagIcon } from "lucide-react";
import { Category, PromptItem } from "@/types/prompt";
import { extractVariables } from "@/lib/variableParser";

interface PromptEditorModalProps {
  promptToEdit: PromptItem | null;
  categories: Category[];
  existingTags?: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (promptData: Partial<PromptItem>) => void;
}

const TEMPLATE_PRESETS = [
  {
    name: "AIDA Marketing",
    title: "Copywriting Penjualan AIDA",
    categoryId: "business",
    description: "Template copy jualan berdaya konversi tinggi (Attention, Interest, Desire, Action)",
    content: `Kamu adalah copywriter profesional. Buatkan copy penawaran jualan untuk produk berikut.

Nama Produk / Jasa: {{NAMA_PRODUK}}
Manfaat Utama: {{MANFAAT_PRODUK}}
Target Pembeli: {{TARGET_PEMBELI}}

Gunakan Formula AIDA:
- Attention (Headline): Judul unik penarik perhatian.
- Interest: Kaitkan masalah calon pembeli dengan alasan butuh produk ini.
- Desire: Jelaskan keunggulan dan penawaran hemat.
- Action (CTA): Panggilan bertindak membeli (misal: "Klik link di bio!").`,
  },
  {
    name: "Metode Feynman",
    title: "Penjelas Konsep Rumit Bahasa Sederhana",
    categoryId: "education",
    description: "Jelaskan topik akademik/sains rumit seolah-olah mengajar anak usia 10 tahun",
    content: `Berperanlah sebagai edukator jenius. Jelaskan konsep berikut menggunakan Metode Feynman.

Topik Rumit: {{TOPIK_RUMIT}}

Aturan:
1. Jelaskan seolah-olah mengajar anak usia 10 tahun.
2. Gunakan analogi dunia nyata yang akrab sehari-hari.
3. Hindari kata jargon. Jelaskan dalam 3 paragraf singkat.`,
  },
  {
    name: "Role & Task Structure",
    title: "Prompt Struktur Profesional (Role + Task)",
    categoryId: "writing",
    description: "Template prompt umum terstruktur (Peran, Tugas, Konteks, Batasan)",
    content: `Kamu adalah {{ROLE}}. Saya membutuhkan kamu untuk mengerjakan tugas berikut.

Tugas Utama: {{TUGAS_UTAMA}}
Konteks / Latar Belakang: {{KONTEKS}}
Format Output yang Diharapkan: {{FORMAT_OUTPUT}}

Batasan (Constraints):
- Gunakan bahasa {{BAHASA}} yang profesional.
- Jawab secara spesifik, ringkas, dan langsung pada poin utama tanpa prolog bertele-tele.`,
  },
];

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({
  promptToEdit,
  categories,
  existingTags = [],
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
      setCategoryId(categories.length > 1 ? categories[1].id : "writing");
      setTagsInput("");
    }
    setNewVarName("");
  }, [promptToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const detectedVars = extractVariables(content);

  const handleApplyTemplate = (preset: typeof TEMPLATE_PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setContent(preset.content);
    setCategoryId(preset.categoryId);
  };

  const handleInsertVariable = () => {
    if (!newVarName.trim()) return;
    const cleanVar = newVarName.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    const varString = `{{${cleanVar}}}`;

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

  const handleAddTagSuggestion = (tag: string) => {
    const currentTags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      const updated = [...currentTags, tag].join(", ");
      setTagsInput(updated);
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
      categoryId: categoryId || "writing",
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
          {/* Preset Template Buttons (Clean text, no emojis/sparkles) */}
          {!promptToEdit && (
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 font-mono">
                <span>Preset Template:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATE_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyTemplate(p)}
                    className="px-2.5 py-1 text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Judul Prompt *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Script Video Shorts Viral..."
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
                placeholder="#tiktok, #writing, #marketing"
                className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 font-mono"
              />
              {/* Tag Auto-Suggest Pills */}
              {existingTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-0.5 mr-0.5">
                    <TagIcon className="w-2.5 h-2.5" /> Tag:
                  </span>
                  {existingTags.slice(0, 6).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTagSuggestion(tag)}
                      className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-400 border border-zinc-800"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
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
              placeholder="Nama Form (contoh: TOPIK_VIDEO)"
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
              placeholder="Tulis prompt kamu di sini... Contoh: Buatkan script video tentang {{TOPIK}}."
              className="w-full p-3 font-sans text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 leading-relaxed"
            />
          </div>

          {/* Detected Variables Badge */}
          {detectedVars.length > 0 && (
            <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-zinc-400">
                Form Isian Terdeteksi ({detectedVars.length}):
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
