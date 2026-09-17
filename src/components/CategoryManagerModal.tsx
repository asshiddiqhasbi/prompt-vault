"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, Edit2, Check, Folder } from "lucide-react";
import { Category } from "@/types/prompt";

interface CategoryManagerModalProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (categoryData: { name: string; colorKey: string }) => void;
  onEditCategory: (id: string, newName: string, colorKey: string) => void;
  onDeleteCategory: (id: string) => void;
}

const COLOR_PRESETS = [
  { key: "emerald", label: "Emerald", bg: "bg-emerald-950/50", text: "text-emerald-300", border: "border-emerald-800/40" },
  { key: "purple", label: "Purple", bg: "bg-purple-950/50", text: "text-purple-300", border: "border-purple-800/40" },
  { key: "blue", label: "Blue", bg: "bg-blue-950/50", text: "text-blue-300", border: "border-blue-800/40" },
  { key: "cyan", label: "Cyan", bg: "bg-cyan-950/50", text: "text-cyan-300", border: "border-cyan-800/40" },
  { key: "amber", label: "Amber", bg: "bg-amber-950/50", text: "text-amber-300", border: "border-amber-800/40" },
  { key: "rose", label: "Rose", bg: "bg-rose-950/50", text: "text-rose-300", border: "border-rose-800/40" },
  { key: "zinc", label: "Zinc", bg: "bg-zinc-900", text: "text-zinc-300", border: "border-zinc-700" },
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  categories,
  isOpen,
  onClose,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const [nameInput, setNameInput] = useState("");
  const [selectedColorKey, setSelectedColorKey] = useState("emerald");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editNameInput, setEditNameInput] = useState("");
  const [editColorKey, setEditColorKey] = useState("emerald");

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onAddCategory({ name: nameInput.trim(), colorKey: selectedColorKey });
    setNameInput("");
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditNameInput(cat.name);
    // Determine color key
    const match = COLOR_PRESETS.find((p) => cat.color?.bg.includes(p.key));
    setEditColorKey(match ? match.key : "zinc");
  };

  const handleSaveEdit = (catId: string) => {
    if (!editNameInput.trim()) return;
    onEditCategory(catId, editNameInput.trim(), editColorKey);
    setEditingCatId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-zinc-100">
              Kelola Kategori Vault
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Form Tambah Kategori Baru */}
          <form onSubmit={handleCreate} className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-3">
            <h3 className="text-xs font-semibold text-zinc-200">
              + Tambah Kategori Kustom Baru
            </h3>

            <div className="space-y-2">
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Contoh: 🎬 YouTube Script, ⚖️ Hukum, 🏥 Kesehatan..."
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all font-sans"
              />

              {/* Color Preset Selector */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-zinc-400">Warna Badge:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setSelectedColorKey(p.key)}
                      className={`px-2 py-0.5 text-[10px] rounded border transition-all ${p.bg} ${p.text} ${p.border} ${
                        selectedColorKey === p.key ? "ring-2 ring-emerald-400 ring-offset-1 ring-offset-zinc-950" : ""
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan Kategori</span>
              </button>
            </div>
          </form>

          {/* List Kategori Aktif */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-400">
              Daftar Kategori Aktif ({categories.filter((c) => c.id !== "all").length})
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {categories
                .filter((c) => c.id !== "all")
                .map((cat) => {
                  const isEditing = editingCatId === cat.id;
                  const isSystemDefault = Boolean(cat.isDefault);

                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 bg-zinc-950/40 border border-zinc-800/80 rounded-xl"
                    >
                      {isEditing ? (
                        /* Inline Edit Form */
                        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mr-2">
                          <input
                            type="text"
                            value={editNameInput}
                            onChange={(e) => setEditNameInput(e.target.value)}
                            className="px-2.5 py-1 text-xs bg-zinc-900 border border-emerald-500 rounded text-zinc-100"
                          />
                          <div className="flex items-center gap-1">
                            {COLOR_PRESETS.map((p) => (
                              <button
                                key={p.key}
                                type="button"
                                onClick={() => setEditColorKey(p.key)}
                                className={`w-4 h-4 rounded-full border ${p.bg} ${p.border} ${
                                  editColorKey === p.key ? "ring-2 ring-emerald-400" : ""
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Standard View */
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-medium rounded-md border ${
                              cat.color?.bg || "bg-zinc-800"
                            } ${cat.color?.text || "text-zinc-200"} ${cat.color?.border || "border-zinc-700"}`}
                          >
                            {cat.name}
                          </span>
                          {isSystemDefault && (
                            <span className="text-[10px] text-zinc-500 font-mono">
                              (Bawaan System)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(cat.id)}
                            className="p-1 text-emerald-400 hover:bg-emerald-950/50 rounded"
                            title="Simpan Perubahan"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(cat)}
                              className="p-1 text-zinc-500 hover:text-zinc-200 rounded"
                              title="Edit Kategori"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {!isSystemDefault && (
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus kategori "${cat.name}"? Prompt dalam kategori ini akan otomatis dipindahkan ke Kategori Umum.`)) {
                                    onDeleteCategory(cat.id);
                                  }
                                }}
                                className="p-1 text-zinc-500 hover:text-rose-400 rounded"
                                title="Hapus Kategori"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
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
