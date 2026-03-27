import { SiteShell } from "@/src/components/site-shell";
import { ResumeBuilderShell } from "@/src/components/resume-builder-shell";

export const metadata = {
  title: "Resume Builder",
  description: "Free, privacy-first resume builder with ATS-friendly templates, real-time preview, smart role recommendations, and PDF export. No account needed.",
};

export default function ResumeBuilderPage() {
  return (
    <SiteShell>
      <main className="bg-[var(--background)]">
        <section className="border-b border-white/[0.04] py-16 relative overflow-hidden">
          <div className="orb orb-gold w-[300px] h-[300px] top-[-20%] right-[20%]" />
          <div className="mx-auto max-w-6xl px-6 lg:px-10 relative z-10">
            <p className="eyebrow mb-4">Tool</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance mb-6 leading-[0.95]">
              Resume Builder<span className="text-gradient-gold">.</span>
            </h1>
            <p className="text-lg text-[var(--muted)] mb-6 max-w-2xl leading-relaxed">
              ATS-friendly templates, real-time preview, and clean PDF export. Your data stays in your browser — no account, no tracking, no compromise.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-2 rounded-lg bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] text-sm font-semibold">Free</span>
              <span className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[var(--muted)] text-sm font-semibold">No account required</span>
              <span className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[var(--muted)] text-sm font-semibold">Private by default</span>
              <span className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[var(--muted)] text-sm font-semibold">ATS-safe</span>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <ResumeBuilderShell />
        </section>
      </main>
    </SiteShell>
  );
}
