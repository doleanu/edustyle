import { ArrowRight, MessageCircle, Scissors, CalendarCheck, Star } from "lucide-react";
import { business } from "@/lib/business";
import { content, type Lang } from "@/lib/content";

const badgeIcons = [Scissors, CalendarCheck, Star];

export function Hero({ lang }: { lang: Lang }) {
  const t = content[lang].hero;
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 lg:pt-40"
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-cream-100 via-cream-50 to-cream-100"
        aria-hidden="true"
      />
      <div
        className="absolute -top-40 right-0 -z-10 h-[40rem] w-[40rem] rounded-full bg-teal-100/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -left-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-terracotta-400/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-tight pb-16 sm:pb-24 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-700/20 bg-cream-50/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-teal-700 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-terracotta-500" />
            {t.badge}
          </div>

          <h1 className="mt-6 font-serif text-5xl font-medium uppercase leading-[0.95] tracking-tight text-teal-900 sm:text-6xl lg:text-7xl">
            {t.title1}<br />
            <span className="text-terracotta-500">{t.title2}</span>
          </h1>

          <p className="mt-6 text-lg text-teal-800/80 sm:text-xl">
            {t.subtitle1}<br className="hidden sm:block" />
            {" "}{t.subtitle2}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#contacto" className="btn-primary w-full sm:w-auto">
              {t.ctaReserve}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={business.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              {t.ctaWhatsApp}
            </a>
          </div>

          <a
            href="#precios"
            className="mt-4 inline-block text-sm text-teal-700/80 underline-offset-4 hover:underline"
          >
            {t.seePrices}
          </a>
        </div>

        {/* Trust badges */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {t.badges.map((label, i) => {
            const Icon = badgeIcons[i];
            return (
              <div
                key={label}
                className="flex items-center justify-center gap-3 rounded-2xl border border-teal-700/10 bg-cream-50/70 px-4 py-3 text-sm font-medium text-teal-800 backdrop-blur"
              >
                <Icon className="h-5 w-5 text-terracotta-500" />
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
