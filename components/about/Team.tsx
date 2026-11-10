"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import { teamData, type TeamMember } from "@/lib/data";
import TeamCard from "./TeamCard";

type TabId = "founder" | "organizer";

const TABS: { id: TabId; label: string }[] = [
  { id: "founder", label: "FOUNDER" },
  { id: "organizer", label: "ORGANIZER" },
];

/** Desktop layout: cards in a single row */
function DesktopCards({
  members,
  priority,
}: {
  members: TeamMember[];
  priority: boolean;
}) {
  const isTrio = members.length === 3;
  if (isTrio) {
    return (
      <div className="grid grid-cols-3 gap-5 lg:gap-6 max-w-[1728px] mx-auto items-start">
        {members.map((m, i) => (
          <TeamCard
            key={m.image}
            name={m.name}
            role={m.role}
            tone={m.tone}
            image={{ src: m.image, width: m.width, height: m.height }}
            priority={priority && i === 0}
            sizes="(min-width: 1280px) 560px, (min-width: 768px) 33vw, 100vw"
          />
        ))}
      </div>
    );
  }

  // 2 organizer cards: centered, identical card width to founder cards
  return (
    <div className="flex justify-center gap-5 lg:gap-6 max-w-[1728px] mx-auto items-start">
      {members.map((m, i) => (
        <div
          key={m.image}
          className="w-[calc((100%-2*1.25rem)/3)] lg:w-[calc((100%-2*1.5rem)/3)] max-w-[560px]"
        >
          <TeamCard
            name={m.name}
            role={m.role}
            tone={m.tone}
            image={{ src: m.image, width: m.width, height: m.height }}
            priority={priority && i === 0}
            sizes="(min-width: 1280px) 560px, (min-width: 768px) 33vw, 100vw"
          />
        </div>
      ))}
    </div>
  );
}

/** Mobile Founder: single column, all cards stacked full-width */
function MobileFounderCards({ members }: { members: TeamMember[] }) {
  return (
    <div className="flex flex-col gap-0 max-w-[560px] mx-auto w-full">
      {members.map((m, i) => (
        <TeamCard
          key={m.image}
          name={m.name}
          role={m.role}
          tone={m.tone}
          image={{ src: m.image, width: m.width, height: m.height }}
          priority={i === 0}
          sizes="(max-width: 767px) calc(100vw - 48px)"
        />
      ))}
    </div>
  );
}

/** Mobile Organizer: single column, cards stacked full-width */
function MobileOrganizerCards({
  members,
  priority,
}: {
  members: TeamMember[];
  priority: boolean;
}) {
  return (
    <div className="flex flex-col gap-0 max-w-[560px] mx-auto w-full">
      {members.map((m, i) => (
        <TeamCard
          key={m.image}
          name={m.name}
          role={m.role}
          tone={m.tone}
          image={{ src: m.image, width: m.width, height: m.height }}
          priority={priority && i === 0}
          sizes="(max-width: 767px) calc(100vw - 48px)"
        />
      ))}
    </div>
  );
}

export default function Team() {
  const [activeTab, setActiveTab] = useState<TabId>("founder");
  const [fading, setFading] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const switchTab = useCallback(
    (id: TabId) => {
      if (id === activeTab) return;
      setFading(true);
      setTimeout(() => {
        setActiveTab(id);
        setFading(false);
      }, 150);
    },
    [activeTab],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const count = TABS.length;
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % count;
    else if (e.key === "ArrowLeft") next = (i - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    switchTab(TABS[next].id);
  };

  const tabIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <section
      aria-labelledby="team-heading"
      className="bg-primary-deep pt-8 pb-10 md:pt-12 md:pb-16"
    >
      <div className="container-site">


        {/* Heading + Subtitle – centered */}
        <div className="mb-8 text-center md:mb-10">
          <h2
            id="team-heading"
            className="font-display text-4xl uppercase tracking-wide text-white md:text-5xl lg:text-6xl"
          >
            DI BALIK PASTEER3
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
            Dedikasi para founder dan jajaran pengurus dalam menggerakkan aksi
            nyata pemuda Lampung.
          </p>
        </div>

        {/* Tab bar + Page counter */}
        <div className="mb-6 flex items-center justify-between">
          <div
            role="tablist"
            aria-label="Pilih kelompok tim"
            className="flex items-center gap-2"
          >
            {TABS.map((tab, i) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => switchTab(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={`rounded-full px-5 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${isActive
                    ? "border border-[#4ba398]/70 bg-[#2b5966]/90 text-[#a6f4c5] shadow-inner"
                    : "text-white/70 hover:text-white"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Page indicator pill */}
          <span
            className="rounded-full border border-white/20 bg-[#163872] px-3.5 py-1 text-xs font-semibold tabular-nums text-white"
            aria-label={`Tab ${tabIndex + 1} dari ${TABS.length}`}
          >
            {tabIndex + 1}/{TABS.length}
          </span>
        </div>

        {/* Tab panels */}
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const members = teamData[tab.id];
          return (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              hidden={!isActive}
              className={`transition-opacity duration-150 ${isActive && !fading ? "opacity-100" : "opacity-0"
                }`}
            >
              {/* Desktop layout */}
              <div className="hidden md:block">
                <DesktopCards members={members} priority={tab.id === "founder"} />
              </div>

              {/* Mobile layout */}
              <div className="md:hidden">
                {tab.id === "founder" ? (
                  <MobileFounderCards members={members} />
                ) : (
                  <MobileOrganizerCards
                    members={members}
                    priority={isActive}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
