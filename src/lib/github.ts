/**
 * GitHub API integration for live project sync.
 *
 * Fetches public repos from the FCDevelopments GitHub account
 * and merges them with manual project overrides (for custom
 * descriptions, badges, ordering, and non-GitHub projects).
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
  source: "github" | "manual";
}

/**
 * Manual overrides / enrichments for specific repos.
 * Keys are the exact GitHub repo name (case-sensitive).
 * Any field here takes precedence over the GitHub API data.
 */
const REPO_OVERRIDES: Record<string, Partial<Project> & { hidden?: boolean }> = {
  "fcdevelopments-portfolio": {
    name: "FCDevelopments Portfolio",
    summary:
      "Founder-style portfolio and product studio site showcasing practical software, workflow tools, resume software, and vertical SaaS concepts.",
    badge: "Flagship",
    link: "/resume-builder",
  },
  "OpenClaw": {
    name: "OpenClaw AI Platform",
    summary:
      "Autonomous AI development platform using Claude AI and MCP server orchestration for intelligent code generation and workflow automation.",
    badge: "AI Platform",
  },
  "PlumbModern": {
    name: "PlumbModern",
    summary:
      "SkillsUSA California Regional Gold Medal winning website. Modern responsive design for a local plumbing business.",
    badge: "Gold Medal",
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
      "Revenue-focused workflow tool for contractors, freelancers, and service businesses to automate quote follow-up and deposit collection.",
    badge: "Web App",
    tech: ["Next.js", "TypeScript", "SaaS"],
  },
  "bar-estimate-compliance-writer": {
    name: "BAR Estimate Compliance Writer",
    summary:
      "California-focused estimate drafting product that helps repair shops and dealerships produce customer-friendly, compliance-aware repair estimates.",
    badge: "Web App",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  "customer-update-hub": {
    name: "Customer Update Hub",
    summary:
      "Service workflow communication product that helps dealerships, repair shops, and field-service teams reduce status calls and standardize customer updates.",
    badge: "Web App",
    tech: ["Next.js", "TypeScript", "Workflow Automation"],
  },
  "supportops-copilot": {
    name: "SupportOps Copilot",
    summary:
      "CLI tool that processes raw support exports into categorized summaries and actionable reporting artifacts for operations teams.",
    badge: "Operations",
    tech: ["Python", "CLI", "Automation"],
  },
  "zendesk-csv-helper": {
    name: "Zendesk CSV Helper",
    summary:
      "Utility for cleaning, filtering, and transforming Zendesk ticket exports into structured, actionable CSV data for reporting and analysis.",
    badge: "Operations",
    tech: ["Python", "CSV", "Automation"],
  },
  "rest-api-csv-json-template": {
    name: "REST API CSV/JSON Template",
    summary:
      "Reusable template for building REST API integrations that consume or produce CSV and JSON data, with structured error handling.",
    badge: "Operations",
    tech: ["Python", "REST API", "CSV"],
  },
  "rest-to-csv": {
    name: "REST to CSV Converter",
    summary:
      "Lightweight utility to fetch data from REST API endpoints and export results directly to structured CSV files.",
    badge: "Operations",
    tech: ["Python", "REST API", "CSV"],
  },
  // Hide forks or irrelevant repos by name:
  // "some-fork": { hidden: true },
};

/**
 * Projects that don't live on GitHub but should appear on the site.
 */
const MANUAL_PUSHED_AT = "2026-03-30T15:00:00.000Z";

const MANUAL_PROJECTS: Project[] = [
  {
    name: "SupportOps Copilot",
    summary:
      "CLI tool that processes raw support exports into categorized summaries and actionable reporting artifacts for operations teams.",
    tech: ["Python", "CLI", "Automation"],
    badge: "Operations",
    link: "https://github.com/FCDevelopments",
    github: "https://github.com/FCDevelopments",
    pushedAt: MANUAL_PUSHED_AT,
    stars: 0,
    source: "manual",
  },
  {
    name: "BAR Estimate Compliance Writer",
    summary:
      "California-focused estimate drafting product that helps repair shops and dealership service departments produce customer-friendly, compliance-aware repair estimates.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    badge: "Web App",
    link: "https://github.com/FCDevelopments/bar-estimate-compliance-writer",
    github: "https://github.com/FCDevelopments/bar-estimate-compliance-writer",
    pushedAt: MANUAL_PUSHED_AT,
    stars: 0,
    source: "manual",
  },
  {
    name: "Customer Update Hub",
    summary:
      "Service workflow communication product that helps dealerships, repair shops, and field-service teams reduce status calls and standardize customer updates.",
    tech: ["Next.js", "TypeScript", "Workflow Automation"],
    badge: "Web App",
    link: "https://github.com/FCDevelopments/customer-update-hub",
    github: "https://github.com/FCDevelopments/customer-update-hub",
    pushedAt: MANUAL_PUSHED_AT,
    stars: 0,
    source: "manual",
  },
  {
    name: "Quote Follow-up Autopilot",
    summary:
      "Revenue-focused workflow tool for contractors, freelancers, and service businesses to automate quote follow-up and deposit collection.",
    tech: ["Next.js", "TypeScript", "SaaS"],
    badge: "Web App",
    link: "https://github.com/FCDevelopments/quote-followup-autopilot",
    github: "https://github.com/FCDevelopments/quote-followup-autopilot",
    pushedAt: MANUAL_PUSHED_AT,
    stars: 0,
    source: "manual",
  },
];

/** Badge assignment heuristic based on repo topics/language */
function inferBadge(repo: GitHubRepo): string {
  const topics = repo.topics.map((t) => t.toLowerCase());
  if (topics.includes("ai") || topics.includes("machine-learning") || topics.includes("claude")) return "AI Platform";
  if (topics.includes("automation") || topics.includes("cli")) return "Operations";
  if (topics.includes("award") || topics.includes("skillsusa")) return "Gold Medal";
  if (repo.language === "TypeScript" || repo.language === "JavaScript") return "Web App";
  if (repo.language === "Python") return "Python";
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
 * Returns a sorted list of projects ready for display.
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

  // Transform GitHub repos into projects
  const githubProjects: Project[] = repos
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
        source: "github" as const,
      };
    });

  // Merge with manual projects (avoid duplicates by name)
  const allNames = new Set(githubProjects.map((p) => p.name));
  const manualFiltered = MANUAL_PROJECTS.filter((p) => !allNames.has(p.name));

  // Sort: flagships first, then by most recently pushed
  const badgePriority: Record<string, number> = {
    Flagship: 0, "AI Platform": 1, "Gold Medal": 2, Operations: 3,
  };
  const all = [...githubProjects, ...manualFiltered].sort((a, b) => {
    const pa = badgePriority[a.badge] ?? 10;
    const pb = badgePriority[b.badge] ?? 10;
    if (pa !== pb) return pa - pb;
    return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
  });

  return all;
}
