"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal, CountUp } from "./motion";

const experience = [
  {
    role: "Junior IT Administrator",
    company: "OMTech — Santa Ana, CA",
    period: "Mar 2025 – Feb 2026",
    bullets: [
      "Managed MDM infrastructure across 120+ endpoints using Kandji and Azure AD, reducing provisioning time by 40%.",
      "Built Python automation tools that identified critical ERP data discrepancies, saving operations 15+ hours per month.",
      "Administered surveillance and physical security systems across two warehouse facilities.",
      "Maintained Okta SSO/MFA configurations and automated onboarding/offboarding workflows for 80+ employees.",
    ],
  },
  {
    role: "IT Support Engineer",
    company: "Quantum ePay — Anaheim, CA",
    period: "Aug 2023 – Jul 2024",
    bullets: [
      "Resolved 40+ daily L2/L3 tickets spanning networking, POS hardware, and payment processing systems.",
      "Configured and encrypted 200+ Verifone/Ingenico payment terminals for PCI-DSS compliance.",
      "Managed client onboarding and terminal deployment for 100+ merchant accounts nationwide.",
      "Created internal documentation and runbooks that reduced average ticket resolution time by 25%.",
    ],
  },
];

const values = [
  {
    title: "Precision First",
    copy: "Every tool should work exactly as expected. No guesswork, no ambiguity, no wasted time. I obsess over the details so users don't have to.",
  },
  {
    title: "Privacy by Default",
    copy: "User data stays with the user. No tracking, no accounts required, no compromises. Every product I build treats privacy as a core feature, not an afterthought.",
  },
  {
    title: "Ship Real Products",
    copy: "Ideas are cheap. I believe in shipping products that solve actual problems for real people — then iterating based on what the world tells you.",
  },
];

const interests = [
  { icon: "/images/hiking.svg", label: "Hiking", description: "Exploring trails across Southern California" },
  { icon: "/images/muaythai.svg", label: "Muay Thai", description: "Training discipline and mental toughness" },
  { icon: "/images/dog.svg", label: "My Dog", description: "Best co-pilot for every adventure", className: "pb-8" },
  { icon: "/images/friends.svg", label: "Friends", description: "Building memories with great people" },
  { icon: "/images/code.svg", label: "Future Tech", description: "Developing tech with real-world impact" },
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
                  Operations-ready IT professional based in Cerritos, California, specializing in
                  cybersecurity, identity &amp; access management, and AI-integrated systems. I bring
                  hands-on experience managing endpoint infrastructure, Okta/Azure AD environments,
                  and security operations — combined with the ability to build the automation tools
                  that make those systems actually run well.
                </p>
                <p className="text-[var(--muted)] leading-relaxed mb-4">
                  My focus right now is the intersection of traditional IT ops and AI integration:
                  building tooling that automates repetitive security workflows, improves operational
                  visibility, and closes the gap between what enterprise IT systems can do and what
                  they actually do in practice.
                </p>
                <p className="text-[var(--muted)] leading-relaxed">
                  FCDevelopments is where that work shows up publicly — practical tools, real implementations,
                  and a track record of shipping things that work.
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
                  <p className="stat-label">Projects Built</p>
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
                <div className="card-chrome">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="md:w-1/3 shrink-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-1">{item.period}</p>
                      <h3 className="text-lg font-bold">{item.role}</h3>
                      <p className="text-sm text-[var(--muted)]">{item.company}</p>
                    </div>
                    <ul className="md:w-2/3 space-y-2">
                      {item.bullets.map((b, bi) => (
                        <li key={bi} className="text-[var(--muted)] text-sm leading-relaxed flex gap-2">
                          <span className="text-[var(--brand)] mt-1 shrink-0">-</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal variant="fade-up" delay={0.2}>
              <div className="card-chrome">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="md:w-1/3 shrink-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-1">Jan 2025 – May 2027</p>
                    <h3 className="text-lg font-bold">Associate of Science in Computer Science</h3>
                    <p className="text-sm text-[var(--muted)]">Irvine Valley College — Irvine, CA</p>
                  </div>
                  <ul className="md:w-2/3 space-y-2">
                    <li className="text-[var(--muted)] text-sm leading-relaxed flex gap-2">
                      <span className="text-[var(--brand)] mt-1 shrink-0">-</span>
                      <span>Computer Science coursework focused on programming fundamentals, systems thinking, and practical application development.</span>
                    </li>
                    <li className="text-[var(--muted)] text-sm leading-relaxed flex gap-2">
                      <span className="text-[var(--brand)] mt-1 shrink-0">-</span>
                      <span>SkillsUSA California Regional Gold Medal — Web Design &amp; Development.</span>
                    </li>
                    <li className="text-[var(--muted)] text-sm leading-relaxed flex gap-2">
                      <span className="text-[var(--brand)] mt-1 shrink-0">-</span>
                      <span>Building a stronger foundation in software, automation, and production-ready web application development.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="divider-gold mx-auto max-w-xl" />

      {/* Beyond the Code */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <p className="eyebrow mb-4">Beyond the Code</p>
            <h2 className="text-4xl font-bold tracking-tight mb-4">What Drives Me.</h2>
            <p className="text-[var(--muted)] text-lg leading-relaxed mb-12 max-w-2xl">
              When I&apos;m not building software, you&apos;ll find me pushing limits — on a trail,
              in the ring, or working on ideas that bring emerging tech closer to everyday life.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {interests.map((item, i) => (
              <Reveal key={item.label} variant="fade-up" delay={i * 0.08}>
                <div className={`card-chrome text-center p-4 group hover:border-[var(--brand)]/30 transition-all duration-300 ${item.className ?? ""}`}>
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={36}
                    height={36}
                    className="mx-auto mb-4 opacity-60 group-hover:opacity-90 transition-opacity duration-300"
                  />
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">{item.label}</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            ))}
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
