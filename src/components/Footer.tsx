import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { business } from "@/lib/business";
import { content, type Lang } from "@/lib/content";
import { Logo } from "@/components/Logo";

export function Footer({ lang }: { lang: Lang }) {
  const t = content[lang].footer;
  return (
    <footer className="bg-teal-900 text-cream-100">
      <div className="container-tight py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo tone="light" />
            <p className="mt-3 text-sm leading-relaxed text-cream-100/80">
              {t.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream-50">
              {t.navTitle}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {t.nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-cream-100/80 hover:text-cream-50">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream-50">
              {t.contactTitle}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-terracotta-400" />
                <a
                  href={business.social.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream-100/80 hover:text-cream-50"
                >
                  {business.address.city}
                  <br />
                  {business.address.country}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-terracotta-400" />
                <a
                  href={`tel:${business.phoneE164}`}
                  className="text-cream-100/80 hover:text-cream-50"
                >
                  {business.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-terracotta-400" />
                <a
                  href={`mailto:${business.email}`}
                  className="text-cream-100/80 hover:text-cream-50"
                >
                  {business.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream-50">
              {t.followTitle}
            </h4>
            <div className="mt-4 flex gap-3">
              <a
                href={business.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Eduardo Style"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-100/10 transition-colors hover:bg-terracotta-500"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={business.social.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps Eduardo Style"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-100/10 transition-colors hover:bg-terracotta-500"
              >
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream-100/10 pt-6 text-xs text-cream-100/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {business.name}. {t.rights}
          </p>
          <div className="flex gap-6">
            <a href="/politica-privacidad" className="hover:text-cream-50">
              {t.privacy}
            </a>
            <a href="/aviso-legal" className="hover:text-cream-50">
              {t.legal}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
