import { business, services } from "@/lib/business";
import { faqs } from "@/lib/faq";

// Schema.org structured data: helps Google understand the business
// for the Knowledge Panel, rich results, and local search.
export function JsonLd() {
  const dayMap: Record<string, string> = {
    Lunes: "Monday",
    Martes: "Tuesday",
    Miércoles: "Wednesday",
    Jueves: "Thursday",
    Viernes: "Friday",
    Sábado: "Saturday",
    Domingo: "Sunday",
  };

  const openingHoursSpec = business.hours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayMap[h.day],
      opens: h.open,
      closes: h.close,
    }));

  const data = {
    "@context": "https://schema.org",
    "@type": ["HairSalon", "LocalBusiness"],
    "@id": `${business.siteUrl}/#business`,
    name: business.name,
    description: business.longDescription,
    url: business.siteUrl,
    telephone: business.phoneE164,
    email: business.email,
    image: `${business.siteUrl}/opengraph-image.png`,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      postalCode: business.address.postalCode,
      addressCountry: business.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHoursSpecification: openingHoursSpec,
    sameAs: [business.social.instagram, business.social.googleMaps].filter(
      Boolean
    ),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios Eduardo Style",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.short,
        },
      })),
    },
    areaServed: {
      "@type": "City",
      name: "Tenerife",
    },
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  );
}
