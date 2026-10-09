import Image from "next/image";
import { Instagram } from "lucide-react";
import { content, type Lang } from "@/lib/content";
import { business } from "@/lib/business";

// Real work photos taken from the shop's own Instagram (@edustyle4), shown at
// roughly the size they were captured at — kept as a uniform portrait grid
// rather than a "hero" mosaic, which would blow the small originals up.
export function Gallery({ lang }: { lang: Lang }) {
  const t = content[lang].gallery;
  return (
    <section id="trabajo" className="section">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-700">
            {t.eyebrow}
          </span>
          <h2 className="section-heading mt-3">{t.title}</h2>
          <p className="section-subheading mx-auto">{t.subtitle}</p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {t.items.map((item) => (
            <li key={item.src} className="overflow-hidden rounded-2xl bg-cream-100">
              <Image
                src={item.src}
                alt={item.alt}
                width={387}
                height={514}
                sizes="(min-width: 896px) 280px, (min-width: 640px) 30vw, 46vw"
                className="aspect-[3/4] h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <a
            href={business.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 underline-offset-4 transition-colors hover:text-teal-900 hover:underline"
          >
            <Instagram className="h-5 w-5 text-terracotta-700" />
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
