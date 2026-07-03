"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal, CountUp } from "./motion";

type Project = {
  name: string;
  description: string;
  tech: string[];
  badge: string;
  link: string;
  github: string;
};

const capabilities = [
  {
    title: "Automation",
    tagline: "The work nobody should do by hand.",
    copy: "Production pipelines that replace recurring manual work — scheduled, monitored, and self-alerting. Stale inputs get rejected, bad rows get quarantined, failures page a human.",
    stack: "Python · Node.js · PowerShell · Task Scheduler",
  },
  {
    title: "Integration",
    tagline: "Systems that finally talk to each other.",
    copy: "Moving data correctly between the platforms a business actually runs on — Jira, Salesforce, Box, RingCentral, Snowflake, Outlook — with rate-limit discipline and dedup by design.",
    stack: "REST APIs · Webhooks · OAuth/JWT · CSV pipelines",
  },
  {
    title: "AI Tooling",
    tagline: "Practical AI. Not demos.",
    copy: "LLM agents integrated with company data, speech-to-text pipelines that transcribe 19 GB videos, and AI reporters in daily company-wide use.",
    stack: "Claude · MCP Servers · AssemblyAI · Semantic models",
  },
  {
    title: "Operations",
    tagline: "Keeping production boring.",
    copy: "Okta administration, identity lifecycle, onboarding QC, and site administration across five platforms. The discipline that makes automation safe to trust.",
    stack: "Okta · Entra ID · Jira Service Management · MDM",
  },
];

/** Scroll-pinned capability panels — theunknown.tv-style section. */
function PinnedCapabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrollable = el.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
        setActive(Math.min(capabilities.length - 1, Math.floor(progress * capabilities.length)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="pin-section" style={{ height: `${capabilities.length * 100 + 60}vh` }}>
      <div className="pin-viewport">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 relative h-full flex flex-col justify-center">
          <div className="section-label mb-4 shrink-0">
            <span className="label-index">01</span>
            <span>What I Do</span>
          </div>

          <div className="relative flex-1 max-h-[62vh]">
            {capabilities.map((cap, i) => (
              <div key={cap.title} className={`pin-panel ${i === active ? "is-active" : ""}`}>
                <h2 className="display display-xl mb-5">
                  <span className={i === active ? "text-gradient-accent" : ""}>{cap.title}</span>
                </h2>
                <p className="text-xl lg:text-2xl text-[var(--foreground)] font-medium mb-4 max-w-2xl">
                  {cap.tagline}
                </p>
                <p className="text-[var(--muted)] text-base lg:text-lg leading-relaxed max-w-2xl mb-6">
                  {cap.copy}
                </p>
                <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--chrome-dim)]">{cap.stack}</p>
              </div>
            ))}
          </div>

          <div className="pin-progress shrink-0">
            {capabilities.map((c, i) => (
              <span key={c.title} className={i === active ? "is-active" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeClient({ projects, skills }: { projects: Project[]; skills: string[] }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 120);
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className={`bg-[var(--background)] text-[var(--foreground)] grain-overlay relative ${ready ? "kinetic-ready" : ""}`}>
      <div ref={cursorRef} className="cursor-glow hidden lg:block" />

      {/* ═══════ HERO — full-screen kinetic type ═══════ */}
      <section className="hero-surface relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="orb orb-accent w-[480px] h-[480px] top-[6%] right-[4%]" />
        <div className="orb orb-soft w-[340px] h-[340px] bottom-[10%] left-[6%]" style={{ animationDelay: "3s" }} />

        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 w-full pt-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--brand)]" />
            </span>
            <p className="mono text-xs tracking-[0.22em] uppercase text-[var(--muted)]">
              Fabian Castaneda — IT Systems Engineer · Orange County, CA
            </p>
          </div>

          <h1 className="display display-hero" aria-label="I automate. I design. I build.">
            <span className="kinetic-line" aria-hidden="true">
              <span className="kinetic-slide-l">I Automate.</span>
            </span>
            <span className="kinetic-line" aria-hidden="true">
              <span className="kinetic-slide-r display-outline">I Design.</span>
            </span>
            <span className="kinetic-line" aria-hidden="true">
              <span className="text-gradient-accent">I Build.</span>
            </span>
          </h1>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <p className="text-lg lg:text-xl text-[var(--muted)] max-w-xl leading-relaxed">
              Production automation for IT, finance, and operations — engineered to run
              unattended, fail loudly, and do the job correctly every single time.
            </p>
            <div className="flex gap-4 shrink-0">
              <Link href="/projects" className="button-primary">View the Work</Link>
              <a
                href="https://github.com/FCDevelopments"
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 mono text-[0.65rem] tracking-[0.3em] uppercase text-[var(--chrome-dim)]">
          Scroll
        </div>
      </section>

      {/* ═══════ 01 — PINNED CAPABILITIES ═══════ */}
      <PinnedCapabilities />

      {/* ═══════ 02 — NUMBERS ═══════ */}
      <section className="mega-section border-y border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-14">
              <span className="label-index">02</span>
              <span>Receipts</span>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <Reveal variant="fade-up" delay={0}>
              <div>
                <p className="stat-number"><CountUp target={8} /></p>
                <p className="stat-label">Automations in Production</p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={0.1}>
              <div>
                <p className="stat-number"><CountUp target={11700} suffix="+" /></p>
                <p className="stat-label">Recordings Archived</p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={0.2}>
              <div>
                <p className="stat-number"><CountUp target={42000} suffix="+" /></p>
                <p className="stat-label">Jira Tickets Processed</p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={0.3}>
              <div>
                <p className="stat-number text-gradient-accent"><CountUp target={30} suffix="+" /></p>
                <p className="stat-label">Hours Saved / Month</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════ 03 — THE WORK (giant type rows) ═══════ */}
      <section className="mega-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-14">
              <span className="label-index">03</span>
              <span>The Work</span>
            </div>
          </Reveal>

          <div>
            {projects.map((project, i) => (
              <Reveal key={project.name} variant="fade-up" delay={Math.min(i, 4) * 0.05}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="work-row group"
                >
                  <span className="work-index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="work-title">{project.name}</span>
                  <span className="work-meta">
                    <span className="text-[var(--brand)]">{project.badge}</span>
                    <span>{project.tech.slice(0, 3).join(" · ")}</span>
                    <span className="hidden sm:inline">— {project.description.split("—")[0].split(":")[0].trim()}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal variant="fade-up" delay={0.2}>
            <div className="mt-12">
              <Link href="/projects" className="nav-link text-[var(--brand)] mono text-sm tracking-widest uppercase">
                ls ~/projects --all →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════ MARQUEE ═══════ */}
      <section className="py-10 border-y border-white/[0.04] overflow-hidden">
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

      {/* ═══════ 04 — ABOUT STATEMENT ═══════ */}
      <section className="mega-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-14">
              <span className="label-index">04</span>
              <span>The Operator</span>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={0.1}>
            <h2 className="display display-lg max-w-5xl mb-10">
              Find the repetitive, error-prone process.{" "}
              <span className="text-gradient-accent">Engineer it away.</span>
            </h2>
          </Reveal>
          <Reveal variant="fade-up" delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <p className="text-[var(--muted)] text-lg leading-relaxed">
                Eight production automations across IT, Finance, Analytics, and Marketing.
                Okta administrator. Site admin for Jira, Box, RingCentral, ClickUp, and Loom.
                LLM agents in daily company-wide use. Every tool documented, guarded, and
                built to outlive its author.
              </p>
              <div className="lg:text-right">
                <Link href="/about" className="nav-link text-[var(--brand)] mono text-sm tracking-widest uppercase">
                  Full Story →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════ 05 — INVERTED CONTACT FINALE ═══════ */}
      <section className="invert-section mega-section relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <Reveal variant="fade-up">
            <p className="mono text-xs tracking-[0.22em] uppercase invert-muted mb-10">
              // 05 — Contact
            </p>
          </Reveal>
          <Reveal variant="fade-up" delay={0.1}>
            <h2 className="display display-xl mb-16 max-w-5xl">
              Step into the pipeline. Let&apos;s connect.
            </h2>
          </Reveal>
          <Reveal variant="fade-up" delay={0.2}>
            <div className="flex flex-col items-start">
              <a href="mailto:fabcast03@gmail.com" className="invert-link">Email →</a>
              <a href="https://github.com/FCDevelopments" target="_blank" rel="noopener noreferrer" className="invert-link">GitHub →</a>
              <a href="https://linkedin.com/in/fcastaneda8" target="_blank" rel="noopener noreferrer" className="invert-link">LinkedIn →</a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
