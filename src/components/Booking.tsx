"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import clsx from "clsx";
import { business } from "@/lib/business";
import { content, type Lang } from "@/lib/content";

// Maps JS Date#getDay() (0 = Sunday) to the Spanish day keys used in business.hours.
const DAY_KEYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

const LOCALES: Record<Lang, string> = {
  es: "es-ES",
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
};

type DayOption = {
  key: string;
  label: string;
  open: string;
  close: string;
};

function buildOpenDays(lang: Lang): DayOption[] {
  const locale = LOCALES[lang];
  const days: DayOption[] = [];
  // Look 21 days ahead to find the next 7 open days (handles the closed Sunday).
  for (let i = 0; i < 21 && days.length < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const hours = business.hours.find((h) => h.day === DAY_KEYS[date.getDay()]);
    if (!hours?.open || !hours.close) continue;
    const rawLabel = date.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
    days.push({
      key: date.toDateString(),
      label: rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1),
      open: hours.open,
      close: hours.close,
    });
  }
  return days;
}

function buildSlots(open: string, close: string): string[] {
  const [openH, openM] = open.split(":").map(Number);
  const [closeH, closeM] = close.split(":").map(Number);
  const closeMinutes = closeH * 60 + closeM;
  const slots: string[] = [];
  let h = openH;
  let m = openM;
  while (h * 60 + m < closeMinutes) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 30;
    if (m >= 60) {
      m -= 60;
      h += 1;
    }
  }
  return slots;
}

export function Booking({ lang }: { lang: Lang }) {
  const t = content[lang].booking;
  const services = useMemo(
    () => content[lang].prices.groups.flatMap((group) => group.items.map((item) => item.name)),
    [lang]
  );
  const days = useMemo(() => buildOpenDays(lang), [lang]);

  const [service, setService] = useState("");
  const [dayKey, setDayKey] = useState("");
  const [time, setTime] = useState("");

  const selectedDay = days.find((d) => d.key === dayKey);
  const slots = selectedDay ? buildSlots(selectedDay.open, selectedDay.close) : [];
  const isComplete = Boolean(service && selectedDay && time);

  const whatsappHref = useMemo(() => {
    if (!isComplete || !selectedDay) return business.whatsapp.link;
    const message = [
      t.messageIntro,
      `${t.messageService} ${service}`,
      `${t.messageWhen} ${selectedDay.label}, ${time}`,
      t.messageClosing,
    ].join("\n");
    return `https://wa.me/${business.whatsapp.raw}?text=${encodeURIComponent(message)}`;
  }, [isComplete, selectedDay, service, time, t]);

  return (
    <section id="reserva" className="section bg-cream-50">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
            {t.eyebrow}
          </span>
          <h2 className="section-heading mt-3">{t.title}</h2>
          <p className="section-subheading mx-auto">{t.subtitle}</p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-cream-100 p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm font-medium text-teal-900">
              {t.serviceLabel}
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="rounded-xl border border-teal-100 bg-cream-50 px-3 py-2.5 text-sm text-teal-900 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400/30"
              >
                <option value="">{t.servicePlaceholder}</option>
                {services.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-teal-900">
              {t.dayLabel}
              <select
                value={dayKey}
                onChange={(e) => {
                  setDayKey(e.target.value);
                  setTime("");
                }}
                className="rounded-xl border border-teal-100 bg-cream-50 px-3 py-2.5 text-sm text-teal-900 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400/30"
              >
                <option value="">{t.dayPlaceholder}</option>
                {days.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-teal-900">
              {t.timeLabel}
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={!selectedDay}
                className="rounded-xl border border-teal-100 bg-cream-50 px-3 py-2.5 text-sm text-teal-900 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400/30 disabled:opacity-50"
              >
                <option value="">{t.timePlaceholder}</option>
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!isComplete) e.preventDefault();
            }}
            aria-disabled={!isComplete}
            className={clsx(
              "mt-6 flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-medium text-white transition-all",
              isComplete
                ? "bg-terracotta-500 hover:bg-terracotta-600 hover:shadow-xl active:scale-95"
                : "cursor-not-allowed bg-teal-400/40"
            )}
          >
            <MessageCircle className="h-5 w-5" />
            {t.submitBtn}
          </a>
          {!isComplete && (
            <p className="mt-3 text-center text-xs text-teal-700/60">{t.incompleteHint}</p>
          )}
        </div>
      </div>
    </section>
  );
}
