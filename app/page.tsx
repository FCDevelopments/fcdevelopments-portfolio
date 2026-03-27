import { SiteShell } from "@/src/components/site-shell";
import { HomeClient } from "@/src/components/home-client";

const projects = [
  {
    name: "Resume Builder",
    description: "Privacy-first, ATS-optimized resume tool. No account. No tracking. Just results.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind"],
    badge: "Flagship",
    link: "/resume-builder",
  },
  {
    name: "OpenClaw AI",
    description: "Autonomous development platform powered by Claude AI and MCP server orchestration.",
    tech: ["Python", "Claude API", "Anthropic", "MCP"],
    badge: "AI Platform",
    link: "https://github.com/FCDevelopments",
  },
  {
    name: "PlumbModern",
    description: "SkillsUSA Gold Medal winning website. Modern responsive design for a local business.",
    tech: ["HTML", "CSS", "JavaScript"],
    badge: "Gold Medal",
    link: "https://github.com/FCDevelopments",
  },
  {
    name: "SupportOps Copilot",
    description: "Automated ticket categorization and reporting from raw support exports.",
    tech: ["Python", "CLI", "Automation"],
    badge: "Operations",
    link: "https://github.com/FCDevelopments",
  },
];

const skills = [
  "Python", "TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS",
  "Claude AI", "Anthropic API", "MCP Servers", "Node.js", "Okta", "Azure AD",
  "Docker", "Vercel", "Git", "SQL", "Bash", "REST APIs",
];

export default function Home() {
  return (
    <SiteShell>
      <HomeClient projects={projects} skills={skills} />
    </SiteShell>
  );
}
