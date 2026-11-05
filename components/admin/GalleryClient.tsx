"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, ArrowUpRight, GripVertical } from "lucide-react";
import { deleteGalleryPhoto, updateSortOrder } from "@/lib/actions/gallery";
import { useToast } from "@/components/admin/Toast";
import GalleryModal from "@/components/admin/GalleryModal";
import type { GalleryPhoto } from "@/lib/types";
import type { Event } from "@/lib/types";

interface Props {
  initialPhotos: GalleryPhoto[];
  events: Event[];
}

export default function GalleryClient({ initialPhotos, events }: Props) {
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GalleryPhoto | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Drag state
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (p: GalleryPhoto) => { setEditTarget(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTarget(null); };
  const handleSaved = () => window.location.reload();

  const handleDelete = async (id: string, publicId?: string | null) => {
    setDeletingId(id);
    const res = await deleteGalleryPhoto(id, publicId ?? undefined);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (res.success) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      showToast("Foto berhasil dihapus.");
    } else {
      showToast(res.error || "Gagal menghapus foto.", "error");
    }
  };

  const handleDragStart = (idx: number) => { dragItem.current = idx; };
  const handleDragEnter = (idx: number) => { dragOver.current = idx; };

  const handleDrop = async () => {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current === dragOver.current) return;

    const reordered = [...photos];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOver.current, 0, moved);

    // Assign new sort_orders
    const updated = reordered.map((p, i) => ({ ...p, sort_order: i }));
    setPhotos(updated);
    dragItem.current = null;
    dragOver.current = null;

    const res = await updateSortOrder(updated.map((p) => ({ id: p.id, sort_order: p.sort_order })));
    if (res.success) {
      showToast("Urutan foto berhasil disimpan.");
    } else {
      showToast(res.error || "Gagal menyimpan urutan.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink">Galeri</h1>
          <p className="mt-1 text-sm text-muted">Kelola dokumentasi foto dan urutan tampilan galeri.</p>
        </div>
        <button type="button" onClick={openCreate}
          className="flex h-11 items-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-bright focus-visible:ring-2 focus-visible:ring-primary">
          <Plus size={16} />
          Tambah Foto
          <span className="ml-1 grid size-6 place-items-center rounded-[4px] bg-accent text-ink">
            <ArrowUpRight size={13} />
          </span>
        </button>
      </div>

      <div className="rounded-[8px] border border-line bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-line pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            {photos.length} Foto · Drag untuk mengubah urutan
          </span>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="group relative rounded-[8px] border border-line bg-surface overflow-hidden cursor-grab active:cursor-grabbing"
              >
                {/* Drag handle */}
                <div className="absolute left-2 top-2 z-10 rounded-[4px] bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={14} className="text-muted" />
                </div>

                {/* Photo */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={photo.image_url}
                    alt={photo.caption || "Foto galeri"}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="truncate text-xs font-medium text-ink">{photo.caption || "Tanpa judul"}</p>
                  <p className="mt-0.5 text-[10px] text-muted">Urutan: {photo.sort_order}</p>
                </div>

                {/* Actions */}
                <div className="border-t border-line px-3 py-2 flex items-center gap-2">
                  {confirmDeleteId === photo.id ? (
                    <>
                      <span className="text-xs text-danger font-medium flex-1">Yakin hapus?</span>
                      <button type="button" disabled={deletingId === photo.id}
                        onClick={() => handleDelete(photo.id, photo.image_public_id)}
                        className="rounded-[4px] bg-danger px-2 py-0.5 text-xs font-semibold text-white hover:bg-danger/80 disabled:opacity-60">
                        {deletingId === photo.id ? "..." : "Ya"}
                      </button>
                      <button type="button" onClick={() => setConfirmDeleteId(null)}
                        className="rounded-[4px] border border-line px-2 py-0.5 text-xs text-ink hover:bg-surface">
                        Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => openEdit(photo)}
                        className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[4px] border border-line text-xs font-medium text-muted hover:border-primary hover:text-primary transition-colors">
                        <Pencil size={12} /> Edit
                      </button>
                      <button type="button" onClick={() => setConfirmDeleteId(photo.id)}
                        className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[4px] border border-line text-xs font-medium text-muted hover:border-danger hover:text-danger transition-colors">
                        <Trash2 size={12} /> Hapus
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-muted">
            Belum ada foto galeri. Klik &quot;Tambah Foto&quot; untuk mulai.
          </div>
        )}
      </div>

      {modalOpen && (
        <GalleryModal photo={editTarget} events={events} onClose={closeModal} onSaved={handleSaved} />
      )}
    </div>
  );
}
