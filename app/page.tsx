import { SiteShell } from "@/src/components/site-shell";
import { HomeClient } from "@/src/components/home-client";
import { fetchGitHubProjects } from "@/src/lib/github";

export const revalidate = 3600;

const skills = [
  "Python", "TypeScript", "Node.js", "PowerShell", "React", "Next.js",
  "REST APIs", "Playwright", "Claude AI", "MCP Servers", "Okta", "Entra ID",
  "Jira", "Salesforce", "Box", "RingCentral", "Snowflake", "Docker",
];

export default async function Home() {
  const allProjects = await fetchGitHubProjects();

  // Featured production automations on the home page (top 6)
  const homeProjects = allProjects
    .filter((p) => p.featured)
    .slice(0, 6)
    .map((p) => ({
      name: p.name,
      description: p.summary,
      tech: p.tech,
      badge: p.badge,
      link: p.link,
      github: p.github,
    }));

  return (
    <SiteShell>
      <HomeClient projects={homeProjects} skills={skills} />
    </SiteShell>
  );
}
