"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import Image from "next/image";
import { business } from "@/lib/business";
import { content, type Lang } from "@/lib/content";
import clsx from "clsx";

function LangSwitch({ lang }: { lang: Lang }) {
  const base =
    "px-2.5 py-1 text-xs font-semibold uppercase transition-colors rounded-full";
  return (
    <div className="flex items-center rounded-full border border-teal-700/20 bg-cream-50/60 p-0.5 backdrop-blur">
      <a
        href="/"
        className={clsx(
          base,
          lang === "es" ? "bg-teal-800 text-cream-50" : "text-teal-800/70 hover:text-teal-900"
        )}
      >
        ES
      </a>
      <a
        href="/en"
        className={clsx(
          base,
          lang === "en" ? "bg-teal-800 text-cream-50" : "text-teal-800/70 hover:text-teal-900"
        )}
      >
        EN
      </a>
    </div>
  );
}

export function Header({ lang, minimal = false }: { lang: Lang; minimal?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = content[lang];
  const home = lang === "en" ? "/en" : "/";

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
          className="flex items-center"
          aria-label="Eduardo Style"
        >
          <Image
            src="/logo-dark.png"
            alt="Eduardo Style Barber Shop"
            width={752}
            height={667}
            priority
            className="h-16 w-auto sm:h-20"
          />
        </a>

        {!minimal && (
          <>
            <nav className="hidden items-center gap-6 lg:flex">
              {t.nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-teal-800/80 transition-colors hover:text-teal-800"
                >
                  {link.label}
                </a>
              ))}
              <LangSwitch lang={lang} />
              <a
                href={business.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <MessageCircle className="h-4 w-4" />
                {t.navReserve}
              </a>
            </nav>

            <div className="flex items-center gap-2 lg:hidden">
              <LangSwitch lang={lang} />
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

        {minimal && <LangSwitch lang={lang} />}
      </div>

      {!minimal && open && (
        <div className="border-t border-cream-200 bg-cream-50 lg:hidden">
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
              href={business.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-3"
            >
              <MessageCircle className="h-4 w-4" />
              {t.navReserveMobile}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
