import { SiteShell } from "@/src/components/site-shell";
import { ProjectsClient } from "@/src/components/projects-client";
import { fetchGitHubProjects } from "@/src/lib/github";

export const metadata = {
  title: "Projects",
  description: "Production automation and tooling by Fabian Castaneda — Python and Node.js pipelines, Jira/Salesforce/Box integrations, and AI-assisted workflow tools, synced live from GitHub.",
};

// Revalidate every hour — new repos appear within 60 min of push
export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await fetchGitHubProjects();

  return (
    <SiteShell>
      <ProjectsClient projects={projects} />
    </SiteShell>
  );
}
