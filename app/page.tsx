import type { Metadata } from "next";
import SiteChrome from "@/components/layout/SiteChrome";
import HomeSections from "@/components/HomeSections";
import { buildMetadata } from "@/lib/seo";

// Serbian (ijekavica) is the default language, served at the root.
export const metadata: Metadata = buildMetadata("sr");

export default function Home() {
  return (
    <SiteChrome lang="sr">
      <HomeSections />
    </SiteChrome>
  );
}
