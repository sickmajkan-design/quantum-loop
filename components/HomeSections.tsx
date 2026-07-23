import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Guarantee from "@/components/sections/Guarantee";
import Portfolio from "@/components/sections/Portfolio";
import Salzburg from "@/components/sections/Salzburg";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

// The single-page content, shared by every language route (/, /de, /en).
export default function HomeSections() {
  return (
    <>
      <Hero />
      <Services />
      <Guarantee />
      <Portfolio />
      <Salzburg />
      <FAQ />
      <Contact />
    </>
  );
}
