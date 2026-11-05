"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { upsertForm } from "@/lib/actions/forms";
import { useToast } from "@/components/admin/Toast";
import type { RegistrationForm, Event } from "@/lib/types";

interface Props {
  form?: RegistrationForm | null;
  events: Event[];
  onClose: () => void;
  onSaved: () => void;
}

export default function FormModal({ form, events, onClose, onSaved }: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(form?.title ?? "");
  const [totalQuota, setTotalQuota] = useState(form?.total_quota ?? 0);
  const [eventId, setEventId] = useState(form?.event_id ?? "");
  const [isOpen, setIsOpen] = useState(form?.is_open ?? true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Judul formulir wajib diisi.", "error");
      return;
    }
    setLoading(true);

    try {
      const payload: Partial<RegistrationForm> = {
        ...(form?.id ? { id: form.id } : {}),
        title: title.trim(),
        total_quota: Number(totalQuota) || 0,
        event_id: eventId || null,
        is_open: isOpen,
      };

      const res = await upsertForm(payload);
      if (res.success) {
        showToast(
          form
            ? "Formulir berhasil diperbarui."
            : "Formulir baru berhasil dibuat."
        );
        onSaved();
        onClose();
      } else {
        showToast(res.error || "Gagal menyimpan formulir.", "error");
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
        className="w-full max-w-lg rounded-[12px] border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl uppercase text-ink">
            {form ? "Edit Formulir" : "Tambah Formulir Pendaftaran"}
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
              Judul Formulir <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Open Recruitment Batch 3 - Pesisir Bersih"
              className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Total Kuota Relawan
            </label>
            <input
              type="number"
              min={0}
              value={totalQuota}
              onChange={(e) => setTotalQuota(Number(e.target.value))}
              placeholder="Contoh: 50"
              className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-[11px] text-muted">
              Target kuota relawan yang ingin dicapai pada batch pendaftaran ini.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Kegiatan Terkait (Opsional)
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">— Tidak terhubung ke kegiatan spesifik —</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.status === "mendatang" ? "Mendatang" : "Selesai"})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
                className="size-4 rounded border-line text-primary focus:ring-primary accent-primary"
              />
              <div>
                <span className="text-sm font-semibold text-ink">
                  Buka Pendaftaran (Aktif)
                </span>
                <p className="text-xs text-muted">
                  Jika dicentang, formulir ini dapat diisi oleh pengunjung di halaman Join Us.
                </p>
              </div>
            </label>
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
              disabled={loading || !title.trim()}
              className="flex h-11 items-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-bright disabled:opacity-60 transition-colors"
            >
              {loading
                ? "Menyimpan..."
                : form
                ? "Simpan Perubahan"
                : "Buat Formulir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
