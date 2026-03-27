import { SiteShell } from "@/src/components/site-shell";

export const metadata = {
  title: "Privacy",
  description: "How FCDevelopments handles your data — plain-English privacy practices for our resume builder and tools.",
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <main className="bg-[var(--background)]">
        <section className="border-b border-white/10 py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <p className="eyebrow mb-4">Privacy</p>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-balance mb-6">
              A plain-English privacy approach.
            </h1>
            <p className="text-lg text-[var(--muted)]">
              Your privacy is important. Here's how we handle data in our tools and products.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <div className="space-y-12">
              {/* Resume Builder Privacy */}
              <div className="p-8 rounded-2xl border border-white/10 bg-[var(--surface)]">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Resume Builder Privacy</h2>
                <div className="space-y-4 text-[var(--muted)] leading-7">
                  <p>
                    The resume builder is designed to keep your resume data in the browser by default during editing. You can upload or paste resume content, improve it, and export it <strong className="text-[var(--foreground)]">without creating an account</strong>.
                  </p>
                  <p>
                    Your resume data is <strong className="text-[var(--foreground)]">not permanently stored on our servers</strong> by default. We recommend exporting your work before closing or refreshing the page to avoid losing changes.
                  </p>
                  <p>
                    When you export your resume, you're downloading a document to your computer. This is the safest way to preserve your work and ensure you have full control over your resume.
                  </p>
                </div>
              </div>

              {/* AI Features */}
              <div className="p-8 rounded-2xl border border-white/10 bg-[var(--surface)]">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">AI-Assisted Features</h2>
                <div className="space-y-4 text-[var(--muted)] leading-7">
                  <p>
                    When AI-assisted suggestions are available, they will be <strong className="text-[var(--foreground)]">clearly labeled as suggestions only</strong>. You should always review all output for accuracy and relevance before using it in your actual resume or job applications.
                  </p>
                  <p>
                    AI tools are powerful but not perfect. We encourage careful review of any generated content before applying to jobs.
                  </p>
                </div>
              </div>

              {/* Data Practices */}
              <div className="p-8 rounded-2xl border border-white/10 bg-[var(--surface)]">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Our Data Practices</h2>
                <ul className="space-y-3 text-[var(--muted)]">
                  <li className="flex gap-3">
                    <span className="text-[var(--brand)] font-bold">✓</span>
                    <span>We don't sell or share your personal data with third parties.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[var(--brand)] font-bold">✓</span>
                    <span>Your resume content stays in your control, either in your browser or exported by you.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[var(--brand)] font-bold">✓</span>
                    <span>We use analytics to understand how people use our tools, but we minimize data collection.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[var(--brand)] font-bold">✓</span>
                    <span>If you create an account in the future, we'll be transparent about what data we collect and why.</span>
                  </li>
                </ul>
              </div>

              {/* Development Status */}
              <div className="p-8 rounded-2xl border border-white/10 bg-[var(--surface)]">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Development Status</h2>
                <p className="text-[var(--muted)] leading-7">
                  This project is in active development. This page represents our intended privacy model and will be refined as we launch new features and capabilities. Questions or concerns? Feel free to <a href="mailto:hello@fcdevelopments.com" className="text-[var(--brand)] hover:text-[var(--brand-dark)] transition-colors">reach out</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
