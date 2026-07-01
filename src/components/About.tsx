import { HeartHandshake, Sparkles, UserCog } from "lucide-react";
import { content, type Lang } from "@/lib/content";

const iconMap = { UserCog, HeartHandshake, Sparkles } as const;

export function About({ lang }: { lang: Lang }) {
  const t = content[lang].about;
  return (
    <section id="sobre" className="section">
      <div className="container-tight">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
              {t.eyebrow}
            </span>
            <h2 className="section-heading mt-3">{t.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-teal-800/90">{t.p1}</p>
            <p className="mt-4 text-base leading-relaxed text-teal-700/80">{t.p2}</p>
            <p className="mt-4 text-base leading-relaxed text-teal-900">
              <strong className="font-medium">{t.p3strong}</strong>
            </p>
          </div>

          <div className="grid gap-4">
            {t.values.map((value) => {
              const Icon = iconMap[value.icon as keyof typeof iconMap];
              return (
                <div
                  key={value.title}
                  className="group flex gap-4 rounded-2xl border border-teal-700/10 bg-cream-50 p-6 transition-all hover:border-terracotta-400/40 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-700/10 text-teal-700 transition-colors group-hover:bg-terracotta-500 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl uppercase tracking-wide text-teal-900">
                      {value.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-teal-700/80">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
