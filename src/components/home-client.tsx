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
};

const badgeColors: Record<string, string> = {
  Flagship: "bg-amber-500/15 border-amber-400/30 text-amber-300",
  "AI Platform": "bg-purple-500/15 border-purple-400/30 text-purple-300",
  "Gold Medal": "bg-yellow-500/15 border-yellow-400/30 text-yellow-200",
  Operations: "bg-cyan-500/15 border-cyan-400/30 text-cyan-300",
};

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
      {/* Cursor glow follower */}
      <div ref={cursorRef} className="cursor-glow hidden lg:block" />

      {/* ═══════ HERO ═══════ */}
      <section className="hero-surface relative min-h-[90vh] flex items-center">
        <div className="orb orb-gold w-[400px] h-[400px] top-[10%] right-[5%]" />
        <div className="orb orb-warm w-[300px] h-[300px] bottom-[20%] left-[10%]" style={{ animationDelay: "3s" }} />

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32 relative z-10 w-full">
          <div className="max-w-4xl">
            <Reveal variant="fade-up" delay={0.1}>
              <p className="eyebrow mb-6">FCDevelopments</p>
            </Reveal>

            <Reveal variant="fade-up" delay={0.2}>
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6">
                <span className="text-[var(--foreground)]">Build your </span>
                <span className="text-gradient-gold">career</span>
                <br />
                <span className="text-[var(--foreground)]">with precision.</span>
              </h1>
            </Reveal>

            <Reveal variant="fade-up" delay={0.4}>
              <p className="text-lg lg:text-xl text-[var(--muted)] max-w-2xl mb-10 leading-relaxed">
                Free, privacy-first resume builder and developer tools.
                Crafted by Fabian Castaneda in Orange County, CA.
                No accounts. No tracking. Just tools that work.
              </p>
            </Reveal>

            <Reveal variant="fade-up" delay={0.55}>
              <div className="flex flex-wrap gap-4">
                <MagneticWrap>
                  <Link href="/resume-builder" className="button-primary">
                    Launch Resume Builder
                  </Link>
                </MagneticWrap>
                <MagneticWrap>
                  <Link href="/projects" className="button-secondary">
                    View Projects
                  </Link>
                </MagneticWrap>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <section className="relative z-10 border-y border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Reveal variant="fade-up" delay={0}>
              <div className="text-center">
                <p className="stat-number"><CountUp target={6} suffix="+" /></p>
                <p className="stat-label">Projects Shipped</p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={0.1}>
              <div className="text-center">
                <p className="stat-number"><CountUp target={2} suffix="+" /></p>
                <p className="stat-label">Years Experience</p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={0.2}>
              <div className="text-center">
                <p className="stat-number"><CountUp target={15} suffix="+" /></p>
                <p className="stat-label">Technologies</p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={0.3}>
              <div className="text-center">
                <p className="stat-number text-gradient-gold">1</p>
                <p className="stat-label">SkillsUSA Gold Medal</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════ RESUME BUILDER CTA ═══════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="orb orb-gold w-[500px] h-[500px] top-[-10%] left-[30%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal variant="fade-right">
                <p className="eyebrow mb-4">Flagship Product</p>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
                  ATS-friendly resumes.{" "}
                  <span className="text-gradient-gold">Zero friction.</span>
                </h2>
                <p className="text-[var(--muted)] text-lg leading-relaxed mb-8">
                  Upload your content, pick a template, preview in real-time, and export a clean PDF.
                  Everything runs in your browser — your data never leaves your machine.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/resume-builder" className="button-primary">
                    Try It Free
                  </Link>
                  <Link href="/projects" className="button-secondary">
                    Learn More
                  </Link>
                </div>
              </Reveal>
            </div>
            <Reveal variant="scale-in" delay={0.2}>
              <div className="card-premium p-8 relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-3 bg-white/10 rounded-full w-3/4" />
                  <div className="h-3 bg-white/10 rounded-full w-full" />
                  <div className="h-3 bg-white/10 rounded-full w-5/6" />
                  <div className="h-3 bg-[var(--brand)]/20 rounded-full w-2/3 mt-6" />
                  <div className="h-3 bg-white/10 rounded-full w-full" />
                  <div className="h-3 bg-white/10 rounded-full w-4/5" />
                  <div className="h-3 bg-white/10 rounded-full w-3/4" />
                  <div className="h-3 bg-[var(--brand)]/20 rounded-full w-1/2 mt-6" />
                  <div className="h-3 bg-white/10 rounded-full w-full" />
                  <div className="h-3 bg-white/10 rounded-full w-5/6" />
                </div>
                <div className="mt-8 flex gap-3">
                  <div className="px-4 py-2 rounded bg-[var(--brand)]/20 border border-[var(--brand)]/30 text-[var(--brand)] text-xs font-semibold">ATS-Safe</div>
                  <div className="px-4 py-2 rounded bg-white/5 border border-white/10 text-[var(--muted)] text-xs font-semibold">Private</div>
                  <div className="px-4 py-2 rounded bg-white/5 border border-white/10 text-[var(--muted)] text-xs font-semibold">Export PDF</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════ DIVIDER ═══════ */}
      <div className="divider-gold mx-auto max-w-xl" />

      {/* ═══════ PROJECTS ═══════ */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="eyebrow mb-4">Portfolio</p>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Selected Work</h2>
              </div>
              <Link href="/projects" className="nav-link text-[var(--brand)] hidden sm:block">
                View All →
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => {
              const colorClass = badgeColors[project.badge] || "bg-white/5 border-white/10 text-white/60";
              return (
                <Reveal key={project.name} variant="fade-up" delay={i * 0.1}>
                  <Link href={project.link} className="block project-showcase group h-full">
                    <div className="project-image">
                      <span className="text-4xl opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                        {project.badge === "Flagship" && "◆"}
                        {project.badge === "AI Platform" && "⬡"}
                        {project.badge === "Gold Medal" && "★"}
                        {project.badge === "Operations" && "⌘"}
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
                          <span key={t} className="px-2.5 py-1 rounded text-[0.7rem] bg-white/[0.03] border border-white/[0.06] text-[var(--chrome-dim)]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
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
                className="text-sm font-medium text-[var(--chrome-dim)] uppercase tracking-widest"
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
                <span className="text-gradient-gold">Castaneda.</span>
              </h2>
              <p className="text-[var(--muted)] text-lg leading-relaxed mb-4">
                IT Professional and Software Developer based in Orange County, CA.
                Building practical tools that solve real problems — from AI-powered
                development platforms to privacy-first career tools.
              </p>
              <p className="text-[var(--muted)] leading-relaxed mb-8">
                Currently focused on OpenClaw AI and the FCDevelopments ecosystem.
                Background in IT administration, systems support, and identity management.
              </p>
              <Link href="/about" className="nav-link text-[var(--brand)] text-sm">
                My Story →
              </Link>
            </Reveal>

            <Reveal variant="fade-left" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <div className="card-chrome p-6">
                  <p className="text-[var(--brand)] text-sm font-semibold uppercase tracking-wider mb-2">Current</p>
                  <h3 className="text-lg font-bold mb-1">AI &amp; Dev</h3>
                  <p className="text-sm text-[var(--muted)]">OpenClaw, Claude AI, MCP Servers</p>
                </div>
                <div className="card-chrome p-6">
                  <p className="text-[var(--brand)] text-sm font-semibold uppercase tracking-wider mb-2">Products</p>
                  <h3 className="text-lg font-bold mb-1">Web Apps</h3>
                  <p className="text-sm text-[var(--muted)]">Next.js, React, Tailwind</p>
                </div>
                <div className="card-chrome p-6">
                  <p className="text-[var(--brand)] text-sm font-semibold uppercase tracking-wider mb-2">Background</p>
                  <h3 className="text-lg font-bold mb-1">IT Ops</h3>
                  <p className="text-sm text-[var(--muted)]">Okta, Azure AD, Systems</p>
                </div>
                <div className="card-chrome p-6">
                  <p className="text-[var(--brand)] text-sm font-semibold uppercase tracking-wider mb-2">Award</p>
                  <h3 className="text-lg font-bold mb-1">SkillsUSA</h3>
                  <p className="text-sm text-[var(--muted)]">CA Regional Gold Medal</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="orb orb-gold w-[600px] h-[600px] bottom-[-20%] right-[10%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 text-center">
          <Reveal variant="scale-in">
            <p className="eyebrow mb-6">Get Started</p>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Ready to build your
              <br />
              <span className="text-gradient-gold">next move?</span>
            </h2>
            <p className="text-[var(--muted)] text-lg max-w-xl mx-auto mb-10">
              Create a polished, ATS-friendly resume in minutes.
              Free, private, and built to get you hired.
            </p>
            <MagneticWrap className="inline-block">
              <Link href="/resume-builder" className="button-primary text-lg px-8 py-4">
                Launch Resume Builder
              </Link>
            </MagneticWrap>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
