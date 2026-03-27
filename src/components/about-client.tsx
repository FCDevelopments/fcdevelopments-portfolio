"use client";

import Link from "next/link";
import { Reveal, CountUp } from "./motion";

const experience = [
  {
    role: "Junior IT Administrator",
    company: "OMTech — Santa Ana, CA",
    period: "Feb 2025 – Jan 2026",
    description: "Managed IT operations, MDM infrastructure, surveillance systems, and automation. Built Python tools that identified critical ERP issues.",
  },
  {
    role: "IT Support Engineer",
    company: "Quantum ePay — Anaheim, CA",
    period: "Aug 2023 – Jul 2024",
    description: "Resolved 40+ daily L2/L3 tickets. Configured payment terminals for 100+ clients. Managed encryption of 200+ devices.",
  },
];

const values = [
  {
    title: "Precision First",
    copy: "Every tool should work exactly as expected. No guesswork, no ambiguity, no wasted time.",
  },
  {
    title: "Privacy by Default",
    copy: "User data stays with the user. No tracking, no accounts required, no compromises.",
  },
  {
    title: "Ship Real Products",
    copy: "Ideas are cheap. Shipped products that solve actual problems are what matter.",
  },
];

export function AboutClient() {
  return (
    <main className="bg-[var(--background)] grain-overlay relative">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="orb orb-gold w-[400px] h-[400px] top-[0%] left-[20%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal variant="fade-right">
                <p className="eyebrow mb-4">About</p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] mb-6">
                  Fabian<br />
                  <span className="text-gradient-gold">Castaneda.</span>
                </h1>
                <p className="text-lg text-[var(--muted)] leading-relaxed mb-4">
                  IT Professional and Software Developer based in Orange County, CA.
                  Building practical tools that solve real problems.
                </p>
                <p className="text-[var(--muted)] leading-relaxed">
                  Currently co-developing OpenClaw — an AI-powered development platform using Claude AI —
                  and building the FCDevelopments ecosystem of career and workflow tools.
                </p>
              </Reveal>
            </div>
            <Reveal variant="fade-left" delay={0.2}>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 card-chrome">
                  <p className="stat-number text-3xl"><CountUp target={2} suffix="+" /></p>
                  <p className="stat-label">Years in IT</p>
                </div>
                <div className="text-center p-6 card-chrome">
                  <p className="stat-number text-3xl"><CountUp target={6} suffix="+" /></p>
                  <p className="stat-label">Projects</p>
                </div>
                <div className="text-center p-6 card-chrome">
                  <p className="stat-number text-3xl text-gradient-gold">1</p>
                  <p className="stat-label">Gold Medal</p>
                </div>
                <div className="text-center p-6 card-chrome">
                  <p className="stat-number text-3xl"><CountUp target={3} /></p>
                  <p className="stat-label">AI Projects</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="divider-gold mx-auto max-w-xl" />

      {/* Philosophy */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <p className="eyebrow mb-4">Philosophy</p>
            <h2 className="text-4xl font-bold tracking-tight mb-12">How I Build.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <Reveal key={value.title} variant="fade-up" delay={i * 0.1}>
                <div className="card-premium h-full">
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-3">{value.title}</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{value.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <p className="eyebrow mb-4">Experience</p>
            <h2 className="text-4xl font-bold tracking-tight mb-12">Background.</h2>
          </Reveal>
          <div className="space-y-6">
            {experience.map((item, i) => (
              <Reveal key={item.role} variant="fade-up" delay={i * 0.1}>
                <div className="card-chrome flex flex-col md:flex-row md:items-start gap-6">
                  <div className="md:w-1/3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-1">{item.period}</p>
                    <h3 className="text-lg font-bold">{item.role}</h3>
                    <p className="text-sm text-[var(--muted)]">{item.company}</p>
                  </div>
                  <p className="text-[var(--muted)] text-sm leading-relaxed md:w-2/3">{item.description}</p>
                </div>
              </Reveal>
            ))}
            <Reveal variant="fade-up" delay={0.2}>
              <div className="card-chrome flex flex-col md:flex-row md:items-start gap-6">
                <div className="md:w-1/3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-1">Dec 2024 – May 2026</p>
                  <h3 className="text-lg font-bold">Associate of Science</h3>
                  <p className="text-sm text-[var(--muted)]">Irvine Valley College</p>
                </div>
                <p className="text-[var(--muted)] text-sm leading-relaxed md:w-2/3">
                  GPA: 3.6/4.0. Coursework in Java, C Programming, Computer Information Management. Strong foundation in computer science and systems thinking.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="orb orb-gold w-[500px] h-[500px] bottom-[-20%] left-[30%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <Reveal variant="scale-in">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Let&apos;s build something <span className="text-gradient-gold">together.</span>
            </h2>
            <p className="text-[var(--muted)] text-lg max-w-lg mx-auto mb-10">
              Check out my projects or try the resume builder.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/resume-builder" className="button-primary">Resume Builder</Link>
              <Link href="/projects" className="button-secondary">View Projects</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
