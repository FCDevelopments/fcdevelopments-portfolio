"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Reveal } from "./motion";

type Project = {
  name: string;
  summary: string;
  tech: string[];
  badge: string;
  link: string;
  github: string;
  stars?: number;
  featured?: boolean;
  source?: "github" | "manual";
};

/** Word-stagger headline reveal (shared pattern with home). */
function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
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
    <h2 ref={ref} className={`word-reveal ${inview ? "is-inview" : ""} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="wr-word" aria-hidden="true">
          <span style={{ "--wr-delay": `${i * 0.055}s` } as React.CSSProperties}>{w}</span>
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </h2>
  );
}

/** Scroll-reactive background section (shared pattern with home). */
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
      { threshold: 0.3 }
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

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const [bg, setBg] = useState(HERO_BG);
  const production = projects.filter((p) => p.badge === "Production");
  const rest = projects.filter((p) => p.badge !== "Production");

  return (
    <main className="scroll-bg text-[var(--foreground)] grain-overlay relative" style={{ backgroundColor: bg }}>
      {/* ═══════ HEADER ═══════ */}
      <BgSection bg={HERO_BG} onEnter={setBg} className="hero-surface relative pt-28 pb-16 overflow-hidden">
        <div className="orb orb-accent w-[400px] h-[400px] top-[-10%] right-[10%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <div className="section-label mb-8">
            <span className="label-index">ls</span>
            <span>~/projects --all</span>
          </div>
          <h1 className="display display-hero mb-8">
            The <span className="text-gradient-accent">Work.</span>
          </h1>
          <p className="text-lg text-[var(--muted-strong)] max-w-2xl leading-relaxed">
            Production automations that ran real workloads — scrubbed of company data and
            published as ready-to-fork templates — plus tooling and product experiments.
            Synced live from GitHub.
          </p>
        </div>
      </BgSection>

      {/* ═══════ 01 — PRODUCTION (editorial rows) ═══════ */}
      <BgSection bg="#061b12" onEnter={setBg} className="mega-section !pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-6">
              <span className="label-index">01</span>
              <span>Production Automations</span>
            </div>
          </Reveal>
          <WordReveal text="Ran the real thing. Fork the template." className="display display-lg mb-14 max-w-4xl" />

          <div>
            {production.map((project, i) => (
              <Reveal key={project.name} variant="fade-up" delay={Math.min(i, 4) * 0.04}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="work-row group"
                >
                  <span className="work-index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="work-title !text-[clamp(1.7rem,4.8vw,3.8rem)]">{project.name}</span>
                  <div className="mt-3 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 lg:gap-10 items-start">
                    <p className="text-[var(--muted)] text-sm leading-relaxed max-w-3xl">{project.summary}</p>
                    <p className="mono text-[0.7rem] tracking-wider uppercase text-[var(--chrome-dim)] lg:text-right whitespace-nowrap pt-1">
                      {project.tech.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </BgSection>

      {/* ═══════ 02 — TOOLING & PRODUCTS (light band grid) ═══════ */}
      <section className="light-band mega-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-6">
              <span className="label-index" style={{ color: "#059669" }}>02</span>
              <span>Tooling & Products</span>
            </div>
          </Reveal>
          <WordReveal text="The rest of the shelf." className="display display-lg mb-14" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {rest.map((project, i) => (
              <Reveal key={project.name} variant="fade-up" delay={Math.min(i, 5) * 0.05}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tool-card group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold leading-snug flex-1">{project.name}</h3>
                    <span className="mono text-[0.62rem] tracking-wider uppercase px-2.5 py-1 rounded-full border border-emerald-700/30 text-emerald-700 bg-emerald-600/5 whitespace-nowrap">
                      {project.badge}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#4a5568] mb-4 flex-1">{project.summary}</p>
                  <p className="mono text-[0.68rem] tracking-wider uppercase text-[#8a93a6]">
                    {project.tech.slice(0, 3).join(" · ")}
                    <span className="float-right text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">GitHub →</span>
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <BgSection bg="#150b26" onEnter={setBg} className="mega-section text-center relative overflow-hidden">
        <div className="orb orb-accent w-[500px] h-[500px] bottom-[-30%] right-[20%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <WordReveal text="Want the full context behind any of these?" className="display display-lg mb-10 mx-auto max-w-4xl" />
          <Reveal variant="fade-up" delay={0.15}>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://github.com/FCDevelopments" target="_blank" rel="noopener noreferrer" className="button-primary">
                GitHub Profile
              </a>
              <a href="mailto:fabcast03@gmail.com" className="button-secondary">Email Me</a>
            </div>
          </Reveal>
        </div>
      </BgSection>
    </main>
  );
}
