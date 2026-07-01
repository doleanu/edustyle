import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Video } from "@/components/Video";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { Prices } from "@/components/Prices";
import { FAQ } from "@/components/FAQ";
import { Location } from "@/components/Location";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { JsonLd } from "@/components/JsonLd";
import { type Lang } from "@/lib/content";

// Shared page body — the `/` (Spanish) and `/en` (English) routes both render this.
export function SiteBody({ lang }: { lang: Lang }) {
  return (
    <>
      <JsonLd />
      <Header lang={lang} />
      <main>
        <Hero lang={lang} />
        <Video lang={lang} />
        <About lang={lang} />
        <Services lang={lang} />
        <WhyUs lang={lang} />
        <Testimonials lang={lang} />
        <Prices lang={lang} />
        <FAQ lang={lang} />
        <Location lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
      <FloatingWhatsApp lang={lang} />
    </>
  );
}
