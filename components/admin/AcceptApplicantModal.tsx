"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { acceptApplicant } from "@/lib/actions/applicants";
import { useToast } from "@/components/admin/Toast";
import type { Applicant, Plotting } from "@/lib/types";

interface Props {
  applicant: Applicant;
  availablePlotting: Plotting[];
  onClose: () => void;
  onSaved: () => void;
}

export default function AcceptApplicantModal({
  applicant,
  availablePlotting,
  onClose,
  onSaved,
}: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [plottingId, setPlottingId] = useState<string>(
    applicant.plotting_id || availablePlotting[0]?.id || ""
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plottingId) {
      showToast("Pilih penanggung jawab / divisi plotting.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await acceptApplicant(applicant.id, plottingId);
      if (res.success) {
        showToast(`Relawan ${applicant.full_name} berhasil diterima.`);
        onSaved();
        onClose();
      } else {
        showToast(res.error || "Gagal menerima relawan.", "error");
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
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[12px] border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl uppercase text-ink">
            Terima Calon Relawan
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
            <p className="text-sm text-ink font-semibold">
              {applicant.full_name}
            </p>
            <p className="text-xs text-muted">
              {applicant.email} · {applicant.whatsapp}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Alokasikan ke Penanggung Jawab / Divisi <span className="text-danger">*</span>
            </label>
            {availablePlotting.length > 0 ? (
              <select
                required
                value={plottingId}
                onChange={(e) => setPlottingId(e.target.value)}
                className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {availablePlotting.map((pj) => (
                  <option key={pj.id} value={pj.id}>
                    {pj.person_name} (Kuota: {pj.quota})
                  </option>
                ))}
              </select>
            ) : (
              <div className="rounded-[6px] border border-line bg-surface p-3 text-xs text-muted">
                Belum ada penanggung jawab untuk formulir ini. Silakan buat
                data plotting di menu Plotting terlebih dahulu.
              </div>
            )}
            <p className="mt-1 text-[11px] text-muted">
              Relawan akan dimasukkan ke dalam daftar plotting penanggung jawab
              tersebut.
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
              disabled={loading || !plottingId}
              className="flex h-11 items-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-bright disabled:opacity-60 transition-colors"
            >
              <Check size={16} />
              {loading ? "Memproses..." : "Konfirmasi Terima"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
