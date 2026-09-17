"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Bookmark } from "lucide-react";
import { PromptItem } from "@/types/prompt";
import { extractVariables, replaceVariables } from "@/lib/variableParser";

interface UsePromptModalProps {
  prompt: PromptItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UsePromptModal: React.FC<UsePromptModalProps> = ({
  prompt,
  isOpen,
  onClose,
}) => {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isCopied, setIsCopied] = useState(false);

  const variables = prompt ? extractVariables(prompt.content) : [];

  useEffect(() => {
    if (prompt) {
      const initialValues: Record<string, string> = {};
      variables.forEach((v) => {
        initialValues[v.key] = "";
      });
      setVariableValues(initialValues);
      setIsCopied(false);
    }
  }, [prompt]);

  if (!isOpen || !prompt) return null;

  const finalOutputText = replaceVariables(prompt.content, variableValues);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalOutputText);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    } catch (err) {
      console.error("Gagal menyalin teks:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-zinc-100">
              Gunakan Prompt: {prompt.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Dynamic Variable Input Form */}
          {variables.length > 0 ? (
            <div className="space-y-3 bg-zinc-950/60 p-4 border border-zinc-800 rounded-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Isi {variables.length} Form Variabel
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {variables.map((v) => (
                  <div key={v.key} className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                      <span>{v.label}</span>
                    </label>
                    <input
                      type="text"
                      value={variableValues[v.key] || ""}
                      onChange={(e) =>
                        setVariableValues({
                          ...variableValues,
                          [v.key]: e.target.value,
                        })
                      }
                      placeholder={`Isi ${v.label.toLowerCase()}...`}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-400 italic">
              Prompt ini siap langsung disalin tanpa perlu pengisian form.
            </p>
          )}

          {/* Live Output Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">
              Preview Prompt Siap Copy:
            </label>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-sans text-xs text-zinc-200 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap selection:bg-emerald-500/30">
              {finalOutputText}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Tutup
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95 ${
              isCopied
                ? "bg-emerald-500 text-zinc-950 shadow-emerald-500/30"
                : "bg-emerald-400 hover:bg-emerald-300 text-zinc-950 shadow-emerald-500/20"
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Teks Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
