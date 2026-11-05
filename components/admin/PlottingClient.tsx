"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUpRight,
  BarChart2,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { deletePlottingRow } from "@/lib/actions/plotting";
import { useToast } from "@/components/admin/Toast";
import PlottingModal from "@/components/admin/PlottingModal";
import type { Plotting, RegistrationForm } from "@/lib/types";

interface Props {
  forms: RegistrationForm[];
  initialPlotting: Plotting[];
  selectedFormId: string;
}

export default function PlottingClient({
  forms,
  initialPlotting,
  selectedFormId,
}: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [plottingRows, setPlottingRows] = useState<Plotting[]>(initialPlotting);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Plotting | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeForm = forms.find((f) => f.id === selectedFormId) || forms[0];

  const handleFormChange = (newFormId: string) => {
    router.push(`/admin/plotting?formId=${newFormId}`);
  };

  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (row: Plotting) => {
    setEditTarget(row);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSaved = () => {
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deletePlottingRow(id);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (res.success) {
      setPlottingRows((prev) => prev.filter((r) => r.id !== id));
      showToast("Data penanggung jawab berhasil dihapus.");
    } else {
      showToast(res.error || "Gagal menghapus penanggung jawab.", "error");
    }
  };

  const totalAccepted = plottingRows.reduce(
    (acc, row) => acc + (row.accepted_count || 0),
    0
  );
  const totalQuota = plottingRows.reduce(
    (acc, row) => acc + (row.quota || 0),
    0
  );
  const totalShortage = Math.max(0, totalQuota - totalAccepted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
            Plotting Volunteer
          </h1>
          <p className="mt-1 text-sm text-muted">
            Alokasi relawan per penanggung jawab dan pemantauan kekurangan kuota.
          </p>
        </div>

        {activeForm && (
          <button
            type="button"
            onClick={openCreate}
            className="flex h-11 items-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-bright focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus size={16} />
            Tambah Penanggung Jawab
            <span className="ml-1 grid size-6 place-items-center rounded-[4px] bg-accent text-ink">
              <ArrowUpRight size={13} />
            </span>
          </button>
        )}
      </div>

      {/* Form selector filter */}
      {forms.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[8px] border border-line bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">
            Pilih Formulir:
          </label>
          <select
            value={selectedFormId}
            onChange={(e) => handleFormChange(e.target.value)}
            className="h-10 min-w-[260px] rounded-[6px] border border-line bg-surface px-3 text-sm font-medium text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {forms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title} ({f.is_open ? "Buka" : "Tutup"})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="rounded-[8px] border border-line bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-muted">
            Belum ada formulir pendaftaran. Buat formulir terlebih dahulu di menu{" "}
            <a
              href="/admin/form-pendaftaran"
              className="font-semibold text-primary underline"
            >
              Form Pendaftaran
            </a>
            .
          </p>
        </div>
      )}

      {/* Stat Cards */}
      {activeForm && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-[8px] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Total Diterima
              </span>
              <div className="rounded-md bg-accent/25 p-2 text-ink">
                <Users size={18} />
              </div>
            </div>
            <p className="mt-4 font-display text-4xl text-ink">
              {totalAccepted}
            </p>
          </div>

          <div className="rounded-[8px] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Total Dibutuhkan
              </span>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <BarChart2 size={18} />
              </div>
            </div>
            <p className="mt-4 font-display text-4xl text-ink">
              {totalQuota}
            </p>
          </div>

          <div className="rounded-[8px] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Kekurangan Kuota
              </span>
              <div
                className={`rounded-md p-2 ${
                  totalShortage > 0
                    ? "bg-danger/10 text-danger"
                    : "bg-success/15 text-success"
                }`}
              >
                {totalShortage > 0 ? (
                  <AlertCircle size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
              </div>
            </div>
            <p
              className={`mt-4 font-display text-4xl ${
                totalShortage > 0 ? "text-danger" : "text-success"
              }`}
            >
              {totalShortage}
            </p>
          </div>

          <div className="rounded-[8px] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Target Kuota Form
              </span>
              <div className="rounded-md bg-surface p-2 text-muted">
                <Users size={18} />
              </div>
            </div>
            <p className="mt-4 font-display text-4xl text-ink">
              {activeForm.total_quota}
            </p>
          </div>
        </div>
      )}

      {/* Plotting Table Card */}
      {activeForm && (
        <div className="rounded-[8px] border border-line bg-white shadow-sm overflow-hidden">
          <div className="border-b border-line px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {activeForm.title} · {plottingRows.length} Penanggung Jawab
            </span>
          </div>

          {plottingRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-line bg-surface text-xs font-semibold uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-3.5">Penanggung Jawab / Divisi</th>
                    <th className="px-4 py-3.5 text-center">Diterima</th>
                    <th className="px-4 py-3.5 text-center">Dibutuhkan</th>
                    <th className="px-4 py-3.5 text-center">Kekurangan</th>
                    <th className="px-5 py-3.5 w-44">Progress</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {plottingRows.map((row) => {
                    const accepted = row.accepted_count || 0;
                    const shortage = Math.max(0, row.quota - accepted);
                    const percent = Math.min(
                      100,
                      row.quota > 0 ? Math.round((accepted / row.quota) * 100) : 0
                    );

                    return (
                      <tr key={row.id} className="hover:bg-surface/30">
                        <td className="px-5 py-4 font-semibold text-ink">
                          {row.person_name}
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-ink">
                          {accepted}
                        </td>
                        <td className="px-4 py-4 text-center text-muted">
                          {row.quota}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-block rounded-[4px] px-2.5 py-1 text-xs font-bold ${
                              shortage > 0
                                ? "bg-danger/10 text-danger"
                                : "bg-success/15 text-success"
                            }`}
                          >
                            {shortage === 0 ? "Terpenuhi" : `Kurang ${shortage}`}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  percent >= 100 ? "bg-success" : "bg-primary"
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-muted">
                              {percent}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {confirmDeleteId === row.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-danger">
                                  Yakin?
                                </span>
                                <button
                                  type="button"
                                  disabled={deletingId === row.id}
                                  onClick={() => handleDelete(row.id)}
                                  className="rounded-[4px] bg-danger px-2.5 py-1 text-xs font-semibold text-white hover:bg-danger/80 disabled:opacity-60"
                                >
                                  {deletingId === row.id ? "..." : "Ya"}
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
                                  onClick={() => openEdit(row)}
                                  className="grid size-9 place-items-center rounded-[6px] border border-line text-muted hover:border-primary hover:text-primary transition-colors"
                                  aria-label="Edit penanggung jawab"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(row.id)}
                                  className="grid size-9 place-items-center rounded-[6px] border border-line text-muted hover:border-danger hover:text-danger transition-colors"
                                  aria-label="Hapus penanggung jawab"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t-2 border-line bg-surface/70 font-bold text-ink">
                  <tr>
                    <td className="px-5 py-3.5 uppercase text-xs">
                      Total Keseluruhan
                    </td>
                    <td className="px-4 py-3.5 text-center font-display text-base">
                      {totalAccepted}
                    </td>
                    <td className="px-4 py-3.5 text-center font-display text-base text-muted">
                      {totalQuota}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-block rounded-[4px] px-2.5 py-1 text-xs ${
                          totalShortage > 0
                            ? "bg-danger/10 text-danger"
                            : "bg-success/15 text-success"
                        }`}
                      >
                        {totalShortage === 0
                          ? "Semua Terpenuhi"
                          : `Kurang ${totalShortage}`}
                      </span>
                    </td>
                    <td colSpan={2} className="px-5 py-3.5 text-right text-xs text-muted">
                      {activeForm.total_quota > 0 && (
                        <span>
                          Target Form: {activeForm.total_quota} orang
                        </span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-muted">
              Belum ada penanggung jawab untuk formulir ini. Klik &quot;Tambah
              Penanggung Jawab&quot; untuk mengalokasikan kuota relawan.
            </div>
          )}
        </div>
      )}

      {modalOpen && activeForm && (
        <PlottingModal
          formId={activeForm.id}
          plotting={editTarget}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
