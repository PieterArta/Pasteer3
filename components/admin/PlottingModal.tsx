"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { upsertPlottingRow } from "@/lib/actions/plotting";
import { useToast } from "@/components/admin/Toast";
import type { Plotting } from "@/lib/types";

interface Props {
  formId: string;
  plotting?: Plotting | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function PlottingModal({
  formId,
  plotting,
  onClose,
  onSaved,
}: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [personName, setPersonName] = useState(plotting?.person_name ?? "");
  const [quota, setQuota] = useState(plotting?.quota ?? 1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) {
      showToast("Nama penanggung jawab wajib diisi.", "error");
      return;
    }
    if (quota < 1) {
      showToast("Kuota minimal 1 orang.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await upsertPlottingRow(formId, {
        ...(plotting?.id ? { id: plotting.id } : {}),
        person_name: personName.trim(),
        quota: Number(quota),
      });

      if (res.success) {
        showToast(
          plotting
            ? "Data plotting berhasil diperbarui."
            : "Penanggung jawab baru berhasil ditambahkan."
        );
        onSaved();
        onClose();
      } else {
        showToast(res.error || "Gagal menyimpan plotting.", "error");
      }
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Terjadi kesalahan.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[12px] border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl uppercase text-ink">
            {plotting ? "Edit Penanggung Jawab" : "Tambah Penanggung Jawab"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-[6px] text-muted hover:bg-surface hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Nama / Divisi Penanggung Jawab <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Contoh: PJ Perlengkapan / Kak Made"
              className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Kuota Relawan Dibutuhkan <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              min={1}
              required
              value={quota}
              onChange={(e) => setQuota(Number(e.target.value))}
              placeholder="Contoh: 10"
              className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-[11px] text-muted">
              Jumlah relawan yang ditugaskan ke bawah tanggung jawab ini.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 items-center rounded-[6px] border border-line px-5 text-sm font-semibold text-ink hover:bg-surface transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !personName.trim()}
              className="flex h-11 items-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-bright disabled:opacity-60 transition-colors"
            >
              {loading
                ? "Menyimpan..."
                : plotting
                ? "Simpan Perubahan"
                : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
