"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { upsertEvent } from "@/lib/actions/events";
import { useToast } from "@/components/admin/Toast";
import type { Event } from "@/lib/types";

interface Props {
  event?: Event | null;
  onClose: () => void;
  onSaved: () => void;
}

const MAX_SIZE = 5 * 1024 * 1024;

export default function EventModal({ event, onClose, onSaved }: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(event?.title ?? "");
  const [date, setDate] = useState(event?.date ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [status, setStatus] = useState<"mendatang" | "selesai">(event?.status ?? "mendatang");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(event?.image_url ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (f.size > MAX_SIZE) {
      alert("Ukuran file maksimal 5 MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { showToast("Judul wajib diisi.", "error"); return; }
    setLoading(true);

    try {
      let imageUrl = event?.image_url ?? null;
      let imagePublicId = event?.image_public_id ?? null;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/admin/upload-event-image", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || uploadData.error) {
          showToast(uploadData.error || "Upload gambar gagal.", "error");
          setLoading(false);
          return;
        }
        imageUrl = uploadData.url;
        imagePublicId = uploadData.public_id;
      }

      const payload: Partial<Event> = {
        ...(event?.id ? { id: event.id } : {}),
        title: title.trim(),
        date: date || null,
        location: location.trim() || null,
        description: description.trim() || null,
        status,
        image_url: imageUrl,
        image_public_id: imagePublicId,
      };

      const res = await upsertEvent(payload);
      if (res.success) {
        showToast(event ? "Kegiatan berhasil diperbarui." : "Kegiatan berhasil ditambahkan.");
        onSaved();
        onClose();
      } else {
        showToast(res.error || "Gagal menyimpan kegiatan.", "error");
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Terjadi kesalahan.", "error");
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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl uppercase text-ink">
            {event ? "Edit Kegiatan" : "Tambah Kegiatan"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-[6px] text-muted hover:bg-surface hover:text-ink transition-colors"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh] px-6 py-5 space-y-4">
          {/* Judul */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Judul <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama kegiatan..."
              className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Tanggal + Lokasi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                Lokasi
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Kota / Venue"
                className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Deskripsi
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat kegiatan..."
              className="w-full resize-none rounded-[6px] border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "mendatang" | "selesai")}
              className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="mendatang">Mendatang</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          {/* Foto */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Foto (maks. 5 MB)
            </label>
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[6px] border-2 border-dashed border-line bg-surface p-4 transition-colors hover:border-primary"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <div className="relative h-32 w-full overflow-hidden rounded-[4px]">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <>
                  <Upload size={24} className="text-muted" />
                  <span className="text-xs text-muted">Klik untuk pilih gambar</span>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            {preview && (
              <button
                type="button"
                className="mt-1.5 text-xs text-muted hover:text-danger"
                onClick={() => { setFile(null); setPreview(""); }}
              >
                Hapus gambar
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center rounded-[6px] border border-line px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
          >
            Batal
          </button>
          <button
            type="submit"
            form=""
            disabled={loading || !title.trim()}
            onClick={handleSubmit}
            className="flex h-11 items-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-bright disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : event ? "Perbarui" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}
