import { MessageCircle } from "lucide-react";
import { business } from "@/lib/business";
import { content, type Lang } from "@/lib/content";
import clsx from "clsx";

export function Prices({ lang }: { lang: Lang }) {
  const t = content[lang].prices;
  return (
    <section id="precios" className="section bg-cream-100">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
            {t.eyebrow}
          </span>
          <h2 className="section-heading mt-3">{t.title}</h2>
          <p className="section-subheading mx-auto">{t.subtitle}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {t.groups.map((group) => (
            <div
              key={group.title}
              className="flex flex-col rounded-3xl bg-cream-50 p-6 shadow-sm sm:p-8"
            >
              <h3 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-4">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className={clsx(
                      "flex items-start justify-between gap-3 rounded-xl",
                      "highlight" in item &&
                        item.highlight &&
                        "-mx-2 border border-terracotta-400/50 bg-terracotta-400/5 px-2 py-2"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-teal-900">{item.name}</div>
                      {item.desc && (
                        <div className="mt-0.5 text-xs leading-snug text-teal-700/60">
                          {item.desc}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 font-serif text-xl text-terracotta-600">
                      {item.price}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Note + CTA */}
        <div className="mx-auto mt-8 max-w-5xl">
          <div className="rounded-2xl border-l-4 border-terracotta-500 bg-cream-50 px-5 py-4">
            <p className="text-sm italic text-teal-800/85">{t.note}</p>
          </div>
          <div className="mt-6 text-center">
            <a
              href={business.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent"
            >
              <MessageCircle className="h-4 w-4" />
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
