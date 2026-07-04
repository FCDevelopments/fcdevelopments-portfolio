"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Reveal, CountUp } from "./motion";
import { WebGLShader } from "./ui/web-gl-shader";
import { GlowCard } from "./ui/spotlight-card";
import { LiquidButton } from "./ui/liquid-glass-button";

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
    kicker: "automate()",
    title: "Workflow Automation",
    copy: "Production pipelines that replace recurring manual work — scheduled, monitored, self-alerting. Stale inputs rejected, bad rows quarantined, failures page a human.",
    glow: "green" as const,
  },
  {
    kicker: "connect()",
    title: "Systems Integration",
    copy: "Data moved correctly between the platforms a business runs on — Jira, Salesforce, Box, RingCentral, Snowflake, Outlook — with rate-limit discipline and dedup by design.",
    glow: "blue" as const,
  },
  {
    kicker: "augment()",
    title: "AI & LLM Tooling",
    copy: "LLM agents wired into company data, speech-to-text pipelines that chew through 19 GB videos, AI reporters in daily company-wide use. Practical AI, not demos.",
    glow: "purple" as const,
  },
  {
    kicker: "operate()",
    title: "IT Operations",
    copy: "Okta administration, identity lifecycle, onboarding QC, site admin across five platforms. The discipline that makes automation safe to trust.",
    glow: "orange" as const,
  },
];

/** Splits text into words and reveals them with a stagger when scrolled into view. */
function WordReveal({ text, className = "", as: Tag = "h2" }: { text: string; className?: string; as?: "h1" | "h2" | "h3" | "p" }) {
  const ref = useRef<HTMLElement>(null);
  const [inview, setInview] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInview(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`word-reveal ${inview ? "is-inview" : ""} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="wr-word" aria-hidden="true">
          <span style={{ "--wr-delay": `${i * 0.055}s` } as React.CSSProperties}>{w}</span>
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}

/** Section wrapper that reports its background color to the scroll-bg controller. */
function BgSection({
  bg,
  onEnter,
  className = "",
  children,
}: {
  bg: string;
  onEnter: (bg: string) => void;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onEnter(bg);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [bg, onEnter]);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}

const HERO_BG = "#04060c";

export function HomeClient({ projects, skills }: { projects: Project[]; skills: string[] }) {
  const [ready, setReady] = useState(false);
  const [bg, setBg] = useState(HERO_BG);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main
      className={`scroll-bg text-[var(--foreground)] grain-overlay relative ${ready ? "kinetic-ready" : ""}`}
      style={{ backgroundColor: bg }}
    >
      {/* ═══════ HERO — WebGL shader + kinetic type ═══════ */}
      <BgSection bg={HERO_BG} onEnter={setBg} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <WebGLShader className="absolute inset-0 w-full h-full block opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#04060c]" />

        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 w-full pt-20">
          <div className="flex items-center gap-2 mb-8">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand)]" />
            </span>
            <p className="mono text-xs tracking-[0.22em] uppercase text-[var(--brand)]">
              Fabian Castaneda — IT Systems Engineer
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

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-8">
            <p className="text-lg lg:text-xl text-[var(--muted-strong)] max-w-xl leading-relaxed">
              Production automation for IT, finance, and operations — engineered to run
              unattended, fail loudly, and do the job correctly every single time.
            </p>
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/projects" aria-label="View the work">
                <LiquidButton className="text-white border border-white/25 rounded-full font-semibold" size="xl">
                  View the Work
                </LiquidButton>
              </Link>
              <a
                href="https://github.com/FCDevelopments"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link mono text-sm uppercase tracking-widest text-[var(--muted-strong)]"
              >
                GitHub →
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 mono text-[0.65rem] tracking-[0.3em] uppercase text-[var(--chrome-dim)] z-10">
          Scroll
        </div>
      </BgSection>

      {/* ═══════ 01 — CAPABILITIES (spotlight cards) ═══════ */}
      <BgSection bg="#061b12" onEnter={setBg} className="mega-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-6">
              <span className="label-index">01</span>
              <span>What I Do</span>
            </div>
          </Reveal>
          <WordReveal
            text="Design it. Build it. Let it run."
            className="display display-lg mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => (
              <Reveal key={cap.title} variant="fade-up" delay={i * 0.08}>
                <GlowCard glowColor={cap.glow} customSize className="w-full h-full min-h-[300px]">
                  <div className="glow-card-body">
                    <p className="mono text-xs text-[var(--brand)] mb-3">{cap.kicker}</p>
                    <h3 className="text-xl font-bold mb-3 text-white">{cap.title}</h3>
                    <p className="text-sm text-[var(--muted-strong)] leading-relaxed">{cap.copy}</p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </BgSection>

      {/* ═══════ 02 — RECEIPTS (bright light band) ═══════ */}
      <section className="light-band mega-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-6">
              <span className="label-index" style={{ color: "#059669" }}>02</span>
              <span>Receipts</span>
            </div>
          </Reveal>
          <WordReveal
            text="Numbers, not adjectives."
            className="display display-lg mb-14"
          />
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
                <p className="stat-number" style={{ color: "#059669" }}><CountUp target={30} suffix="+" /></p>
                <p className="stat-label">Hours Saved / Month</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════ 03 — THE WORK (giant type rows) ═══════ */}
      <BgSection bg="#0a1224" onEnter={setBg} className="mega-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-6">
              <span className="label-index">03</span>
              <span>The Work</span>
            </div>
          </Reveal>
          <WordReveal
            text="Built. Shipped. Running."
            className="display display-lg mb-14"
          />

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
      </BgSection>

      {/* ═══════ MARQUEE ═══════ */}
      <section className="py-10 border-y border-white/[0.06] overflow-hidden">
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

      {/* ═══════ 04 — THE OPERATOR ═══════ */}
      <BgSection bg="#150b26" onEnter={setBg} className="mega-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-6">
              <span className="label-index" style={{ color: "#fbbf24" }}>04</span>
              <span>The Operator</span>
            </div>
          </Reveal>
          <WordReveal
            text="Find the repetitive, error-prone process. Engineer it away."
            className="display display-lg max-w-5xl mb-10"
          />
          <Reveal variant="fade-up" delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <p className="text-[var(--muted-strong)] text-lg leading-relaxed">
                Eight production automations across IT, Finance, Analytics, and Marketing.
                Okta administrator. Site admin for Jira, Box, RingCentral, ClickUp, and Loom.
                LLM agents in daily company-wide use. Every tool documented, guarded, and
                built to outlive its author —{" "}
                <span className="text-gradient-warm font-semibold">precision is the brand.</span>
              </p>
              <div className="lg:text-right">
                <Link href="/about" className="nav-link text-[var(--brand)] mono text-sm tracking-widest uppercase">
                  Full Story →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </BgSection>

      {/* ═══════ 05 — INVERTED CONTACT FINALE ═══════ */}
      <section className="invert-section mega-section relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <Reveal variant="fade-up">
            <p className="mono text-xs tracking-[0.22em] uppercase invert-muted mb-10">
              // 05 — Contact
            </p>
          </Reveal>
          <WordReveal
            text="Step into the pipeline. Let's connect."
            className="display display-xl mb-16 max-w-5xl"
          />
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
