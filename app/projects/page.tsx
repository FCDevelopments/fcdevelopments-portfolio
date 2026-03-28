import { SiteShell } from "@/src/components/site-shell";
import { ProjectsClient } from "@/src/components/projects-client";
import { fetchGitHubProjects } from "@/src/lib/github";

export const metadata = {
  title: "Projects",
  description: "Portfolio projects by Fabian Castaneda — resume builder, AI platforms, automation tools, and award-winning web design.",
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
