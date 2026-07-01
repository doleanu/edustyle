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

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <Hero />
        <Video />
        <About />
        <Services />
        <WhyUs />
        <Testimonials />
        <Prices />
        <FAQ />
        <Location />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
