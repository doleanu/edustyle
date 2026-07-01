import {
  Scissors,
  Crown,
  Brush,
  Droplets,
  Baby,
  PenTool,
  Palette,
  ArrowRight,
} from "lucide-react";
import { content, type Lang } from "@/lib/content";

const iconMap = {
  Scissors,
  Crown,
  Brush,
  Droplets,
  Baby,
  PenTool,
  Palette,
} as const;

export function Services({ lang }: { lang: Lang }) {
  const t = content[lang].services;
  return (
    <section id="servicios" className="section bg-cream-100">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
            {t.eyebrow}
          </span>
          <h2 className="section-heading mt-3">{t.title}</h2>
          <p className="section-subheading mx-auto">{t.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <article
                key={service.name}
                className="group flex flex-col rounded-2xl bg-cream-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700/10 text-teal-700 transition-colors group-hover:bg-teal-700 group-hover:text-cream-50">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl uppercase tracking-wide text-teal-900">
                  {service.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-teal-700/80">
                  {service.desc}
                </p>
                <a
                  href="#contacto"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-all group-hover:gap-2.5 group-hover:text-terracotta-500"
                >
                  {t.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
