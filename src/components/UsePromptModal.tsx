"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Terminal } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-semibold text-zinc-200">
              Prompt: {prompt.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Dynamic Variable Input Form */}
          {variables.length > 0 ? (
            <div className="space-y-3 bg-zinc-950 p-3.5 border border-zinc-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
                  Variabel ({variables.length})
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {variables.map((v) => (
                  <div key={v.key} className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                      <span>{v.label}</span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {`{{${v.key}}}`}
                      </span>
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
                      placeholder={`Nilai ${v.label.toLowerCase()}...`}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 font-mono">
              Prompt statis (tanpa variabel dinamis).
            </p>
          )}

          {/* Live Output Preview */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400 font-mono">
              Output Preview:
            </label>
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded font-mono text-xs text-zinc-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap selection:bg-zinc-800">
              {finalOutputText}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-950">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Batal
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded transition-colors ${
              isCopied
                ? "bg-emerald-500 text-zinc-950"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersalin ke Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Teks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
