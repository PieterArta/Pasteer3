"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, ArrowUpRight } from "lucide-react";
import { deleteEvent } from "@/lib/actions/events";
import { useToast } from "@/components/admin/Toast";
import EventModal from "@/components/admin/EventModal";
import type { Event } from "@/lib/types";

interface Props {
  initialEvents: Event[];
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function EventsClient({ initialEvents }: Props) {
  const { showToast } = useToast();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Event | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (ev: Event) => { setEditTarget(ev); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTarget(null); };

  const handleSaved = () => {
    // Refresh server data by reloading
    window.location.reload();
  };

  const handleDelete = async (id: string, publicId?: string | null) => {
    setDeletingId(id);
    const res = await deleteEvent(id, publicId ?? undefined);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (res.success) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      showToast("Kegiatan berhasil dihapus.");
    } else {
      showToast(res.error || "Gagal menghapus kegiatan.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink">Kegiatan</h1>
          <p className="mt-1 text-sm text-muted">Kelola daftar acara dan kegiatan volunteer PASTEER3.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex h-11 items-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-bright focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus size={16} />
          Tambah Kegiatan
          <span className="ml-1 grid size-6 place-items-center rounded-[4px] bg-accent text-ink">
            <ArrowUpRight size={13} />
          </span>
        </button>
      </div>

      {/* Table card */}
      <div className="rounded-[8px] border border-line bg-white shadow-sm overflow-hidden">
        <div className="border-b border-line px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Total {events.length} Kegiatan
          </span>
        </div>

        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-surface text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 w-16">Foto</th>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-surface/40">
                    <td className="px-4 py-3">
                      <div className="relative size-12 overflow-hidden rounded-[4px] bg-surface">
                        {ev.image_url ? (
                          <Image src={ev.image_url} alt={ev.title} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="grid size-full place-items-center text-[10px] text-muted">—</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink">{ev.title}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(ev.date)}</td>
                    <td className="px-4 py-3 text-muted">{ev.location || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-[4px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          ev.status === "mendatang" ? "bg-accent text-ink" : "bg-surface text-muted"
                        }`}
                      >
                        {ev.status === "mendatang" ? "Mendatang" : "Selesai"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {confirmDeleteId === ev.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-danger font-medium">Yakin?</span>
                            <button
                              type="button"
                              disabled={deletingId === ev.id}
                              onClick={() => handleDelete(ev.id, ev.image_public_id)}
                              className="rounded-[4px] bg-danger px-2.5 py-1 text-xs font-semibold text-white hover:bg-danger/80 disabled:opacity-60"
                            >
                              {deletingId === ev.id ? "..." : "Ya"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-[4px] border border-line px-2.5 py-1 text-xs font-semibold text-ink hover:bg-surface"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => openEdit(ev)}
                              className="grid size-9 place-items-center rounded-[6px] border border-line text-muted hover:border-primary hover:text-primary transition-colors"
                              aria-label="Edit kegiatan"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(ev.id)}
                              className="grid size-9 place-items-center rounded-[6px] border border-line text-muted hover:border-danger hover:text-danger transition-colors"
                              aria-label="Hapus kegiatan"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-muted">
            Belum ada kegiatan. Klik &quot;Tambah Kegiatan&quot; untuk mulai.
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <EventModal event={editTarget} onClose={closeModal} onSaved={handleSaved} />
      )}
    </div>
  );
}
