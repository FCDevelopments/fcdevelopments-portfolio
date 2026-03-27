"use client";

import Link from "next/link";
import { Reveal } from "./motion";

type Project = {
  name: string;
  summary: string;
  tech: string[];
  badge: string;
  link: string;
  github: string;
};

const badgeColors: Record<string, string> = {
  Flagship: "bg-amber-500/15 border-amber-400/30 text-amber-300",
  "AI Platform": "bg-purple-500/15 border-purple-400/30 text-purple-300",
  "Gold Medal": "bg-yellow-500/15 border-yellow-400/30 text-yellow-200",
  Operations: "bg-cyan-500/15 border-cyan-400/30 text-cyan-300",
  Template: "bg-green-500/15 border-green-400/30 text-green-300",
  Utility: "bg-pink-500/15 border-pink-400/30 text-pink-300",
};

export function ProjectsClient({ projects }: { projects: Project[] }) {
  return (
    <main className="bg-[var(--background)] grain-overlay relative">
      {/* Header */}
      <section className="py-24 relative overflow-hidden">
        <div className="orb orb-gold w-[400px] h-[400px] top-[-10%] right-[10%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <Reveal variant="fade-up">
            <p className="eyebrow mb-4">Portfolio</p>
          </Reveal>
          <Reveal variant="fade-up" delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] mb-6">
              Selected{" "}
              <span className="text-gradient-gold">Work.</span>
            </h1>
          </Reveal>
          <Reveal variant="fade-up" delay={0.2}>
            <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
              Products and tools focused on workflow improvement, AI automation, and practical software that solves real problems.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="divider-gold mx-auto max-w-xl" />

      {/* Projects Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => {
              const colorClass = badgeColors[project.badge] || "bg-white/5 border-white/10 text-white/60";
              return (
                <Reveal key={project.name} variant="fade-up" delay={i * 0.08}>
                  <article className="card-premium group h-full flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h2 className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--brand)] transition-colors duration-300 flex-1">
                        {project.name}
                      </h2>
                      <span className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold whitespace-nowrap border ${colorClass}`}>
                        {project.badge}
                      </span>
                    </div>
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-5 flex-1">{project.summary}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-2.5 py-1 rounded text-[0.7rem] bg-white/[0.03] border border-white/[0.06] text-[var(--chrome-dim)]">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
                      <Link
                        href={project.link}
                        className="flex-1 px-3 py-2.5 rounded-lg bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] hover:bg-[var(--brand)]/20 transition-all text-center text-sm font-semibold"
                      >
                        View
                      </Link>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/[0.06] transition-all text-center text-sm font-semibold"
                      >
                        GitHub
                      </a>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
