"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Phone,
  FileText,
  Eye,
  Check,
  X,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  rejectApplicant,
  resetApplicantStatus,
  deleteApplicant,
} from "@/lib/actions/applicants";
import { useToast } from "@/components/admin/Toast";
import ApplicantDetailModal from "@/components/admin/ApplicantDetailModal";
import AcceptApplicantModal from "@/components/admin/AcceptApplicantModal";
import type { Applicant, RegistrationForm, Plotting } from "@/lib/types";

interface Props {
  initialApplicants: Applicant[];
  forms: RegistrationForm[];
  plottings: Plotting[];
  initialFormId?: string;
}

export default function ApplicantsClient({
  initialApplicants,
  forms,
  plottings,
  initialFormId,
}: Props) {
  const { showToast } = useToast();
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [selectedFormId, setSelectedFormId] = useState<string>(
    initialFormId || "all"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [detailTarget, setDetailTarget] = useState<Applicant | null>(null);
  const [acceptTarget, setAcceptTarget] = useState<Applicant | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Maps for fast lookups
  const formMap = useMemo(() => {
    const map = new Map<string, string>();
    forms.forEach((f) => map.set(f.id, f.title));
    return map;
  }, [forms]);

  const plottingMap = useMemo(() => {
    const map = new Map<string, string>();
    plottings.forEach((p) => map.set(p.id, p.person_name));
    return map;
  }, [plottings]);

  // Status counts for badge tabs
  const counts = useMemo(() => {
    const scoped =
      selectedFormId === "all"
        ? applicants
        : applicants.filter((a) => a.form_id === selectedFormId);

    return {
      all: scoped.length,
      menunggu: scoped.filter((a) => a.status === "menunggu").length,
      diterima: scoped.filter((a) => a.status === "diterima").length,
      ditolak: scoped.filter((a) => a.status === "ditolak").length,
    };
  }, [applicants, selectedFormId]);

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      // Form filter
      if (selectedFormId !== "all" && a.form_id !== selectedFormId) {
        return false;
      }
      // Status filter
      if (statusFilter !== "all" && a.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = a.full_name.toLowerCase().includes(q);
        const matchesEmail = a.email.toLowerCase().includes(q);
        const matchesPhone = a.whatsapp.toLowerCase().includes(q);
        const matchesDom = a.domicile?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesDom) {
          return false;
        }
      }
      return true;
    });
  }, [applicants, selectedFormId, statusFilter, searchQuery]);

  const handleSaved = () => {
    window.location.reload();
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    const res = await rejectApplicant(id);
    setProcessingId(null);
    setConfirmRejectId(null);
    if (res.success) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "ditolak", plotting_id: null } : a))
      );
      if (detailTarget?.id === id) {
        setDetailTarget((prev) =>
          prev ? { ...prev, status: "ditolak", plotting_id: null } : null
        );
      }
      showToast("Pendaftar ditolak.");
    } else {
      showToast(res.error || "Gagal menolak pendaftar.", "error");
    }
  };

  const handleReset = async (id: string) => {
    setProcessingId(id);
    const res = await resetApplicantStatus(id);
    setProcessingId(null);
    if (res.success) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "menunggu", plotting_id: null } : a))
      );
      if (detailTarget?.id === id) {
        setDetailTarget((prev) =>
          prev ? { ...prev, status: "menunggu", plotting_id: null } : null
        );
      }
      showToast("Status pendaftar dikembalikan ke Menunggu.");
    } else {
      showToast(res.error || "Gagal mengubah status.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    setProcessingId(id);
    const res = await deleteApplicant(id);
    setProcessingId(null);
    setConfirmDeleteId(null);
    if (res.success) {
      setApplicants((prev) => prev.filter((a) => a.id !== id));
      if (detailTarget?.id === id) setDetailTarget(null);
      showToast("Pendaftar berhasil dihapus.");
    } else {
      showToast(res.error || "Gagal menghapus data.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
          Pendaftar Volunteer
        </h1>
        <p className="mt-1 text-sm text-muted">
          Kelola calon relawan yang telah mendaftar, review CV, dan alokasikan ke penanggung jawab.
        </p>
      </div>

      {/* Filter controls */}
      <div className="rounded-[8px] border border-line bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Form dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Formulir:
            </label>
            <select
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              className="h-10 min-w-[200px] rounded-[6px] border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Semua Formulir ({applicants.length})</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, whatsapp..."
              className="h-10 w-full rounded-[6px] border border-line bg-surface pl-9 pr-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
          {[
            { key: "all", label: "Semua", count: counts.all },
            { key: "menunggu", label: "Menunggu", count: counts.menunggu },
            { key: "diterima", label: "Diterima", count: counts.diterima },
            { key: "ditolak", label: "Ditolak", count: counts.ditolak },
          ].map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-2 rounded-[6px] px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "border border-line bg-surface text-muted hover:border-primary hover:text-ink"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-[4px] px-1.5 py-0.2 text-[10px] font-bold ${
                    active ? "bg-accent text-ink" : "bg-line text-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-[8px] border border-line bg-white shadow-sm overflow-hidden">
        <div className="border-b border-line px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Menampilkan {filteredApplicants.length} dari {applicants.length} Pendaftar
          </span>
        </div>

        {filteredApplicants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-line bg-surface text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">Nama & Detail</th>
                  <th className="px-4 py-3.5">Kontak</th>
                  <th className="px-4 py-3.5">CV</th>
                  <th className="px-4 py-3.5">Plotting PJ</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredApplicants.map((a) => {
                  const plottingName = a.plotting_id
                    ? plottingMap.get(a.plotting_id)
                    : null;
                  const cleanPhone = a.whatsapp.replace(/\D/g, "");

                  return (
                    <tr key={a.id} className="hover:bg-surface/30">
                      {/* Name & metadata */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-ink">
                          {a.full_name}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                          {a.domicile && <span>{a.domicile}</span>}
                          {a.jersey_size && (
                            <span className="rounded-[3px] bg-surface border border-line px-1.5 py-0.2 text-[10px] font-medium text-ink">
                              Jersey: {a.jersey_size}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4 text-xs text-muted">
                        <div className="flex items-center gap-1.5 font-medium text-ink">
                          <Phone size={12} className="text-primary" />
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary hover:underline"
                          >
                            {a.whatsapp}
                          </a>
                        </div>
                        <div className="mt-0.5 truncate max-w-[160px]">
                          {a.email}
                        </div>
                        {a.instagram && (
                          <div className="text-[11px] text-muted">
                            @{a.instagram.replace(/^@/, "")}
                          </div>
                        )}
                      </td>

                      {/* CV */}
                      <td className="px-4 py-4 text-xs">
                        {a.cv_path ? (
                          <Link
                            href={`/api/admin/cv-url?path=${encodeURIComponent(a.cv_path)}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-[4px] border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-primary hover:border-primary transition-colors"
                          >
                            <FileText size={12} />
                            Lihat CV
                          </Link>
                        ) : a.cv_url ? (
                          <a
                            href={a.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-[4px] border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-primary hover:border-primary transition-colors"
                          >
                            <FileText size={12} />
                            Lihat CV
                          </a>
                        ) : (
                          <span className="text-muted text-xs">—</span>
                        )}
                      </td>

                      {/* Plotting */}
                      <td className="px-4 py-4 text-xs">
                        {plottingName ? (
                          <span className="font-semibold text-primary">
                            {plottingName}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block rounded-[4px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            a.status === "diterima"
                              ? "bg-accent text-ink"
                              : a.status === "ditolak"
                              ? "bg-danger/10 text-danger"
                              : "bg-surface text-muted"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Detail button */}
                          <button
                            type="button"
                            onClick={() => setDetailTarget(a)}
                            className="grid size-8 place-items-center rounded-[6px] border border-line text-muted hover:border-primary hover:text-primary transition-colors"
                            title="Lihat Detail Pendaftar"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Accept button */}
                          {a.status !== "diterima" && (
                            <button
                              type="button"
                              onClick={() => setAcceptTarget(a)}
                              className="grid size-8 place-items-center rounded-[6px] border border-line bg-surface text-primary hover:border-primary hover:bg-primary hover:text-white transition-colors"
                              title="Terima & Plotting"
                            >
                              <Check size={13} />
                            </button>
                          )}

                          {/* Reject button */}
                          {confirmRejectId === a.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={processingId === a.id}
                                onClick={() => handleReject(a.id)}
                                className="rounded-[4px] bg-danger px-2 py-0.5 text-xs font-semibold text-white hover:bg-danger/80 disabled:opacity-60"
                              >
                                Ya
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmRejectId(null)}
                                className="rounded-[4px] border border-line px-1.5 py-0.5 text-xs text-ink hover:bg-surface"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            a.status !== "ditolak" && (
                              <button
                                type="button"
                                onClick={() => setConfirmRejectId(a.id)}
                                className="grid size-8 place-items-center rounded-[6px] border border-line text-muted hover:border-danger hover:text-danger transition-colors"
                                title="Tolak Pendaftar"
                              >
                                <X size={13} />
                              </button>
                            )
                          )}

                          {/* Reset to Menunggu if accepted or rejected */}
                          {a.status !== "menunggu" && (
                            <button
                              type="button"
                              disabled={processingId === a.id}
                              onClick={() => handleReset(a.id)}
                              className="grid size-8 place-items-center rounded-[6px] border border-line text-muted hover:border-primary hover:text-primary transition-colors"
                              title="Reset ke Menunggu"
                            >
                              <RotateCcw size={12} />
                            </button>
                          )}

                          {/* Delete */}
                          {confirmDeleteId === a.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={processingId === a.id}
                                onClick={() => handleDelete(a.id)}
                                className="rounded-[4px] bg-danger px-2 py-0.5 text-xs font-semibold text-white hover:bg-danger/80 disabled:opacity-60"
                              >
                                Hapus
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="rounded-[4px] border border-line px-1.5 py-0.5 text-xs text-ink hover:bg-surface"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(a.id)}
                              className="grid size-8 place-items-center rounded-[6px] border border-line text-muted hover:border-danger hover:text-danger transition-colors"
                              title="Hapus Data Pendaftar"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-muted">
            Tidak ada pendaftar yang cocok dengan filter.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailTarget && (
        <ApplicantDetailModal
          applicant={detailTarget}
          plottingName={
            detailTarget.plotting_id
              ? plottingMap.get(detailTarget.plotting_id)
              : null
          }
          formTitle={
            detailTarget.form_id ? formMap.get(detailTarget.form_id) : null
          }
          onClose={() => setDetailTarget(null)}
          onAccept={() => {
            const target = detailTarget;
            setDetailTarget(null);
            setAcceptTarget(target);
          }}
          onReject={() => handleReject(detailTarget.id)}
          onReset={() => handleReset(detailTarget.id)}
        />
      )}

      {/* Accept / Plotting Modal */}
      {acceptTarget && (
        <AcceptApplicantModal
          applicant={acceptTarget}
          availablePlotting={
            acceptTarget.form_id
              ? plottings.filter((p) => p.form_id === acceptTarget.form_id)
              : plottings
          }
          onClose={() => setAcceptTarget(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
