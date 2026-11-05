"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUpRight,
  Users,
  BarChart2,
  Calendar,
} from "lucide-react";
import { deleteForm, toggleFormStatus } from "@/lib/actions/forms";
import { useToast } from "@/components/admin/Toast";
import FormModal from "@/components/admin/FormModal";
import type { RegistrationForm, Event } from "@/lib/types";

interface Props {
  initialForms: RegistrationForm[];
  events: Event[];
}

export default function FormsClient({ initialForms, events }: Props) {
  const { showToast } = useToast();
  const [forms, setForms] = useState<RegistrationForm[]>(initialForms);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RegistrationForm | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const eventMap = new Map<string, string>();
  events.forEach((ev) => eventMap.set(ev.id, ev.title));

  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (f: RegistrationForm) => {
    setEditTarget(f);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSaved = () => {
    window.location.reload();
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setTogglingId(id);
    // Optimistic update
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, is_open: nextStatus } : f))
    );

    const res = await toggleFormStatus(id, nextStatus);
    setTogglingId(null);
    if (res.success) {
      showToast(
        nextStatus
          ? "Formulir dibuka untuk pendaftaran."
          : "Formulir ditutup."
      );
    } else {
      // Revert optimistic update
      setForms((prev) =>
        prev.map((f) => (f.id === id ? { ...f, is_open: currentStatus } : f))
      );
      showToast(res.error || "Gagal mengubah status formulir.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteForm(id);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (res.success) {
      setForms((prev) => prev.filter((f) => f.id !== id));
      showToast("Formulir berhasil dihapus.");
    } else {
      showToast(res.error || "Gagal menghapus formulir.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
            Form Pendaftaran
          </h1>
          <p className="mt-1 text-sm text-muted">
            Kelola formulir open recruitment dan kuota pendaftaran volunteer.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex h-11 items-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-bright focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus size={16} />
          Tambah Form
          <span className="ml-1 grid size-6 place-items-center rounded-[4px] bg-accent text-ink">
            <ArrowUpRight size={13} />
          </span>
        </button>
      </div>

      {/* Cards list */}
      <div className="rounded-[8px] border border-line bg-white shadow-sm overflow-hidden">
        <div className="border-b border-line px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Total {forms.length} Formulir Pendaftaran
          </span>
        </div>

        {forms.length > 0 ? (
          <div className="divide-y divide-line">
            {forms.map((form) => {
              const linkedEventTitle = form.event_id
                ? eventMap.get(form.event_id)
                : null;

              return (
                <div
                  key={form.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-surface/30 transition-colors"
                >
                  {/* Left: Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {form.title}
                      </h3>
                      <button
                        type="button"
                        disabled={togglingId === form.id}
                        onClick={() => handleToggle(form.id, form.is_open)}
                        className={`rounded-[4px] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          form.is_open
                            ? "bg-accent text-ink hover:opacity-85"
                            : "bg-surface text-muted hover:text-ink"
                        }`}
                        title="Klik untuk membuka / menutup formulir"
                      >
                        {form.is_open ? "● Buka" : "○ Tutup"}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span>
                        Target Kuota:{" "}
                        <strong className="text-ink">
                          {form.total_quota} Orang
                        </strong>
                      </span>

                      {linkedEventTitle && (
                        <span className="flex items-center gap-1 text-primary">
                          <Calendar size={13} />
                          {linkedEventTitle}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    {/* Link to Plotting */}
                    <Link
                      href={`/admin/plotting?formId=${form.id}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-[6px] border border-line bg-surface px-3 text-xs font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
                    >
                      <BarChart2 size={13} />
                      Plotting
                    </Link>

                    {/* Link to Pendaftar */}
                    <Link
                      href={`/admin/pendaftar?formId=${form.id}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-[6px] border border-line bg-surface px-3 text-xs font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
                    >
                      <Users size={13} />
                      Pendaftar
                    </Link>

                    {confirmDeleteId === form.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-danger">
                          Yakin hapus?
                        </span>
                        <button
                          type="button"
                          disabled={deletingId === form.id}
                          onClick={() => handleDelete(form.id)}
                          className="rounded-[4px] bg-danger px-2.5 py-1 text-xs font-semibold text-white hover:bg-danger/80 disabled:opacity-60"
                        >
                          {deletingId === form.id ? "..." : "Ya"}
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
                          onClick={() => openEdit(form)}
                          className="grid size-9 place-items-center rounded-[6px] border border-line text-muted hover:border-primary hover:text-primary transition-colors"
                          aria-label="Edit formulir"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(form.id)}
                          className="grid size-9 place-items-center rounded-[6px] border border-line text-muted hover:border-danger hover:text-danger transition-colors"
                          aria-label="Hapus formulir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-muted">
            Belum ada formulir pendaftaran. Klik &quot;Tambah Form&quot; untuk
            membuat form penerimaan volunteer baru.
          </div>
        )}
      </div>

      {modalOpen && (
        <FormModal
          form={editTarget}
          events={events}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
