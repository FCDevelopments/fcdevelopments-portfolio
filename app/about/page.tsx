import { SiteShell } from "@/src/components/site-shell";
import { AboutClient } from "@/src/components/about-client";

export const metadata = {
  title: "About",
  description: "Learn about Fabian Castaneda — IT professional, developer, and builder of practical tools in Orange County, CA.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutClient />
    </SiteShell>
  );
}
