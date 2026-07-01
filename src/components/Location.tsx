import { MapPin, Phone, Clock, MessageCircle, Navigation } from "lucide-react";
import { business } from "@/lib/business";
import { content, type Lang } from "@/lib/content";

export function Location({ lang }: { lang: Lang }) {
  const t = content[lang].location;
  const days = content[lang].days;
  return (
    <section id="ubicacion" className="section">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
            {t.eyebrow}
          </span>
          <h2 className="section-heading mt-3">{t.title}</h2>
          <p className="section-subheading mx-auto">{t.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Map */}
          <div className="overflow-hidden rounded-3xl shadow-lg lg:col-span-3">
            <iframe
              title="EduStyle · Google Maps"
              src={`https://www.google.com/maps?q=${business.geo.latitude},${business.geo.longitude}&hl=${lang}&z=16&output=embed`}
              className="h-full min-h-[400px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="rounded-2xl bg-cream-100 p-6">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-terracotta-500" />
                <div>
                  <h3 className="font-medium text-teal-900">{t.addressLabel}</h3>
                  <p className="mt-1 text-sm text-teal-800/80">
                    {business.address.city}, {business.address.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-cream-100 p-6">
              <div className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-terracotta-500" />
                <div>
                  <h3 className="font-medium text-teal-900">{t.phoneLabel}</h3>
                  <a
                    href={`tel:${business.phoneE164}`}
                    className="mt-1 block text-sm text-teal-800/80 hover:text-teal-700"
                  >
                    {business.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-cream-100 p-6">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 shrink-0 text-terracotta-500" />
                <div className="flex-1">
                  <h3 className="font-medium text-teal-900">{t.hoursLabel}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-teal-800/80">
                    {business.hours.map((h) => (
                      <li key={h.day} className="flex justify-between gap-3">
                        <span>{days[h.day] ?? h.day}</span>
                        <span className="font-medium">
                          {h.open && h.close ? `${h.open} - ${h.close}` : t.closed}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={business.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent flex-1"
              >
                <MessageCircle className="h-4 w-4" />
                {t.whatsappBtn}
              </a>
              <a href={`tel:${business.phoneE164}`} className="btn-primary flex-1">
                <Phone className="h-4 w-4" />
                {t.callBtn}
              </a>
            </div>

            <a
              href={business.social.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Navigation className="h-4 w-4" />
              {t.mapsBtn}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
