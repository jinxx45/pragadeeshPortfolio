"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { profile, experience, projects, skills, facts } from "./data";

/* ---------- Panel contents ---------- */

function PanelShell({ kicker, title, sub, children, footer }) {
  return (
    <div className="h-full flex flex-col p-6 md:p-7">
      <p className="text-[13px] text-[var(--ash)]">{kicker}</p>
      <h3 className="title text-[1.9rem] md:text-[2.3rem] mt-1 pb-1">{title}</h3>
      {sub && <p className="text-[var(--ash)] mt-1">{sub}</p>}
      <div
        className="mt-5 flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 text-[14.5px] leading-relaxed"
        style={{ touchAction: "pan-y" }}
      >
        {children}
      </div>
      {footer && <div className="pt-5">{footer}</div>}
    </div>
  );
}

function SkillPanel({ s }) {
  return (
    <PanelShell kicker={`${s.items.length} tools`} title={s.group}>
      <p className="text-[var(--ash)] mb-5">{s.note}</p>
      <ul className="flex flex-wrap gap-2">
        {s.items.map((item) => (
          <li key={item} className="rounded-full border border-[var(--panel-edge)] px-3 py-1.5 text-[13.5px]">
            {item}
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

function JobPanel({ job }) {
  return (
    <PanelShell kicker={`${job.period}, ${job.place}`} title={job.company} sub={job.role}>
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
          className="inline-flex rounded-full bg-[var(--bone)] text-black px-4 py-2 text-sm font-medium hover:bg-[var(--signal)] transition-colors"
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

const categories = [
  { name: "Skills", panels: skills.map((s) => ({ key: s.group, node: <SkillPanel s={s} /> })) },
  { name: "Experience", panels: experience.map((j) => ({ key: j.company, node: <JobPanel job={j} /> })) },
  { name: "Projects", panels: projects.map((p) => ({ key: p.name, node: <ProjectPanel p={p} /> })) },
];

/* ---------- Swipeable deck ---------- */

// On phones the deck fills whatever height is left on screen, so the page never scrolls.
function useCardSize(ref) {
  const [size, setSize] = useState({ w: 400, h: 460, gap: 250 });
  useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const mobile = vw < 768;
      const w = Math.min(420, vw * 0.84);
      let h = Math.min(480, Math.max(380, window.innerHeight * 0.5));
      if (mobile && ref.current) {
        const controls = 64; // arrows + dots row
        h = Math.max(260, Math.min(480, ref.current.clientHeight - controls - 16));
      }
      setSize({ w, h, gap: mobile ? w * 0.9 : w * 0.62 });
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [ref]);
  return size;
}

function Deck({ category }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const box = useRef(null);
  const { w, h, gap } = useCardSize(box);
  const panels = category.panels;
  const last = panels.length - 1;
  const go = useCallback((i) => setIndex(Math.max(0, Math.min(last, i))), [last]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const onDragEnd = (_, info) => {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -50) go(index + Math.max(1, Math.round(-swipe / gap)));
    else if (swipe > 50) go(index - Math.max(1, Math.round(swipe / gap)));
  };

  return (
    <div ref={box} aria-roledescription="carousel" aria-label={category.name} className="h-full flex flex-col justify-center">
      {/* touch-action: none keeps a horizontal swipe from scrolling the page */}
      <div className="relative select-none shrink-0" style={{ height: h + 16, perspective: 1400 }}>
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          drag="x"
          dragDirectionLock
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
                key={panel.key}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${panels.length}: ${panel.key}`}
                aria-hidden={d !== 0}
                inert={d !== 0 ? "" : undefined}
                onClick={() => d !== 0 && go(i)}
                className="absolute top-2 left-1/2 rounded-[22px] bg-[var(--panel)] border border-[var(--panel-edge)] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
                style={{ width: w, height: h, marginLeft: -w / 2, zIndex: 100 - abs, pointerEvents: hidden ? "none" : "auto" }}
                initial={reduce ? false : { opacity: 0, x: d * gap + 60 }}
                animate={{
                  x: d * gap,
                  rotateY: reduce ? 0 : Math.max(-1, Math.min(1, d)) * -32,
                  scale: d === 0 ? 1 : 0.84 - Math.min(abs - 1, 2) * 0.04,
                  opacity: hidden ? 0 : d === 0 ? 1 : 0.32 - (abs - 1) * 0.08,
                }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 32 }}
              >
                {abs <= 2 && panel.node}
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-3 shrink-0 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous"
          className="h-10 w-10 rounded-full border border-[var(--panel-edge)] grid place-items-center disabled:opacity-30 hover:border-[var(--bone)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
        <div className="flex gap-1.5" aria-hidden="true">
          {panels.map((p, i) => (
            <span
              key={p.key}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[var(--bone)]" : "w-1.5 bg-[var(--panel-edge)]"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === last}
          aria-label="Next"
          className="h-10 w-10 rounded-full border border-[var(--panel-edge)] grid place-items-center disabled:opacity-30 hover:border-[var(--bone)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {panels[index].key}, {index + 1} of {panels.length}
      </p>
    </div>
  );
}

/* ---------- Page ---------- */

function CopyEmail() {
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
    <button
      type="button"
      onClick={copy}
      className="rounded-full bg-[var(--bone)] text-black px-4 py-2 text-sm font-medium hover:bg-[var(--signal)] transition-colors"
    >
      {copied ? "Email copied" : "Copy email"}
    </button>
  );
}

export default function Home() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 h-[100svh] md:h-auto flex flex-col overflow-hidden md:overflow-visible pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.75rem,env(safe-area-inset-bottom))] md:pt-20 md:pb-16">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="shrink-0 grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16"
      >
        <div>
          <h1 className="text-[13px] text-[var(--ash)]">{profile.name}</h1>
          <p className="title text-[1.75rem] sm:text-[2.3rem] md:text-[3.4rem] mt-2 md:mt-3">
            Hey, I&apos;m Pragadeesh. I build AI agents and the software around them.
          </p>
          <p className="hidden md:block mt-5 text-[var(--ash)] max-w-xl">{profile.intro}</p>
          <p className="md:hidden mt-2 text-[13.5px] text-[var(--ash)]">SDE 2 at Workday, Chennai</p>
          <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
            <CopyEmail />
            <a href={profile.github} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--panel-edge)] px-4 py-2 text-sm hover:border-[var(--bone)] transition-colors">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--panel-edge)] px-4 py-2 text-sm hover:border-[var(--bone)] transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
        <dl className="hidden md:block self-end divide-y divide-[var(--panel-edge)] border-y border-[var(--panel-edge)] text-[14px]">
          {facts.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 py-2.5">
              <dt className="text-[var(--ash)]">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </motion.header>

      <section className="flex-1 min-h-0 flex flex-col mt-6 md:mt-20" aria-label="Skills, experience and projects">
        <div role="tablist" aria-label="Categories" className="shrink-0 flex justify-center">
          <div className="inline-flex rounded-full border border-[var(--panel-edge)] p-1">
            {categories.map((c, i) => (
              <button
                key={c.name}
                role="tab"
                type="button"
                aria-selected={tab === i}
                onClick={() => setTab(i)}
                className="relative px-4 md:px-5 py-2 text-sm rounded-full"
              >
                {tab === i && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-[var(--bone)]"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className={`relative ${tab === i ? "text-black font-medium" : "text-[var(--ash)]"}`}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div role="tabpanel" aria-label={categories[tab].name} className="flex-1 min-h-0 mt-4 md:mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={categories[tab].name}
              className="h-full"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Deck category={categories[tab]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
