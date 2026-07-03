import { SiteShell } from "@/src/components/site-shell";
import { AboutClient } from "@/src/components/about-client";

export const metadata = {
  title: "About",
  description: "Fabian Castaneda — IT systems engineer specializing in workflow automation, systems integration, and AI tooling. Orange County, CA.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutClient />
    </SiteShell>
  );
}
