/**
 * GitHub API integration for live project sync.
 *
 * Fetches public repos from the FCDevelopments GitHub account
 * and merges them with manual overrides (custom descriptions,
 * badges, tech tags, featured ordering). Archived repos and
 * forks are excluded automatically, so the site stays in sync
 * with GitHub profile cleanup.
 */

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

export interface Project {
  name: string;
  summary: string;
  tech: string[];
  badge: string;
  link: string;
  github: string;
  pushedAt: string;
  stars: number;
  featured: boolean;
  source: "github" | "manual";
}

/**
 * Manual overrides / enrichments for specific repos.
 * Keys are the exact GitHub repo name (case-sensitive).
 * Any field here takes precedence over the GitHub API data.
 * `featured` pins a repo to the top of the list and the home page.
 */
const REPO_OVERRIDES: Record<
  string,
  Partial<Project> & { hidden?: boolean }
> = {
  // ── Production automation templates (ran in production; scrubbed for public reuse) ──
  ringCentralArchiver: {
    name: "RingCentral Archiver",
    summary:
      "Replaces RingCentral's native call-recording archiver: pulls the full call log via API and archives recordings into one clean Box folder per month — 11,700+ recordings recovered, with dedup, rate-limit backoff, and an offline mock test suite.",
    badge: "Production",
    tech: ["Python", "RingCentral API", "Box SDK", "Rate Limiting"],
    featured: true,
  },
  AmazonReportBot: {
    name: "AmazonReportBot",
    summary:
      "Playwright automation that downloads the daily Amazon Business order report and emails one receipt per card charge for expense matching — attaches to a real signed-in Edge session over CDP to survive anti-bot walls.",
    badge: "Production",
    tech: ["Python", "Playwright", "Outlook COM", "PowerShell"],
    featured: true,
  },
  JiraReporter: {
    name: "JiraReporter — IT Ticket Dashboard",
    summary:
      "Daily dashboard surfacing IT tickets aging past 45 days: interactive Chart.js dashboard served by a local credential-proxying web server, daily email digest, and a Snowflake export for BI reporting.",
    badge: "Production",
    tech: ["Python", "Jira REST API", "Chart.js", "Snowflake"],
    featured: true,
  },
  BoxTranscriber: {
    name: "BoxTranscriber",
    summary:
      "Watches a Box folder and auto-transcribes uploaded videos via AssemblyAI, posting timestamped transcripts back as comments — verified on a 19.6 GB video through the ffmpeg large-file path.",
    badge: "Production",
    tech: ["Node.js", "AssemblyAI", "Box SDK", "ffmpeg"],
    featured: true,
  },
  ATT_Salesforce_Tool: {
    name: "AT&T → Salesforce Reconciler",
    summary:
      "Weekly asset reconciliation between an AT&T Premier export and Salesforce: header auto-detection, digit-safe IMEI parsing, a bad-row review queue, and a permanent lock against re-activating cancelled lines.",
    badge: "Production",
    tech: ["Python", "pandas", "openpyxl", "Task Scheduler"],
    featured: true,
  },
  JiraPhoneReport: {
    name: "JiraPhoneReport",
    summary:
      "Onboarding/offboarding compliance audits that catch phone-provisioning gaps — new hires with no line assigned, departed staff with active billable lines — as color-coded Excel reports.",
    badge: "Production",
    tech: ["Python", "Jira REST API", "openpyxl"],
    featured: true,
  },
  JiraAnalyticsReport: {
    name: "JiraAnalyticsReport",
    summary:
      "Weekly team report distilled from 42,000+ historical Jira tickets: incremental fetch, styled Excel workbook, automated Monday-morning Outlook delivery — fetch, format, and send cleanly separated.",
    badge: "Production",
    tech: ["PowerShell", "Python", "openpyxl", "Outlook COM"],
  },

  // ── Product & tooling work ──
  "fcdevelopments-portfolio": {
    name: "FCDevelopments Portfolio",
    summary:
      "This site — a dark, systems-console portfolio built on Next.js App Router with live GitHub project sync via ISR.",
    badge: "Web App",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "/",
  },
  "ticket-triage-tagging-engine": {
    name: "Ticket Triage Engine",
    summary:
      "Keyword-based IT support ticket triage and tagging rules engine. Reads CSV exports, assigns priority + routing, outputs triage reports.",
    badge: "Operations",
    tech: ["Python", "Automation", "CLI"],
  },
  "quote-followup-autopilot": {
    name: "Quote Follow-up Autopilot",
    summary:
      "Revenue-focused workflow tool for contractors and service businesses to automate quote follow-up and deposit collection.",
    badge: "Web App",
    tech: ["Next.js", "TypeScript", "SaaS"],
  },
  "bar-estimate-compliance-writer": {
    name: "BAR Estimate Compliance Writer",
    summary:
      "California-focused estimate drafting product that helps repair shops produce customer-friendly, compliance-aware repair estimates.",
    badge: "Web App",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  "customer-update-hub": {
    name: "Customer Update Hub",
    summary:
      "Service-status communication hub that helps dealerships, repair shops, and field-service teams cut status calls and standardize customer updates.",
    badge: "Web App",
    tech: ["Next.js", "TypeScript", "Workflow Automation"],
  },
  "supportops-copilot": {
    name: "SupportOps Copilot",
    summary:
      "CLI tool that processes raw support ticket exports into categorized summaries and manager-ready reporting artifacts.",
    badge: "Operations",
    tech: ["Python", "CLI", "Automation"],
  },
  "zendesk-csv-cleanup-macro-helper": {
    name: "Zendesk CSV Cleanup Helper",
    summary:
      "Cleans messy Zendesk-style CSV exports and surfaces repeated-response macro candidates for support teams.",
    badge: "Operations",
    tech: ["Python", "CSV", "Automation"],
  },
  "ticket-log-parser-sla-report": {
    name: "Ticket Log Parser + SLA Report",
    summary:
      "Parses support ticket logs, detects SLA breach signals, and generates a clean summary report.",
    badge: "Operations",
    tech: ["Python", "CLI", "Reporting"],
  },
  "rest-api-to-csv-json-template": {
    name: "REST API → CSV/JSON Template",
    summary:
      "Clean, heavily-commented Python template for pulling REST API data into structured CSV/JSON with error handling and pagination.",
    badge: "Template",
    tech: ["Python", "REST API", "CSV"],
  },
  "it-onboarding-checklist-automation": {
    name: "IT Onboarding Checklist Automation",
    summary:
      "Automates the IT-side onboarding checklist so every new hire gets a consistent, verifiable setup.",
    badge: "Operations",
    tech: ["Python", "Automation"],
  },

  // Profile README repo — not a project.
  FCDevelopments: { hidden: true },
};

/**
 * Static fallback when the GitHub API is unavailable (rate limit, outage,
 * bad token): every override with full metadata becomes a project card,
 * so the site never renders an empty grid.
 */
const FALLBACK_PROJECTS: Project[] = Object.entries(REPO_OVERRIDES)
  .filter(([, o]) => !o.hidden && o.name && o.summary && o.tech && o.badge)
  .map(([repo, o]) => ({
    name: o.name!,
    summary: o.summary!,
    tech: o.tech!,
    badge: o.badge!,
    link: o.link || `https://github.com/FCDevelopments/${repo}`,
    github: `https://github.com/FCDevelopments/${repo}`,
    pushedAt: "2026-07-01T00:00:00.000Z",
    stars: 0,
    featured: o.featured ?? false,
    source: "manual" as const,
  }));

/** Badge assignment heuristic based on repo topics/language */
function inferBadge(repo: GitHubRepo): string {
  const topics = repo.topics.map((t) => t.toLowerCase());
  if (topics.includes("ai") || topics.includes("claude")) return "AI Tooling";
  if (topics.includes("automation") || topics.includes("cli")) return "Operations";
  if (topics.includes("template")) return "Template";
  if (repo.language === "TypeScript" || repo.language === "JavaScript") return "Web App";
  if (repo.language === "Python" || repo.language === "PowerShell") return "Operations";
  return "Project";
}

/** Extract tech tags from repo language + topics */
function inferTech(repo: GitHubRepo): string[] {
  const tags: string[] = [];
  if (repo.language) tags.push(repo.language);
  const topicMap: Record<string, string> = {
    nextjs: "Next.js", react: "React", tailwindcss: "Tailwind CSS",
    python: "Python", "claude-ai": "Claude AI", docker: "Docker",
    typescript: "TypeScript", nodejs: "Node.js", api: "REST API",
    mcp: "MCP Servers", automation: "Automation",
  };
  for (const t of repo.topics) {
    const mapped = topicMap[t.toLowerCase()];
    if (mapped && !tags.includes(mapped)) tags.push(mapped);
  }
  return tags.length ? tags : [repo.language || "Code"];
}

/**
 * Fetch public repos from GitHub and merge with overrides.
 * Returns a sorted list of projects ready for display —
 * featured production work first, then by most recent push.
 */
export async function fetchGitHubProjects(): Promise<Project[]> {
  const GITHUB_USERNAME = "FCDevelopments";

  let repos: GitHubRepo[] = [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed&direction=desc`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Optional: set GITHUB_TOKEN env var for higher rate limits
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 }, // ISR: revalidate every hour
      }
    );
    if (res.ok) {
      repos = await res.json();
    } else {
      console.warn(`GitHub API returned ${res.status}: ${res.statusText}`);
    }
  } catch (err) {
    console.warn("Failed to fetch GitHub repos:", err);
  }

  if (repos.length === 0) {
    return [...FALLBACK_PROJECTS].sort((a, b) =>
      a.featured === b.featured ? 0 : a.featured ? -1 : 1
    );
  }

  const projects: Project[] = repos
    .filter((r) => !r.fork && !r.archived)
    .filter((r) => !REPO_OVERRIDES[r.name]?.hidden)
    .map((repo) => {
      const override = REPO_OVERRIDES[repo.name] || {};
      return {
        name: override.name || repo.name,
        summary: override.summary || repo.description || "A project by FCDevelopments.",
        tech: override.tech || inferTech(repo),
        badge: override.badge || inferBadge(repo),
        link: override.link || repo.homepage || repo.html_url,
        github: repo.html_url,
        pushedAt: repo.pushed_at,
        stars: repo.stargazers_count,
        featured: override.featured ?? false,
        source: "github" as const,
      };
    });

  // Featured production work first, then badge priority, then recency
  const badgePriority: Record<string, number> = {
    Production: 0, "AI Tooling": 1, Operations: 2, "Web App": 3, Template: 4,
  };
  projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const pa = badgePriority[a.badge] ?? 10;
    const pb = badgePriority[b.badge] ?? 10;
    if (pa !== pb) return pa - pb;
    return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
  });

  return projects;
}
