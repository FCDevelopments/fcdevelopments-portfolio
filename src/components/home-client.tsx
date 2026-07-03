"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Reveal, CountUp, MagneticWrap } from "./motion";

type Project = {
  name: string;
  description: string;
  tech: string[];
  badge: string;
  link: string;
  github: string;
};

const badgeColors: Record<string, string> = {
  Production: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300",
  "AI Tooling": "bg-purple-500/15 border-purple-400/30 text-purple-300",
  Operations: "bg-cyan-500/15 border-cyan-400/30 text-cyan-300",
  "Web App": "bg-sky-500/15 border-sky-400/30 text-sky-300",
  Template: "bg-teal-500/15 border-teal-400/30 text-teal-300",
};

const capabilities = [
  {
    title: "Workflow Automation",
    kicker: "automate()",
    copy: "Production pipelines that replace recurring manual work — scheduled, monitored, and self-alerting when something needs a human.",
  },
  {
    title: "Systems Integration",
    kicker: "connect()",
    copy: "Moving data correctly between the systems a business actually runs on — Jira, Salesforce, Box, RingCentral, Snowflake, Outlook.",
  },
  {
    title: "AI & LLM Tooling",
    kicker: "augment()",
    copy: "LLM agents, speech-to-text pipelines, and AI-assisted reporting in daily company-wide use — practical AI, not demos.",
  },
  {
    title: "IT Operations",
    kicker: "operate()",
    copy: "Okta administration, identity lifecycle, endpoint management, and the discipline of keeping production systems boring.",
  },
];

const terminalLines = [
  { prompt: true, text: "run nightly-archiver --since last-run" },
  { cls: "t-dim", text: "auth      RingCentral JWT ........ OK" },
  { cls: "t-dim", text: "fetch     call log: 3 pages, 612 records" },
  { cls: "t-info", text: "dedup     609 already archived, 3 new" },
  { cls: "t-dim", text: "upload    Box /Call Archive/July 2026 ... 3 files" },
  { cls: "t-ok", text: "✓ complete — 0 failures, state saved" },
  { prompt: true, text: "", caret: true },
];

export function HomeClient({ projects, skills }: { projects: Project[]; skills: string[] }) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] grain-overlay relative">
      <div ref={cursorRef} className="cursor-glow hidden lg:block" />

      {/* ═══════ HERO ═══════ */}
      <section className="hero-surface relative min-h-[92vh] flex items-center">
        <div className="orb orb-accent w-[420px] h-[420px] top-[8%] right-[8%]" />
        <div className="orb orb-soft w-[320px] h-[320px] bottom-[15%] left-[8%]" style={{ animationDelay: "3s" }} />

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
            <div>
              <Reveal variant="fade-up" delay={0.1}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand)] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--brand)]" />
                  </span>
                  <p className="eyebrow">IT Systems Engineer — 8 automations in production</p>
                </div>
              </Reveal>

              <Reveal variant="fade-up" delay={0.2}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.98] mb-6">
                  I automate the work
                  <br />
                  nobody should do
                  <br />
                  <span className="text-gradient-accent">by hand.</span>
                </h1>
              </Reveal>

              <Reveal variant="fade-up" delay={0.4}>
                <p className="text-lg lg:text-xl text-[var(--muted)] max-w-2xl mb-10 leading-relaxed">
                  Fabian Castaneda — I design and ship production automation for IT, finance,
                  and operations: Python and Node.js pipelines, REST API integrations, and
                  AI/LLM tooling built to run unattended and fail loudly.
                </p>
              </Reveal>

              <Reveal variant="fade-up" delay={0.55}>
                <div className="flex flex-wrap gap-4">
                  <MagneticWrap>
                    <Link href="/projects" className="button-primary">
                      View the Work
                    </Link>
                  </MagneticWrap>
                  <MagneticWrap>
                    <a
                      href="https://github.com/FCDevelopments"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-secondary"
                    >
                      GitHub
                    </a>
                  </MagneticWrap>
                </div>
              </Reveal>
            </div>

            <Reveal variant="fade-left" delay={0.5}>
              <div className="terminal-window hidden lg:block" aria-hidden="true">
                <div className="terminal-titlebar">
                  <span className="terminal-dot bg-red-500/60" />
                  <span className="terminal-dot bg-yellow-500/60" />
                  <span className="terminal-dot bg-green-500/60" />
                  <span className="ml-3 text-[0.7rem] text-[var(--chrome-dim)]">fcdev — scheduled task</span>
                </div>
                <div className="terminal-body">
                  {terminalLines.map((line, i) => (
                    <div key={i}>
                      {line.prompt ? (
                        <>
                          <span className="t-prompt">fcdev</span>
                          <span className="t-dim">:~$ </span>
                          <span className="t-cmd">{line.text}</span>
                          {line.caret && <span className="terminal-caret" />}
                        </>
                      ) : (
                        <span className={line.cls}>{line.text}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <section className="relative z-10 border-y border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Reveal variant="fade-up" delay={0}>
              <div className="text-center">
                <p className="stat-number"><CountUp target={8} /></p>
                <p className="stat-label">Automations in Production</p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={0.1}>
              <div className="text-center">
                <p className="stat-number"><CountUp target={11700} suffix="+" /></p>
                <p className="stat-label">Recordings Archived</p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={0.2}>
              <div className="text-center">
                <p className="stat-number"><CountUp target={42000} suffix="+" /></p>
                <p className="stat-label">Jira Tickets Processed</p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={0.3}>
              <div className="text-center">
                <p className="stat-number text-gradient-accent"><CountUp target={30} suffix="+" /></p>
                <p className="stat-label">Hours Saved / Month</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════ CAPABILITIES ═══════ */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <p className="eyebrow mb-4">Capabilities</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-14">
              Design it. Build it.{" "}
              <span className="text-gradient-accent">Let it run.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => (
              <Reveal key={cap.title} variant="fade-up" delay={i * 0.1}>
                <div className="card-premium h-full">
                  <p className="mono text-xs text-[var(--brand)] mb-4">{cap.kicker}</p>
                  <h3 className="text-lg font-bold mb-3">{cap.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{cap.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-accent mx-auto max-w-xl" />

      {/* ═══════ FEATURED PROJECTS ═══════ */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="eyebrow mb-4">Production Work</p>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Built. Shipped. Running.</h2>
              </div>
              <Link href="/projects" className="nav-link text-[var(--brand)] hidden sm:block">
                All Projects →
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => {
              const colorClass = badgeColors[project.badge] || "bg-white/5 border-white/10 text-white/60";
              return (
                <Reveal key={project.name} variant="fade-up" delay={i * 0.08}>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block project-showcase group h-full"
                  >
                    <div className="project-image">
                      <span className="mono text-xs text-[var(--chrome-dim)] group-hover:text-[var(--brand)] transition-colors duration-500">
                        $ ./{project.name.split(" ")[0].toLowerCase().replace(/[^a-z0-9-]/g, "")}
                      </span>
                    </div>
                    <div className="project-content">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--brand)] transition-colors duration-300">
                          {project.name}
                        </h3>
                        <span className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold whitespace-nowrap border ${colorClass}`}>
                          {project.badge}
                        </span>
                      </div>
                      <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span key={t} className="mono px-2.5 py-1 rounded text-[0.68rem] bg-white/[0.03] border border-white/[0.06] text-[var(--chrome-dim)]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ TECH STACK MARQUEE ═══════ */}
      <section className="py-12 border-y border-white/[0.04] overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div className="tech-marquee">
            {[...skills, ...skills].map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="mono text-sm font-medium text-[var(--chrome-dim)] uppercase tracking-widest"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ABOUT PREVIEW ═══════ */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal variant="fade-right">
              <p className="eyebrow mb-4">About</p>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
                Fabian<br />
                <span className="text-gradient-accent">Castaneda.</span>
              </h2>
              <p className="text-[var(--muted)] text-lg leading-relaxed mb-4">
                IT Services Specialist in Orange County, CA. My job is finding the repetitive,
                error-prone work inside a business and replacing it with systems that do it
                correctly every time — then documenting them so they outlive me.
              </p>
              <p className="text-[var(--muted)] leading-relaxed mb-6">
                Precision is the brand: stale-input guards, quarantine queues for bad data,
                offline test suites, and alerts that page a human before anyone notices
                something broke.
              </p>
              <Link href="/about" className="nav-link text-[var(--brand)] text-sm">
                Full Story →
              </Link>
            </Reveal>

            <Reveal variant="fade-left" delay={0.2}>
              <div className="grid grid-cols-2 gap-4 items-stretch">
                <div className="card-chrome h-full p-6">
                  <p className="mono text-xs text-[var(--brand)] uppercase tracking-wider mb-2">Identity</p>
                  <h3 className="text-lg font-bold mb-1">Okta Admin</h3>
                  <p className="text-sm text-[var(--muted)]">SSO, provisioning, app assignment, onboarding QC</p>
                </div>
                <div className="card-chrome h-full p-6">
                  <p className="mono text-xs text-[var(--brand)] uppercase tracking-wider mb-2">AI / LLM</p>
                  <h3 className="text-lg font-bold mb-1">Agents in Prod</h3>
                  <p className="text-sm text-[var(--muted)]">Salesforce-integrated LLM agent, AI reporters, speech-to-text</p>
                </div>
                <div className="card-chrome h-full p-6">
                  <p className="mono text-xs text-[var(--brand)] uppercase tracking-wider mb-2">Platforms</p>
                  <h3 className="text-lg font-bold mb-1">Site Admin ×5</h3>
                  <p className="text-sm text-[var(--muted)]">Jira, Box, RingCentral, ClickUp, Loom</p>
                </div>
                <div className="card-chrome h-full p-6">
                  <p className="mono text-xs text-[var(--brand)] uppercase tracking-wider mb-2">Standards</p>
                  <h3 className="text-lg font-bold mb-1">Team Stack</h3>
                  <p className="text-sm text-[var(--muted)]">Defined the internal-apps standard: React + TS, Node, Entra ID SSO, Docker</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="orb orb-accent w-[600px] h-[600px] bottom-[-20%] right-[10%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 text-center">
          <Reveal variant="scale-in">
            <p className="eyebrow mb-6">Contact</p>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Have a process that
              <br />
              <span className="text-gradient-accent">shouldn&apos;t be manual?</span>
            </h2>
            <p className="text-[var(--muted)] text-lg max-w-xl mx-auto mb-10">
              I&apos;m always up for talking automation, systems, and the tooling
              that makes IT teams faster.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticWrap>
                <a href="mailto:fabcast03@gmail.com" className="button-primary text-lg px-8 py-4">
                  Email Me
                </a>
              </MagneticWrap>
              <MagneticWrap>
                <a
                  href="https://linkedin.com/in/fcastaneda8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary text-lg px-8 py-4"
                >
                  LinkedIn
                </a>
              </MagneticWrap>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
