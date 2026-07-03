"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal, CountUp } from "./motion";

const experience = [
  {
    role: "IT Services Specialist",
    company: "Smart Circle International — Newport Beach, CA",
    period: "Apr 2026 – Present",
    bullets: [
      "Design and run 8 production automations spanning lifecycle automation, ticket reporting, expense processing, asset reconciliation, and media transcription.",
      "Spearhead company AI initiatives: an LLM agent integrated with Salesforce, semantic models, and automated AI reporters in daily company-wide use.",
      "Administer Okta provisioning and application assignment; site administrator for Jira, Box, ClickUp, RingCentral, and Loom.",
      "Defined the team-wide standard stack for internal web apps — React + TypeScript, Node.js/Express, Entra ID OAuth2/OIDC SSO, Docker.",
    ],
  },
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
    title: "Fail Loudly, Never Silently",
    copy: "Good automation assumes things will go wrong. Stale inputs get rejected, bad rows get quarantined, and failures alert a human — a silent wrong answer is worse than a loud crash.",
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
        <div className="orb orb-accent w-[400px] h-[400px] top-[0%] left-[20%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal variant="fade-right">
                <p className="eyebrow mb-4">About</p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] mb-6">
                  Fabian<br />
                  <span className="text-gradient-accent">Castaneda.</span>
                </h1>
                <p className="text-lg text-[var(--muted)] leading-relaxed mb-4">
                  IT systems engineer in Orange County, California. I specialize in workflow
                  automation and internal tooling: 8 production automations built in Python,
                  Node.js, and PowerShell that replaced manual, ticket-driven work across IT,
                  Finance, Analytics, and Marketing — plus AI/LLM agents in daily company-wide use.
                </p>
                <p className="text-[var(--muted)] leading-relaxed mb-4">
                  The pattern behind all of it: find the repetitive, error-prone process, understand
                  why it breaks, then engineer it away — with stale-input guards, quarantine queues
                  for bad data, offline test suites, and alerting that pages a human before anyone
                  notices something broke.
                </p>
                <p className="text-[var(--muted)] leading-relaxed">
                  FCDevelopments is where that work shows up publicly — real implementations,
                  genericized into templates anyone can fork and run.
                </p>
              </Reveal>
            </div>
            <Reveal variant="fade-left" delay={0.2}>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 card-chrome">
                  <p className="stat-number text-3xl"><CountUp target={3} /></p>
                  <p className="stat-label">Years in IT</p>
                </div>
                <div className="text-center p-6 card-chrome">
                  <p className="stat-number text-3xl"><CountUp target={8} /></p>
                  <p className="stat-label">Automations in Prod</p>
                </div>
                <div className="text-center p-6 card-chrome">
                  <p className="stat-number text-3xl text-gradient-accent">1</p>
                  <p className="stat-label">Gold Medal</p>
                </div>
                <div className="text-center p-6 card-chrome">
                  <p className="stat-number text-3xl"><CountUp target={17} suffix="+" /></p>
                  <p className="stat-label">Public Repos</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="divider-accent mx-auto max-w-xl" />

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

      <div className="divider-accent mx-auto max-w-xl" />

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
        <div className="orb orb-accent w-[500px] h-[500px] bottom-[-20%] left-[30%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <Reveal variant="scale-in">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Let&apos;s build something <span className="text-gradient-accent">together.</span>
            </h2>
            <p className="text-[var(--muted)] text-lg max-w-lg mx-auto mb-10">
              Browse the production work or reach out directly.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/projects" className="button-primary">View Projects</Link>
              <a href="mailto:fabcast03@gmail.com" className="button-secondary">Email Me</a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
