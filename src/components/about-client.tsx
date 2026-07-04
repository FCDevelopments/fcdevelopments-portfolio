"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Reveal, CountUp } from "./motion";
import { GlowCard } from "./ui/spotlight-card";

const experience = [
  {
    role: "IT Services Specialist",
    company: "Smart Circle International",
    location: "Newport Beach, CA",
    period: "2026 — Now",
    bullets: [
      "Design and run 8 production automations spanning lifecycle automation, ticket reporting, expense processing, asset reconciliation, and media transcription.",
      "Spearhead company AI initiatives: an LLM agent integrated with Salesforce, semantic models, and automated AI reporters in daily company-wide use.",
      "Administer Okta provisioning and application assignment; site administrator for Jira, Box, ClickUp, RingCentral, and Loom.",
      "Defined the team-wide standard stack for internal web apps — React + TypeScript, Node.js/Express, Entra ID OAuth2/OIDC SSO, Docker.",
    ],
  },
  {
    role: "IT Administrator",
    company: "OMTech",
    location: "Santa Ana, CA",
    period: "2025 — 2026",
    bullets: [
      "Sole IT owner: established MDM/MAM infrastructure across 50+ devices and managed the full device lifecycle for onboarding and offboarding.",
      "Built a monitoring tool that surfaced a critical ERP defect corrupting customer-support data — presented findings to the CEO, driving a vendor fix.",
      "Created Zendesk macros and data-extraction automations that streamlined the after-call workflow by more than 30%.",
    ],
  },
  {
    role: "IT Support Engineer",
    company: "Quantum ePay",
    location: "Anaheim, CA",
    period: "2023 — 2024",
    bullets: [
      "Resolved 40+ daily Tier 2/3 tickets spanning networks, payment terminals, and web platforms.",
      "Oversaw E2EE and tokenization across 200+ payment devices at 100% security-standard compliance.",
      "Configured and deployed payment terminals and gateways for 100+ clients nationwide.",
    ],
  },
  {
    role: "Desktop Technician",
    company: "Cornerstone Marketing Concepts",
    location: "Cerritos, CA",
    period: "2021 — 2022",
    bullets: [
      "Performed weekly field repairs and replacements on Dell and HP laptops and desktops — motherboards, palm rests, keyboards, LCDs, batteries, power supplies, drives, RAM, and graphics cards.",
      "Managed a full daily repair schedule across diverse customer sites, holding a 95% satisfaction rate through timely repairs and support.",
      "Trained colleagues on break/fix procedures so the whole team could deliver consistent hardware support.",
    ],
  },
  {
    role: "A.S. Computer Science",
    company: "Irvine Valley College",
    location: "Irvine, CA",
    period: "2025 — 2027",
    bullets: [
      "SkillsUSA California Regional Gold Medal — Web Design & Development.",
      "Google Foundations of Cybersecurity Certificate — Python, Bash, SQL, Linux, SIEM.",
    ],
  },
];

const principles = [
  {
    kicker: "precision()",
    title: "Precision First",
    copy: "Every tool should work exactly as expected. No guesswork, no ambiguity, no wasted time. I obsess over the details so users don't have to.",
    glow: "green" as const,
  },
  {
    kicker: "failLoudly()",
    title: "Fail Loudly, Never Silently",
    copy: "Good automation assumes things will go wrong. Stale inputs get rejected, bad rows get quarantined, and failures alert a human — a silent wrong answer is worse than a loud crash.",
    glow: "orange" as const,
  },
  {
    kicker: "ship()",
    title: "Ship Real Products",
    copy: "Ideas are cheap. I ship tools that solve actual problems for real people — then iterate based on what production tells me.",
    glow: "blue" as const,
  },
];

const interests = [
  { label: "Hiking", note: "SoCal trails, early starts", photo: "/images/int-hiking-v2.jpg" },
  { label: "Muay Thai", note: "discipline under pressure", photo: "/images/int-muaythai-v2.jpg" },
  { label: "Fishing", note: "quiet water, clear head", photo: "/images/int-fishing-v2.jpg" },
  { label: "Guitar", note: "strings after hours", photo: "/images/int-guitar-v2.jpg" },
  { label: "My Dog", note: "chief morale officer", photo: "/images/int-dog-v2.jpg" },
  { label: "Good People", note: "build memories, not just systems", photo: "/images/int-friends-v2.jpg" },
  { label: "Emerging Tech", note: "tools with real-world impact", photo: "/images/int-tech-v2.jpg" },
];

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
      { threshold: 0.35 }
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

export function AboutClient() {
  const [bg, setBg] = useState(HERO_BG);

  return (
    <main className="scroll-bg text-[var(--foreground)] grain-overlay relative" style={{ backgroundColor: bg }}>
      {/* ═══════ HERO ═══════ */}
      <BgSection bg={HERO_BG} onEnter={setBg} className="hero-surface relative pt-28 pb-20 overflow-hidden">
        <div className="orb orb-accent w-[400px] h-[400px] top-[0%] right-[10%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <div className="section-label mb-8">
            <span className="label-index">whoami</span>
            <span>The Operator</span>
          </div>
          <h1 className="display display-hero mb-12">
            Fabian
            <br />
            <span className="text-gradient-accent">Castaneda.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-14 items-start">
            <div>
              <p className="text-lg lg:text-xl text-[var(--muted-strong)] leading-relaxed mb-5 max-w-2xl">
                IT systems engineer in Orange County, California. I specialize in workflow
                automation and internal tooling: 8 production automations in Python, Node.js,
                and PowerShell that replaced manual, ticket-driven work across IT, Finance,
                Analytics, and Marketing — plus AI/LLM agents in daily company-wide use.
              </p>
              <p className="text-[var(--muted)] leading-relaxed max-w-2xl">
                The pattern behind all of it: find the repetitive, error-prone process,
                understand why it breaks, then engineer it away. FCDevelopments is where that
                work shows up publicly — real implementations, published as templates anyone
                can fork and run.
              </p>
            </div>

            <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0 lg:max-w-none w-full">
              <div className="hero-portrait">
                <Image
                  src="/images/hero-fabian-v2.jpg"
                  alt="Fabian Castaneda"
                  width={548}
                  height={700}
                  priority
                  className="hero-portrait-img"
                />
                <span className="hero-portrait-tag mono">Fabian Castaneda — Operator</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { n: "5", l: "Years in IT" },
                  { n: "8", l: "Automations" },
                  { n: "17+", l: "Public Repos" },
                  { n: "1", l: "Gold Medal" },
                ].map((s) => (
                  <div key={s.l} className="card-chrome p-5 text-center">
                    <p className="stat-number text-2xl">{s.n}</p>
                    <p className="stat-label text-[0.65rem]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BgSection>

      {/* ═══════ 01 — PRINCIPLES ═══════ */}
      <BgSection bg="#061b12" onEnter={setBg} className="mega-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-6">
              <span className="label-index">01</span>
              <span>How I Build</span>
            </div>
          </Reveal>
          <WordReveal text="Three rules. No exceptions." className="display display-lg mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {principles.map((p, i) => (
              <Reveal key={p.title} variant="fade-up" delay={i * 0.08}>
                <GlowCard glowColor={p.glow} customSize className="w-full h-full min-h-[280px]">
                  <div className="glow-card-body">
                    <p className="mono text-xs text-[var(--brand)] mb-3">{p.kicker}</p>
                    <h3 className="text-xl font-bold mb-3 text-white">{p.title}</h3>
                    <p className="text-sm text-[var(--muted-strong)] leading-relaxed">{p.copy}</p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </BgSection>

      {/* ═══════ 02 — EXPERIENCE (editorial rows) ═══════ */}
      <BgSection bg="#0a1224" onEnter={setBg} className="mega-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-6">
              <span className="label-index">02</span>
              <span>Background</span>
            </div>
          </Reveal>
          <WordReveal text="Where the reps came from." className="display display-lg mb-14" />

          <div>
            {experience.map((item, i) => (
              <Reveal key={item.company} variant="fade-up" delay={Math.min(i, 3) * 0.06}>
                <div className="work-row group cursor-default">
                  <span className="work-index">{item.period}</span>
                  <span className="work-title !text-[clamp(1.6rem,4.5vw,3.4rem)]">{item.company}</span>
                  <div className="mt-3 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
                    <p className="mono text-xs tracking-wider uppercase text-[var(--brand)] pt-1">
                      {item.role}
                      <span className="block text-[var(--chrome-dim)] mt-1 normal-case tracking-normal">{item.location}</span>
                    </p>
                    <ul className="space-y-2 max-w-3xl">
                      {item.bullets.map((b, bi) => (
                        <li key={bi} className="text-[var(--muted)] text-sm leading-relaxed flex gap-3">
                          <span className="text-[var(--brand)] mt-[2px] shrink-0 mono text-xs">▸</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </BgSection>

      {/* ═══════ 03 — BEYOND THE CODE (typographic, light band) ═══════ */}
      <section className="light-band mega-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal variant="fade-up">
            <div className="section-label mb-6">
              <span className="label-index" style={{ color: "#059669" }}>03</span>
              <span>Beyond the Code</span>
            </div>
          </Reveal>
          <WordReveal text="Systems off. Still building." className="display display-lg mb-14" />

          <div>
            {interests.map((item, i) => (
              <Reveal key={item.label} variant="fade-up" delay={Math.min(i, 4) * 0.05}>
                <div className="interest-row group">
                  <span className="interest-title">{item.label}</span>
                  <span className="interest-note">{item.note}</span>
                  {item.photo && (
                    <span className="interest-photo" aria-hidden="true">
                      <Image src={item.photo} alt="" width={230} height={310} className="interest-photo-img" />
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <BgSection bg="#150b26" onEnter={setBg} className="mega-section text-center relative overflow-hidden">
        <div className="orb orb-accent w-[500px] h-[500px] bottom-[-30%] left-[30%]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
          <WordReveal text="Have a process that shouldn't be manual?" className="display display-lg mb-10 mx-auto max-w-4xl" />
          <Reveal variant="fade-up" delay={0.15}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/projects" className="button-primary">View the Work</Link>
              <a href="mailto:fabcast03@gmail.com" className="button-secondary">Email Me</a>
            </div>
          </Reveal>
        </div>
      </BgSection>
    </main>
  );
}
