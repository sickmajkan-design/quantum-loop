import { I18nProvider } from "@/lib/i18n-context";
import type { Lang } from "@/content";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import StickyMobileCta from "@/components/layout/StickyMobileCta";
import HtmlLang from "@/components/layout/HtmlLang";
import LangAutoRedirect from "@/components/layout/LangAutoRedirect";
import SkipLink from "@/components/layout/SkipLink";

// Per-language shell: provides the fixed language to everything below and wraps
// the page in the translated header/footer/floating chrome. Used by each
// language route so the whole tree renders server-side in that language.
export default function SiteChrome({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider lang={lang}>
      <HtmlLang lang={lang} />
      <LangAutoRedirect lang={lang} />
      <SkipLink />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FloatingContact />
      <StickyMobileCta />
    </I18nProvider>
  );
}
