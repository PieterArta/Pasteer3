"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { upsertGalleryPhoto } from "@/lib/actions/gallery";
import { useToast } from "@/components/admin/Toast";
import type { GalleryPhoto } from "@/lib/types";
import type { Event } from "@/lib/types";

interface Props {
  photo?: GalleryPhoto | null;
  events: Event[];
  onClose: () => void;
  onSaved: () => void;
}

const MAX_SIZE = 5 * 1024 * 1024;

export default function GalleryModal({ photo, events, onClose, onSaved }: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState(photo?.caption ?? "");
  const [eventId, setEventId] = useState(photo?.event_id ?? "");
  const [sortOrder, setSortOrder] = useState(photo?.sort_order ?? 0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(photo?.image_url ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (f.size > MAX_SIZE) { alert("Ukuran file maksimal 5 MB."); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo && !file) { showToast("Foto wajib dipilih.", "error"); return; }
    setLoading(true);

    try {
      let imageUrl = photo?.image_url ?? "";
      let imagePublicId = photo?.image_public_id ?? null;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/admin/upload-gallery-image", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || uploadData.error) {
          showToast(uploadData.error || "Upload gambar gagal.", "error");
          setLoading(false);
          return;
        }
        imageUrl = uploadData.url;
        imagePublicId = uploadData.public_id;
      }

      const payload: Partial<GalleryPhoto> = {
        ...(photo?.id ? { id: photo.id } : {}),
        caption: caption.trim() || null,
        image_url: imageUrl,
        image_public_id: imagePublicId,
        event_id: eventId || null,
        sort_order: sortOrder,
      };

      const res = await upsertGalleryPhoto(payload);
      if (res.success) {
        showToast(photo ? "Foto berhasil diperbarui." : "Foto berhasil ditambahkan.");
        onSaved();
        onClose();
      } else {
        showToast(res.error || "Gagal menyimpan foto.", "error");
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
        className="w-full max-w-md rounded-[12px] border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl uppercase text-ink">
            {photo ? "Edit Foto" : "Tambah Foto"}
          </h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-[6px] text-muted hover:bg-surface hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[65vh] px-6 py-5 space-y-4">
          {/* Foto */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Foto {!photo && <span className="text-danger">*</span>}
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
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
          </div>

          {/* Caption */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Caption</label>
            <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)}
              placeholder="Deskripsi singkat foto..."
              className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          {/* Event */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Event Terkait</label>
            <select value={eventId} onChange={(e) => setEventId(e.target.value)}
              className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option value="">— Tidak terkait —</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Urutan Tampil</label>
            <input type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))}
              className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </form>

        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button type="button" onClick={onClose}
            className="flex h-11 items-center rounded-[6px] border border-line px-5 text-sm font-semibold text-ink hover:bg-surface">
            Batal
          </button>
          <button type="button" disabled={loading || (!photo && !file)} onClick={handleSubmit}
            className="flex h-11 items-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-bright disabled:opacity-60">
            {loading ? "Menyimpan..." : photo ? "Perbarui" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}
