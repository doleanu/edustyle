import { Scissors, CalendarCheck, MapPin, Star } from "lucide-react";
import { content, type Lang } from "@/lib/content";

const iconMap = { Scissors, CalendarCheck, Star, MapPin } as const;

export function WhyUs({ lang }: { lang: Lang }) {
  const t = content[lang].whyUs;
  return (
    <section id="por-que" className="section">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
            {t.eyebrow}
          </span>
          <h2 className="section-heading mt-3">{t.title}</h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {t.reasons.map((reason, index) => {
            const Icon = iconMap[reason.icon as keyof typeof iconMap];
            return (
              <div
                key={reason.title}
                className="relative flex gap-5 rounded-3xl bg-cream-50 p-6 sm:p-8"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-teal-800 px-3 py-1 text-xs font-medium text-cream-50">
                  0{index + 1}
                </span>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-terracotta-400/20 text-terracotta-600">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                    {reason.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-teal-700/80">
                    {reason.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
