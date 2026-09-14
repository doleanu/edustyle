import { Star, Quote } from "lucide-react";
import { content, type Lang } from "@/lib/content";

export function Testimonials({ lang }: { lang: Lang }) {
  const t = content[lang].testimonials;
  return (
    <section id="opiniones" className="section bg-teal-800 text-cream-50">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-400">
            {t.eyebrow}
          </span>
          <h2 className="mt-3 font-serif text-4xl font-medium uppercase sm:text-5xl">
            {t.title}
          </h2>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream-50/10 px-4 py-2 text-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-terracotta-400 text-terracotta-400"
                />
              ))}
            </div>
            <span className="text-cream-100">{t.badge}</span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item) => (
            <figure
              key={item.name}
              className="relative flex flex-col gap-4 rounded-2xl bg-teal-700/40 p-6 ring-1 ring-cream-50/10 backdrop-blur"
            >
              <Quote
                className="absolute right-5 top-5 h-8 w-8 text-terracotta-400/40"
                aria-hidden="true"
              />
              <div className="flex gap-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-terracotta-400 text-terracotta-400"
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-cream-100">
                {item.text}
              </blockquote>
              <figcaption className="border-t border-cream-50/10 pt-4">
                <div className="font-medium text-cream-50">{item.name}</div>
                <div className="text-xs text-cream-100/70">{item.service}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
