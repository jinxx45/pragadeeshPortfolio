"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { profile, experience, projects, skills, recognition } from "./data";

const AgentGraph = dynamic(() => import("./AgentGraph"), { ssr: false });

/* ---------- Panel contents: each one is a small self-contained "app" ---------- */

function PanelShell({ kicker, title, children, footer }) {
  return (
    <div className="h-full flex flex-col p-6 md:p-7">
      <p className="text-[13px] text-[var(--ash)]">{kicker}</p>
      <h2 className="title text-[2rem] md:text-[2.4rem] mt-1 pb-1">{title}</h2>
      <div className="mt-5 flex-1 min-h-0 overflow-y-auto pr-1 text-[14.5px] leading-relaxed">{children}</div>
      {footer && <div className="pt-5">{footer}</div>}
    </div>
  );
}

function GraphPanel({ active }) {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0">{active && <AgentGraph compact />}</div>
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 bg-gradient-to-t from-[var(--panel)] via-[var(--panel)]/90 to-transparent pt-16">
        <h2 className="title text-[2rem] md:text-[2.4rem]">How my agents work</h2>
        <p className="text-[var(--ash)] mt-2 text-[14.5px]">
          Each amber signal is a tool call hopping between services.
        </p>
      </div>
    </div>
  );
}

function JobPanel({ job }) {
  return (
    <PanelShell kicker={`${job.period}, ${job.place}`} title={job.company}>
      <p className="text-[var(--ash)] -mt-2 mb-5">{job.role}</p>
      <ul className="space-y-3">
        {job.points.map((p) => (
          <li key={p} className="pl-4 relative">
            <span className="absolute left-0 top-[0.72em] h-px w-2 bg-[var(--ash)]" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

function ProjectPanel({ p }) {
  return (
    <PanelShell
      kicker={p.stack}
      title={p.name}
      footer={
        <a
          href={p.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--bone)] text-black px-4 py-2 text-sm font-medium hover:bg-[var(--signal)] transition-colors"
        >
          {p.status === "Live" ? "Open the app" : "View the code"}
        </a>
      }
    >
      <p className="flex items-center gap-2 text-sm text-[var(--ash)] mb-4">
        <span
          className={`h-2 w-2 rounded-full ${p.status === "Live" ? "bg-[var(--signal)]" : "border border-[var(--ash)]"}`}
          aria-hidden="true"
        />
        {p.status}
      </p>
      <p>{p.text}</p>
      {p.next && <p className="mt-3 text-[var(--ash)]">{p.next}</p>}
    </PanelShell>
  );
}

function SkillsPanel() {
  const [open, setOpen] = useState(0);
  return (
    <PanelShell kicker="What I work with" title="Skills">
      <ul className="divide-y divide-[var(--panel-edge)]">
        {skills.map(([group, list], i) => (
          <li key={group}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="w-full flex justify-between items-center py-3 text-left"
            >
              <span className="font-medium">{group}</span>
              <span className="text-[var(--ash)] text-lg leading-none" aria-hidden="true">
                {open === i ? "–" : "+"}
              </span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
              className="overflow-hidden"
            >
              <p className="pb-3 text-[var(--ash)]">{list}</p>
            </motion.div>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

function AwardPanel() {
  return (
    <PanelShell kicker="Workday, 2026" title="2nd prize, AI hackathon">
      <p>{recognition}</p>
    </PanelShell>
  );
}

function ContactPanel() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <PanelShell kicker="Say hello" title="Get in touch">
      <p className="text-[var(--ash)]">Building something with agents, or need a hand on a Java or React codebase? Email is quickest.</p>
      <p className="mt-5 text-lg break-all">{profile.email}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-[var(--bone)] text-black px-4 py-2 text-sm font-medium hover:bg-[var(--signal)] transition-colors"
        >
          {copied ? "Email copied" : "Copy email"}
        </button>
        <a href={profile.github} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--panel-edge)] px-4 py-2 text-sm hover:border-[var(--bone)] transition-colors">
          GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--panel-edge)] px-4 py-2 text-sm hover:border-[var(--bone)] transition-colors">
          LinkedIn
        </a>
      </div>
      <p aria-live="polite" className="sr-only">{copied ? "Email copied to clipboard" : ""}</p>
    </PanelShell>
  );
}

const panels = [
  { label: "Agents", render: (active) => <GraphPanel active={active} /> },
  ...experience.map((job) => ({ label: job.company, render: () => <JobPanel job={job} /> })),
  ...projects.map((p) => ({ label: p.name, render: () => <ProjectPanel p={p} /> })),
  { label: "Skills", render: () => <SkillsPanel /> },
  { label: "Hackathon", render: () => <AwardPanel /> },
  { label: "Contact", render: () => <ContactPanel /> },
];

/* ---------- The deck: swipe, drag, arrow keys or the tabs ---------- */

function useCardSize() {
  const [size, setSize] = useState({ w: 400, h: 520, gap: 250 });
  useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(420, vw * 0.84);
      const h = Math.min(540, Math.max(420, vh * 0.58));
      setSize({ w, h, gap: vw < 768 ? w * 0.92 : w * 0.62 });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return size;
}

function Deck() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const { w, h, gap } = useCardSize();
  const last = panels.length - 1;

  const go = useCallback((i) => setIndex(Math.max(0, Math.min(last, i))), [last]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest && e.target.closest("input, textarea")) return;
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const onDragEnd = (_, info) => {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -60) go(index + Math.max(1, Math.round(-swipe / gap)));
    else if (swipe > 60) go(index - Math.max(1, Math.round(swipe / gap)));
  };

  return (
    <section aria-roledescription="carousel" aria-label="Work, projects and contact" className="relative">
      <div className="relative mx-auto select-none" style={{ height: h + 40, perspective: 1400 }}>
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={onDragEnd}
        >
          {panels.map((panel, i) => {
            const d = i - index;
            const abs = Math.abs(d);
            const hidden = abs > 3;
            return (
              <motion.article
                key={panel.label}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${panels.length}: ${panel.label}`}
                aria-hidden={d !== 0}
                inert={d !== 0 ? "" : undefined}
                onClick={() => d !== 0 && go(i)}
                className="absolute top-5 left-1/2 rounded-[22px] bg-[var(--panel)] border border-[var(--panel-edge)] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
                style={{ width: w, height: h, marginLeft: -w / 2, zIndex: 100 - abs, pointerEvents: hidden ? "none" : "auto" }}
                initial={false}
                animate={{
                  x: d * gap,
                  rotateY: reduce ? 0 : Math.max(-1, Math.min(1, d)) * -32,
                  scale: d === 0 ? 1 : 0.84 - Math.min(abs - 1, 2) * 0.04,
                  opacity: hidden ? 0 : d === 0 ? 1 : 0.32 - (abs - 1) * 0.08,
                }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 32 }}
              >
                {abs <= 2 && panel.render(d === 0)}
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      <div className="mx-auto max-w-5xl px-6 mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous panel"
          className="h-10 w-10 shrink-0 rounded-full border border-[var(--panel-edge)] grid place-items-center disabled:opacity-30 hover:border-[var(--bone)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>

        <nav aria-label="Panels" className="overflow-x-auto [scrollbar-width:none]">
          <ul className="flex gap-1.5 text-[13px] whitespace-nowrap">
            {panels.map((panel, i) => (
              <li key={panel.label}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index ? "true" : undefined}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    i === index ? "bg-[var(--bone)] text-black" : "text-[var(--ash)] hover:text-[var(--bone)]"
                  }`}
                >
                  {panel.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === last}
          aria-label="Next panel"
          className="h-10 w-10 shrink-0 rounded-full border border-[var(--panel-edge)] grid place-items-center disabled:opacity-30 hover:border-[var(--bone)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  const reduce = useReducedMotion();
  return (
    <main className="min-h-[100svh] flex flex-col overflow-x-hidden">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-5xl px-6 pt-10 md:pt-14 pb-6 md:pb-8 grid md:grid-cols-[1fr_auto] gap-4 items-end"
      >
        <div>
          <h1 className="title text-[2.15rem] sm:text-[2.6rem] md:text-[4rem]">{profile.name}</h1>
          <p className="mt-3 text-[var(--ash)] max-w-xl text-[15px] md:text-base">{profile.intro}</p>
        </div>
        <p className="text-[13px] text-[var(--ash)] md:text-right">
          {profile.role}
          <br />
          {profile.location}
        </p>
      </motion.header>

      <div className="flex-1 flex flex-col justify-center pb-10">
        <Deck />
        <p className="text-center text-[12.5px] text-[var(--ash)] mt-5">Swipe, drag or use the arrow keys</p>
      </div>
    </main>
  );
}
