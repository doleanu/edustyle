"use client";

import { useState, useEffect } from "react";
import { Menu, X, CalendarCheck } from "lucide-react";
import Image from "next/image";
import { content, LANG_LABELS, LANG_PATHS, type Lang } from "@/lib/content";
import { Logo } from "@/components/Logo";
import clsx from "clsx";

const LANGS = Object.keys(LANG_PATHS) as Lang[];

function LangSwitch({ lang, paths }: { lang: Lang; paths: Record<Lang, string> }) {
  const base =
    "px-2 py-1 text-[11px] font-semibold uppercase transition-colors rounded-full";
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-teal-700/20 bg-cream-50/60 p-0.5 backdrop-blur">
      {LANGS.map((code) => (
        <a
          key={code}
          href={paths[code]}
          className={clsx(
            base,
            lang === code ? "bg-teal-800 text-cream-50" : "text-teal-800/70 hover:text-teal-900"
          )}
        >
          {LANG_LABELS[code]}
        </a>
      ))}
    </div>
  );
}

export function Header({
  lang,
  minimal = false,
  langPaths = LANG_PATHS,
}: {
  lang: Lang;
  minimal?: boolean;
  // Override where the language switcher links to — defaults to the
  // homepage in each language, but e.g. legal pages pass their own
  // per-language URLs so switching language stays on the same document.
  langPaths?: Record<Lang, string>;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = content[lang];
  const home = LANG_PATHS[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = home;
  };

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-cream-50/95 shadow-sm backdrop-blur" : "bg-transparent"
      )}
    >
      <div className="container-tight flex h-20 items-center justify-between sm:h-24">
        <a
          href={home}
          onClick={handleLogoClick}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Eduardo Style"
        >
          {/* El logotipo original es un bloque apilado (pelo / nombre / barba):
              a la altura de una cabecera su texto queda ilegible. Aquí se usa
              solo la cara como icono y el nombre va en tipografía, que sí se
              lee a 44 px. El logotipo completo sigue en el pie. */}
          <Image
            src="/marca-dark.png"
            alt=""
            aria-hidden="true"
            width={600}
            height={600}
            priority
            className="h-11 w-11 shrink-0 sm:h-12 sm:w-12"
          />
          {/* El nav completo (9 enlaces + idiomas + CTA) ocupa 983 px de los
              1152 del contenedor, así que a partir de xl solo cabe el icono.
              En móvil tampoco cabe: el nombre empujaba el botón de menú fuera
              de la pantalla. Queda visible en la franja de en medio. */}
          <Logo tone="dark" className="hidden sm:block xl:hidden" />
        </a>

        {!minimal && (
          <>
            <nav className="hidden shrink-0 items-center gap-5 xl:flex">
              {t.nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap text-[13px] text-teal-800/80 transition-colors hover:text-teal-800"
                >
                  {link.label}
                </a>
              ))}
              <LangSwitch lang={lang} paths={langPaths} />
              <a href="#reserva" className="btn-primary">
                <CalendarCheck className="h-4 w-4" />
                {t.navReserve}
              </a>
            </nav>

            <div className="flex items-center gap-2 xl:hidden">
              <LangSwitch lang={lang} paths={langPaths} />
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="rounded-full p-2 text-teal-800"
                aria-label={open ? "Cerrar / Close" : "Menú / Menu"}
                aria-expanded={open}
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </>
        )}

        {minimal && <LangSwitch lang={lang} paths={langPaths} />}
      </div>

      {!minimal && open && (
        <div className="border-t border-cream-200 bg-cream-50 xl:hidden">
          <nav className="container-tight flex flex-col gap-1 py-4">
            {t.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-teal-800 hover:bg-cream-100"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reserva"
              onClick={() => setOpen(false)}
              className="btn-primary mt-3"
            >
              <CalendarCheck className="h-4 w-4" />
              {t.navReserve}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
