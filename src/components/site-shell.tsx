import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/resume-builder", label: "Resume Builder" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <Link href="/" className="text-xl font-extrabold tracking-tight" style={{ color: "var(--brand)" }}>
            FC<span className="text-[var(--foreground)]">.</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="h-[60px]" />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-white/[0.04] bg-[var(--surface)] mt-20">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <p className="text-2xl font-extrabold tracking-tight mb-3">
                <span style={{ color: "var(--brand)" }}>FC</span><span className="text-[var(--foreground)]">.</span>
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xs">
                IT Operations &amp; Cybersecurity professional. Building AI-integrated tools and automation for modern enterprise systems. Cerritos, CA.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-4">Navigation</p>
              <nav className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-4">Connect</p>
              <div className="flex flex-col gap-3">
                <a href="https://github.com/FCDevelopments" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">GitHub</a>
                <a href="https://linkedin.com/in/fcastaneda8" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">LinkedIn</a>
                <a href="mailto:fabcast03@gmail.com" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Email</a>
              </div>
            </div>
          </div>
          <div className="divider-fade mb-8" />
          <p className="text-xs text-[var(--chrome-dim)] text-center">&copy; 2026 Fabian Castaneda &middot; Built with Next.js, React &amp; Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
