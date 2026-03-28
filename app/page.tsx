import { SiteShell } from "@/src/components/site-shell";
import { HomeClient } from "@/src/components/home-client";
import { fetchGitHubProjects } from "@/src/lib/github";

export const revalidate = 3600;

const skills = [
  "Python", "TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS",
  "Claude AI", "Anthropic API", "MCP Servers", "Node.js", "Okta", "Azure AD",
  "Docker", "Vercel", "Git", "SQL", "Bash", "REST APIs",
];

export default async function Home() {
  const allProjects = await fetchGitHubProjects();

  // Show top 4 on home page
  const homeProjects = allProjects.slice(0, 4).map((p) => ({
    name: p.name,
    description: p.summary,
    tech: p.tech,
    badge: p.badge,
    link: p.link,
  }));

  return (
    <SiteShell>
      <HomeClient projects={homeProjects} skills={skills} />
    </SiteShell>
  );
}
