import { getDashboardCounts } from "@/lib/queries/admin-counts";
import { getSiteStatsAdmin } from "@/lib/queries/admin-stats";
import { getEvents } from "@/lib/queries/events";
import StatsEditForm from "@/components/admin/StatsEditForm";
import Link from "next/link";
import {
  Calendar,
  Images,
  ClipboardList,
  Users,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [counts, stats, recentEvents] = await Promise.all([
    getDashboardCounts(),
    getSiteStatsAdmin(),
    getEvents(),
  ]);

  const recent = recentEvents.slice(0, 3);

  const statCards = [
    {
      label: "Total Kegiatan",
      value: counts.totalEvents,
      icon: Calendar,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Total Foto Galeri",
      value: counts.totalGallery,
      icon: Images,
      color: "bg-accent/25 text-ink",
    },
    {
      label: "Form Terbuka",
      value: counts.openForms,
      icon: ClipboardList,
      color: "bg-success/10 text-success",
    },
    {
      label: "Pendaftar Menunggu",
      value: counts.pendingApplicants,
      icon: Users,
      color: "bg-danger/10 text-danger",
    },
  ];

  return (
    <div className="space-y-8 pt-8">
      {/* Page title */}
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Ringkasan data dan tindakan cepat PASTEER3.
        </p>
      </div>

      {/* Stat cards — 2x2 mobile, 4 columns desktop */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-[8px] border border-line bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {card.label}
                </span>
                <div className={`rounded-md p-2 ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-4 font-display text-4xl text-ink">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Edit Angka Statistik */}
      <div className="rounded-[8px] border border-line bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-xl uppercase text-ink">
          Edit Angka Statistik
        </h2>
        <p className="mb-5 text-sm text-muted">
          Angka ini ditampilkan di halaman utama publik (About section).
        </p>
        <StatsEditForm
          defaultEventsCompleted={stats?.events_completed ?? 0}
          defaultTotalVolunteers={stats?.total_volunteers ?? 0}
        />
      </div>

      {/* Bottom 2 cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent events */}
        <div className="rounded-[8px] border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="font-display text-xl uppercase text-ink">
              Kegiatan Terbaru
            </h2>
            <Link
              href="/admin/kegiatan"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Kelola <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recent.length > 0 ? (
              recent.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between rounded-[4px] border border-line/60 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{ev.title}</p>
                    <p className="text-xs text-muted">{ev.date || "Tanpa tanggal"}</p>
                  </div>
                  <span
                    className={`rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase ${
                      ev.status === "mendatang"
                        ? "bg-accent text-ink"
                        : "bg-surface text-muted"
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-muted">
                Belum ada kegiatan di database.
              </p>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-[8px] border border-line bg-white p-6 shadow-sm">
          <div className="border-b border-line pb-4">
            <h2 className="font-display text-xl uppercase text-ink">
              Tindakan Cepat
            </h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/admin/kegiatan", title: "+ Tambah Kegiatan", desc: "Publikasikan event volunteer baru" },
              { href: "/admin/galeri", title: "+ Upload Foto Galeri", desc: "Dokumentasi volunteer ke Cloudinary" },
              { href: "/admin/pendaftar", title: "Review Pendaftar", desc: "Seleksi calon volunteer yang masuk" },
              { href: "/admin/plotting", title: "Alokasi Plotting", desc: "Atur kuota dan penanggung jawab" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col rounded-[4px] border border-line p-3 transition-colors hover:border-primary"
              >
                <span className="text-xs font-semibold uppercase text-ink">
                  {item.title}
                </span>
                <span className="mt-1 text-[11px] text-muted">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
