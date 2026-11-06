import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Video } from "@/components/Video";
import { About } from "@/components/About";
import { Specialties } from "@/components/Specialties";
import { Gallery } from "@/components/Gallery";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { Prices } from "@/components/Prices";
import { Booking } from "@/components/Booking";
import { FAQ } from "@/components/FAQ";
import { Location } from "@/components/Location";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { DocumentLang } from "@/components/DocumentLang";
import { type Lang } from "@/lib/content";
import { getLivePrices } from "@/lib/pricelist/render";

// Shared page body for every language route. The price list is read from the owner-edited price list
// (Redis; falls back to content.ts until the first save) and the page is regenerated when he saves.
export async function SiteBody({ lang }: { lang: Lang }) {
  const { groups, prices } = await getLivePrices(lang);
  return (
    <>
      <DocumentLang lang={lang} />
      <JsonLd lang={lang} prices={prices} />
      <Header lang={lang} />
      <main>
        <Hero lang={lang} />
        <Video lang={lang} />
        <About lang={lang} />
        <Specialties lang={lang} />
        <Gallery lang={lang} />
        <Prices lang={lang} groups={groups} />
        <Booking lang={lang} services={groups.flatMap((g) => g.items.map((i) => i.name))} />
        <WhyUs lang={lang} />
        <Testimonials lang={lang} />
        <FAQ lang={lang} prices={prices} />
        <Location lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
