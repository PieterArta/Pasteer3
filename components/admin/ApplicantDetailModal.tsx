"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Shirt,
  FileText,
  Check,
  RotateCcw,
} from "lucide-react";
import type { Applicant } from "@/lib/types";

function InstagramIcon({ size = 15, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface Props {
  applicant: Applicant;
  plottingName?: string | null;
  formTitle?: string | null;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  onReset: () => void;
}

export default function ApplicantDetailModal({
  applicant,
  plottingName,
  formTitle,
  onClose,
  onAccept,
  onReject,
  onReset,
}: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const cleanPhone = applicant.whatsapp.replace(/\D/g, "");
  const formattedDate = applicant.created_at
    ? new Date(applicant.created_at).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[12px] border border-line bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <span
              className={`inline-block rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1 ${
                applicant.status === "diterima"
                  ? "bg-accent text-ink"
                  : applicant.status === "ditolak"
                  ? "bg-danger/10 text-danger"
                  : "bg-surface text-muted"
              }`}
            >
              Status: {applicant.status}
            </span>
            <h2 className="font-display text-2xl uppercase text-ink">
              {applicant.full_name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-[6px] text-muted hover:bg-surface hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Metadata banner */}
          <div className="rounded-[8px] border border-line bg-surface p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted">Form Pendaftaran:</span>
              <span className="font-semibold text-ink">
                {formTitle || "Umum"}
              </span>
            </div>
            {applicant.status === "diterima" && plottingName && (
              <div className="flex items-center justify-between">
                <span className="text-muted">Penanggung Jawab:</span>
                <span className="font-semibold text-primary">{plottingName}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted">Waktu Mendaftar:</span>
              <span className="text-ink">{formattedDate}</span>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Informasi Kontak & Domisili
            </h4>
            <div className="grid gap-2.5 sm:grid-cols-2 text-xs">
              <div className="flex items-center gap-2 rounded-[6px] border border-line p-3">
                <Phone size={15} className="text-primary" />
                <div>
                  <p className="text-[10px] text-muted">WhatsApp</p>
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink hover:text-primary hover:underline"
                  >
                    {applicant.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-[6px] border border-line p-3">
                <Mail size={15} className="text-primary" />
                <div className="truncate">
                  <p className="text-[10px] text-muted">Email</p>
                  <a
                    href={`mailto:${applicant.email}`}
                    className="font-medium text-ink hover:text-primary hover:underline truncate block"
                  >
                    {applicant.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-[6px] border border-line p-3">
                <InstagramIcon size={15} className="text-primary" />
                <div>
                  <p className="text-[10px] text-muted">Instagram</p>
                  <p className="font-medium text-ink">
                    {applicant.instagram ? `@${applicant.instagram.replace(/^@/, "")}` : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-[6px] border border-line p-3">
                <MapPin size={15} className="text-primary" />
                <div>
                  <p className="text-[10px] text-muted">Domisili</p>
                  <p className="font-medium text-ink">
                    {applicant.domicile || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-[6px] border border-line p-3">
                <Shirt size={15} className="text-primary" />
                <div>
                  <p className="text-[10px] text-muted">Ukuran Jersey</p>
                  <p className="font-medium text-ink">
                    {applicant.jersey_size || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-[6px] border border-line p-3">
                <FileText size={15} className="text-primary" />
                <div>
                  <p className="text-[10px] text-muted">Curriculum Vitae</p>
                  {applicant.cv_path ? (
                    <Link
                      href={`/api/admin/cv-url?path=${encodeURIComponent(applicant.cv_path)}`}
                      target="_blank"
                      className="font-semibold text-primary hover:underline"
                    >
                      Buka Dokumen CV ↗
                    </Link>
                  ) : applicant.cv_url ? (
                    <a
                      href={applicant.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      Buka Dokumen CV ↗
                    </a>
                  ) : (
                    <p className="text-muted">Tidak melampirkan CV</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reason / Alasan */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Alasan Ingin Bergabung
            </h4>
            <div className="rounded-[6px] border border-line bg-surface p-3.5 text-xs text-ink leading-relaxed whitespace-pre-wrap">
              {applicant.reason || "Tidak ada keterangan alasan."}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4 bg-surface/40">
          <div>
            {applicant.status !== "menunggu" && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-line bg-white px-3 py-2 text-xs font-semibold text-ink hover:bg-surface transition-colors"
              >
                <RotateCcw size={13} />
                Kembalikan ke Menunggu
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {applicant.status !== "ditolak" && (
              <button
                type="button"
                onClick={onReject}
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-danger/40 bg-white px-3.5 py-2 text-xs font-semibold text-danger hover:bg-danger/10 transition-colors"
              >
                <X size={14} />
                Tolak
              </button>
            )}

            {applicant.status !== "diterima" && (
              <button
                type="button"
                onClick={onAccept}
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-bright transition-colors"
              >
                <Check size={14} />
                Terima Volunteer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
