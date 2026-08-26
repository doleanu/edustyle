import { Wand2, Waves, Ruler } from "lucide-react";
import { content, type Lang } from "@/lib/content";

const iconMap = { Wand2, Waves, Ruler } as const;

// Highlights the three services people actually search for locally
// (confirmed via Search Console query data), each with its own heading
// so Google has clean, specific copy to match those searches against.
export function Specialties({ lang }: { lang: Lang }) {
  const t = content[lang].specialties;
  return (
    <section id="especialidades" className="section bg-cream-50">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
            {t.eyebrow}
          </span>
          <h2 className="section-heading mt-3">{t.title}</h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {t.items.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <div
                key={item.title}
                className="flex flex-col gap-4 rounded-3xl border border-teal-700/10 bg-white p-6 sm:p-8"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-terracotta-400/20 text-terracotta-600">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl uppercase tracking-wide text-teal-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-teal-700/80">
                    {item.description}
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
