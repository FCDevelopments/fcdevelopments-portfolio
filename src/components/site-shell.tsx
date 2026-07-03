import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <Link href="/" className="mono text-lg font-bold tracking-tight">
            <span style={{ color: "var(--brand)" }}>fc</span>
            <span className="text-[var(--chrome-dim)]">@</span>
            <span className="text-[var(--foreground)]">dev</span>
            <span style={{ color: "var(--brand)" }}>:~$</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/FCDevelopments"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-[var(--muted-strong)] hover:text-[var(--brand)] transition-colors"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.04 11.04 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
              </svg>
            </a>
          </nav>
        </div>
      </header>
      <div className="h-[60px]" />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-white/[0.04] bg-[var(--surface)] mt-20">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <p className="mono text-lg font-bold tracking-tight mb-3">
                <span style={{ color: "var(--brand)" }}>fc</span>
                <span className="text-[var(--chrome-dim)]">@</span>
                <span className="text-[var(--foreground)]">dev</span>
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xs">
                IT systems engineer building production automation and AI-integrated
                tooling for modern operations teams. Orange County, CA.
              </p>
            </div>
            <div>
              <p className="mono text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-4">Navigation</p>
              <nav className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <p className="mono text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-4">Connect</p>
              <div className="flex flex-col gap-3">
                <a href="https://github.com/FCDevelopments" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">GitHub</a>
                <a href="https://linkedin.com/in/fcastaneda8" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">LinkedIn</a>
                <a href="mailto:fabcast03@gmail.com" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Email</a>
              </div>
            </div>
          </div>
          <div className="divider-fade mb-8" />
          <p className="mono text-xs text-[var(--chrome-dim)] text-center">
            © 2026 Fabian Castaneda — built with Next.js · deployed on Vercel · uptime is a feature
          </p>
        </div>
      </footer>
    </div>
  );
}
