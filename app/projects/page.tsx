import { SiteShell } from "@/src/components/site-shell";
import { ProjectsClient } from "@/src/components/projects-client";

export const metadata = {
  title: "Projects",
  description: "Portfolio projects by Fabian Castaneda — resume builder, AI platforms, automation tools, and award-winning web design.",
};

const projects = [
  {
    name: "FCDevelopments Resume Builder",
    summary: "Privacy-first resume tool with ATS-safe templates, real-time preview, and PDF export. No account required — everything runs client-side.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    badge: "Flagship",
    link: "/resume-builder",
    github: "https://github.com/FCDevelopments",
  },
  {
    name: "OpenClaw AI Platform",
    summary: "Autonomous AI development platform using Claude AI and the Anthropic API. MCP server orchestration for intelligent code generation and workflow automation.",
    tech: ["Python", "Claude API", "Anthropic", "MCP Servers"],
    badge: "AI Platform",
    link: "https://github.com/FCDevelopments",
    github: "https://github.com/FCDevelopments",
  },
  {
    name: "PlumbModern",
    summary: "SkillsUSA California Regional Gold Medal winning website redesign. Responsive front-end with modern design principles.",
    tech: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    badge: "Gold Medal",
    link: "https://github.com/FCDevelopments",
    github: "https://github.com/FCDevelopments",
  },
  {
    name: "SupportOps Copilot",
    summary: "CLI tool that processes raw support exports into categorized summaries and actionable reporting artifacts for operations teams.",
    tech: ["Python", "CLI", "Automation"],
    badge: "Operations",
    link: "https://github.com/FCDevelopments",
    github: "https://github.com/FCDevelopments",
  },
  {
    name: "REST API Integration Template",
    summary: "Reusable template for API authentication, pagination, error handling, and data export. Built for SaaS admins and engineers.",
    tech: ["Python", "REST API", "Integration"],
    badge: "Template",
    link: "https://github.com/FCDevelopments",
    github: "https://github.com/FCDevelopments",
  },
  {
    name: "Zendesk Cleanup Helper",
    summary: "Processes messy support exports and surfaces high-value repeat issue patterns for macro standardization and automation.",
    tech: ["Python", "Zendesk API", "Data Processing"],
    badge: "Utility",
    link: "https://github.com/FCDevelopments",
    github: "https://github.com/FCDevelopments",
  },
];

export default function ProjectsPage() {
  return (
    <SiteShell>
      <ProjectsClient projects={projects} />
    </SiteShell>
  );
}
