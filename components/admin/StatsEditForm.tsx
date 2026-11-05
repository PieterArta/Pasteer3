"use client";

import { useState } from "react";
import { updateSiteStats } from "@/lib/actions/stats";
import { useToast } from "@/components/admin/Toast";
import { Save } from "lucide-react";

interface Props {
  defaultEventsCompleted: number;
  defaultTotalVolunteers: number;
}

export default function StatsEditForm({ defaultEventsCompleted, defaultTotalVolunteers }: Props) {
  const { showToast } = useToast();
  const [eventsCompleted, setEventsCompleted] = useState(defaultEventsCompleted);
  const [totalVolunteers, setTotalVolunteers] = useState(defaultTotalVolunteers);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateSiteStats(eventsCompleted, totalVolunteers);
    setLoading(false);
    if (res.success) {
      showToast("Statistik berhasil diperbarui.");
    } else {
      showToast(res.error || "Gagal memperbarui statistik.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          Kegiatan Terselesaikan
        </label>
        <input
          type="number"
          min={0}
          required
          value={eventsCompleted}
          onChange={(e) => setEventsCompleted(Number(e.target.value))}
          className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          Total Volunteer
        </label>
        <input
          type="number"
          min={0}
          required
          value={totalVolunteers}
          onChange={(e) => setTotalVolunteers(Number(e.target.value))}
          className="h-11 w-full rounded-[6px] border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-bright disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Save size={15} />
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
