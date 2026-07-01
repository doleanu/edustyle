import { Instagram, ArrowUpRight } from "lucide-react";
import { business } from "@/lib/business";
import { content, type Lang } from "@/lib/content";

// Instagram Reel embed.
// TODO(edu): pega aquí el código de un reel de @edustyle4.
// De una URL tipo https://www.instagram.com/reel/DxAbC123/  ->  "DxAbC123"
const REEL_SHORTCODE: string | null = "DYan7xMo-00";

export function Video({ lang }: { lang: Lang }) {
  const t = content[lang].video;
  return (
    <section id="video" className="section">
      <div className="container-tight">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* Text side */}
          <div className="text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
              {t.eyebrow}
            </span>
            <h2 className="section-heading mt-3">{t.title}</h2>
            <p className="section-subheading mx-auto lg:mx-0">{t.subtitle}</p>
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-teal-700 transition-colors hover:text-terracotta-500"
            >
              <Instagram className="h-5 w-5 text-terracotta-500" />
              <span>{t.hint}</span>
            </a>
          </div>

          {/* Media side — vertical 9:16 frame */}
          <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
            <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-teal-900 shadow-xl ring-1 ring-teal-700/10">
              {REEL_SHORTCODE ? (
                <iframe
                  src={`https://www.instagram.com/reel/${REEL_SHORTCODE}/embed`}
                  title="Eduardo Style en Instagram"
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                // Fallback until a real reel is plugged in: on-brand card linking to IG.
                <a
                  href={business.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-terracotta-500/20 text-terracotta-400 transition-transform group-hover:scale-110">
                    <Instagram className="h-8 w-8" />
                  </span>
                  <span className="font-serif text-2xl uppercase tracking-wide text-cream-50">
                    @edustyle4
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-50/10 px-4 py-2 text-sm font-medium text-cream-50 transition-colors group-hover:bg-terracotta-500">
                    {t.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
