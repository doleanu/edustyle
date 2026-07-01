"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { business } from "@/lib/business";
import clsx from "clsx";

const navLinks = [
  { href: "#sobre", label: "Sobre" },
  { href: "#servicios", label: "Servicios" },
  { href: "#precios", label: "Precios" },
  { href: "#por-que", label: "Por qué" },
  { href: "#opiniones", label: "Opiniones" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#contacto", label: "Contacto" },
];

export function Header({ minimal = false }: { minimal?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Logo always navigates to / with a full reload, regardless of current page.
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = "/";
  };

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream-50/95 shadow-sm backdrop-blur"
          : "bg-transparent"
      )}
    >
      <div className="container-tight flex h-20 items-center justify-between sm:h-24">
        <a
          href="/"
          onClick={handleLogoClick}
          className="flex items-center"
          aria-label="EduStyle - ir a la página principal"
        >
          {/* TODO(edu): sustituir por el logo real cuando esté disponible */}
          <span className="font-serif text-2xl font-medium uppercase tracking-wider text-teal-900 sm:text-3xl">
            Edu<span className="text-terracotta-500">Style</span>
          </span>
        </a>

        {!minimal && (
          <>
            <nav className="hidden items-center gap-7 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-teal-800/80 transition-colors hover:text-teal-800"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={business.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <MessageCircle className="h-4 w-4" />
                Reservar
              </a>
            </nav>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="rounded-full p-2 text-teal-800 lg:hidden"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </>
        )}
      </div>

      {!minimal && open && (
        <div className="border-t border-cream-200 bg-cream-50 lg:hidden">
          <nav className="container-tight flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
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
              Reservar por WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
