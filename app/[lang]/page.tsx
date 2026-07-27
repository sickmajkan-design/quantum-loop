import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteChrome from "@/components/layout/SiteChrome";
import HomeSections from "@/components/HomeSections";
import { buildMetadata } from "@/lib/seo";
import type { Lang } from "@/content";

// Non-default languages get their own static page. Serbian stays at the root,
// so only de/en are generated here. dynamicParams=false means any other path
// (e.g. /sr) is a 404 rather than a build error under static export.
const LOCALES = ["de", "en"] as const;
type RouteLang = (typeof LOCALES)[number];

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata(lang as Lang);
}

export default async function LangHome({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as RouteLang)) notFound();
  return (
    <SiteChrome lang={lang as Lang}>
      <HomeSections />
    </SiteChrome>
  );
}
