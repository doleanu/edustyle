"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { business } from "@/lib/business";
import { type Lang } from "@/lib/content";

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

export const LOCALES: Record<Lang, string> = {
  es: "es-ES",
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
};

// 2024-01-01 was a Monday — a fixed reference week to read localized
// Mon..Sun weekday labels from, regardless of what day "today" is.
const REF_MONDAY = new Date(2024, 0, 1);

export function isoOf(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isDayOpen(date: Date): boolean {
  const hours = business.hours.find((h) => h.day === DAY_KEYS[date.getDay()]);
  return Boolean(hours?.ranges.length);
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

// Monday-first weekday index (0 = Monday .. 6 = Sunday).
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function DatePicker({
  lang,
  value,
  onChange,
  placeholder,
  maxDaysAhead = 60,
}: {
  lang: Lang;
  value: string; // ISO "YYYY-MM-DD", or ""
  onChange: (iso: string) => void;
  placeholder: string;
  maxDaysAhead?: number;
}) {
  const locale = LOCALES[lang];
  const today = startOfDay(new Date());
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxDaysAhead);

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(startOfMonth(today));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;

  const label = selectedDate
    ? (() => {
        const raw = selectedDate.toLocaleDateString(locale, {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        return raw.charAt(0).toUpperCase() + raw.slice(1);
      })()
    : placeholder;

  const monthLabel = (() => {
    const raw = viewMonth.toLocaleDateString(locale, { month: "long", year: "numeric" });
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  })();

  const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(REF_MONDAY);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString(locale, { weekday: "narrow" });
  });

  // Build the calendar grid: leading blanks to align the 1st to its weekday,
  // then every day of the month.
  const firstOffset = mondayIndex(viewMonth);
  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0
  ).getDate();
  const cells: (Date | null)[] = [
    ...Array(firstOffset).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1)
    ),
  ];

  const canGoPrev = !sameMonth(viewMonth, today) && viewMonth > startOfMonth(today);
  const canGoNext = startOfMonth(viewMonth) < startOfMonth(maxDate);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-teal-100 bg-cream-50 px-3 py-2.5 text-left text-sm focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400/30",
          selectedDate ? "text-teal-900" : "text-teal-900/50"
        )}
      >
        <span className="truncate">{label}</span>
        <Calendar className="h-4 w-4 shrink-0 text-terracotta-500" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-2xl border border-teal-100 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => canGoPrev && setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              disabled={!canGoPrev}
              className="rounded-full p-1.5 text-teal-700 transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-teal-900">{monthLabel}</span>
            <button
              type="button"
              onClick={() => canGoNext && setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              disabled={!canGoNext}
              className="rounded-full p-1.5 text-teal-700 transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase text-teal-700/50">
            {weekdayLabels.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <span key={`blank-${i}`} />;
              const iso = isoOf(date);
              const disabled = date < today || date > maxDate || !isDayOpen(date);
              const isSelected = iso === value;
              const isToday = iso === isoOf(today);
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={clsx(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                    disabled && "cursor-not-allowed text-teal-900/20",
                    !disabled && !isSelected && "text-teal-900 hover:bg-cream-100",
                    isSelected && "bg-terracotta-500 font-semibold text-white",
                    !isSelected && isToday && !disabled && "font-semibold text-terracotta-600"
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
