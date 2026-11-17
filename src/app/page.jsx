"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { profile, experience, projects, skills, recognition } from "./data";

const AgentGraph = dynamic(() => import("./AgentGraph"), { ssr: false });

const nav = [
  ["Work", "#work"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

function Section({ id, title, children }) {
  return (
    <section id={id} className="border-t border-[var(--rule)] scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-[14rem_1fr] gap-10 md:gap-16">
        <h2 className="heading text-3xl md:text-4xl font-semibold text-[var(--bone)]">{title}</h2>
        <div>{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  const reduce = useReducedMotion();
  const [first, last] = ["Pragadeeshvaran", "S."];

  const word = (text, delayBase) =>
    text.split("").map((ch, i) => (
      <motion.span
        key={i}
        className="inline-block"
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay: delayBase + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
      >
        {ch}
      </motion.span>
    ));

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 bg-[var(--bone)] text-black px-3 py-2"
      >
        Skip to work
      </a>

      <header className="fixed top-0 inset-x-0 z-40 bg-black/70 backdrop-blur-md">
        <nav className="mx-auto max-w-6xl px-6 md:px-10 h-16 flex items-center justify-between" aria-label="Main">
          <a href="#top" className="heading text-xl font-semibold">
            PS
          </a>
          <ul className="flex gap-5 md:gap-8 text-sm text-[var(--ash)]">
            {nav.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="hover:text-[var(--bone)] transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top">
        {/* Hero: the agent graph is the one loud thing on the page */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0 md:left-[30%]">
            <AgentGraph />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent md:via-black/30"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-6xl px-6 md:px-10 min-h-[100svh] flex flex-col justify-end pb-16 md:pb-24 pt-28">
            <h1 className="display font-bold whitespace-nowrap text-[15vw] md:text-[11.5rem] text-[var(--bone)]">
              <span className="block overflow-hidden pb-[0.06em]">{word(first, 0.6)}</span>
              <span className="block overflow-hidden pb-[0.06em]">{word(last, 0.6 + first.length * 0.035)}</span>
            </h1>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mt-8 md:mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-end"
            >
              <div>
                <p className="heading text-2xl md:text-3xl font-medium">
                  {profile.role}, {profile.location}
                </p>
                <p className="measure mt-4 text-[var(--ash)] text-base md:text-lg">{profile.intro}</p>
              </div>
              <div className="flex flex-wrap gap-3 pointer-events-auto">
                <a
                  href={`mailto:${profile.email}`}
                  className="bg-[var(--bone)] text-black px-5 py-3 text-sm font-medium hover:bg-[var(--signal)] transition-colors"
                >
                  Email me
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[var(--rule)] px-5 py-3 text-sm hover:border-[var(--bone)] transition-colors"
                >
                  GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[var(--rule)] px-5 py-3 text-sm hover:border-[var(--bone)] transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Section id="work" title="Work">
          <ol className="space-y-16">
            {experience.map((job) => (
              <li key={job.company} className="grid md:grid-cols-[10rem_1fr] gap-3 md:gap-10">
                <p className="text-sm text-[var(--ash)] pt-1.5">
                  {job.period}
                  <br />
                  {job.place}
                </p>
                <div>
                  <h3 className="heading text-2xl md:text-3xl font-semibold">{job.company}</h3>
                  <p className="text-[var(--ash)] mt-1">{job.role}</p>
                  <ul className="mt-5 space-y-3 measure">
                    {job.points.map((p) => (
                      <li key={p} className="pl-5 relative">
                        <span className="absolute left-0 top-[0.7em] h-px w-2.5 bg-[var(--ash)]" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="projects" title="Projects">
          <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
            {projects.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group block py-8 md:py-10"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="heading text-3xl md:text-5xl font-semibold group-hover:text-white transition-colors">
                    {p.name}
                  </h3>
                  <span className="flex items-center gap-2 text-sm text-[var(--ash)]">
                    <span
                      className={`h-2 w-2 rounded-full ${p.status === "Live" ? "bg-[var(--signal)]" : "border border-[var(--ash)]"}`}
                      aria-hidden="true"
                    />
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--ash)] mt-2">{p.stack}</p>
                <p className="measure mt-4">{p.text}</p>
                {p.next && <p className="measure mt-2 text-[var(--ash)]">{p.next}</p>}
                <span className="inline-block mt-5 text-sm link">
                  {p.status === "Live" ? "Open the app" : "View the code"}
                </span>
              </a>
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <dl className="divide-y divide-[var(--rule)]">
            {skills.map(([group, list]) => (
              <div key={group} className="grid sm:grid-cols-[9rem_1fr] gap-1 sm:gap-8 py-4 first:pt-0">
                <dt className="text-[var(--ash)]">{group}</dt>
                <dd>{list}</dd>
              </div>
            ))}
          </dl>
          <p className="measure mt-12 text-[var(--ash)]">{recognition}</p>
        </Section>

        <section id="contact" className="border-t border-[var(--rule)] scroll-mt-20">
          <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-36">
            <p className="text-[var(--ash)] measure">
              Building something with agents, or need a hand on a Java or React codebase? Email is the fastest way to reach me.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="display font-bold block mt-6 text-[9.5vw] md:text-[6.5rem] break-all hover:text-[var(--signal)] transition-colors"
            >
              {profile.email}
            </a>
            <div className="mt-10 flex gap-6 text-sm">
              <a className="link" href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="link" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--rule)]">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-8 text-sm text-[var(--ash)] flex flex-wrap justify-between gap-4">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>The graph up top is a little agent run: each amber signal hops between nodes like a tool call.</span>
        </div>
      </footer>
    </>
  );
}
