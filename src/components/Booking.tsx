"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import { business } from "@/lib/business";
import { content, type Lang } from "@/lib/content";

// The calendar backend (see src/lib/booking) is the only booking path now —
// it shows REAL availability from Google Calendar, takes the client's name +
// phone, and creates a real appointment via /api/book. If the backend probe
// ever comes back false (env vars missing, API blip), this shows a plain
// "unavailable, message us" note rather than a parallel WhatsApp booking flow —
// clients only ever see the one real way to book.

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
  iso: string; // YYYY-MM-DD
  label: string;
  open: string;
  close: string;
};

function isoOf(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

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
      iso: isoOf(date),
      label: rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1),
      open: hours.open,
      close: hours.close,
    });
  }
  return days;
}

type SubmitState = "idle" | "submitting" | "success" | "error" | "taken";

export function Booking({ lang }: { lang: Lang }) {
  const t = content[lang].booking;
  const services = useMemo(
    () => content[lang].prices.groups.flatMap((group) => group.items.map((item) => item.name)),
    [lang]
  );
  const days = useMemo(() => buildOpenDays(lang), [lang]);

  // null while probing; true = real calendar backend; false = WhatsApp fallback.
  const [backend, setBackend] = useState<boolean | null>(null);

  const [service, setService] = useState("");
  const [dayIso, setDayIso] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  const [apiSlots, setApiSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>("idle");

  const selectedDay = days.find((d) => d.iso === dayIso);

  // Probe once on mount to decide backend vs fallback.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/availability")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setBackend(Boolean(d?.configured));
      })
      .catch(() => {
        if (!cancelled) setBackend(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // In backend mode, load real slots whenever the day changes.
  useEffect(() => {
    if (backend !== true || !dayIso) {
      setApiSlots([]);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setTime("");
    fetch(`/api/availability?date=${dayIso}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setApiSlots(Array.isArray(d?.slots) ? d.slots : []);
      })
      .catch(() => {
        if (!cancelled) setApiSlots([]);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [backend, dayIso]);

  const slots = apiSlots;

  const bookingComplete = Boolean(service && selectedDay && time && name.trim() && phone.trim());

  async function handleBook() {
    if (!bookingComplete || !selectedDay) return;
    setSubmit("submitting");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, service, date: selectedDay.iso, time, company }),
      });
      if (res.ok) {
        setSubmit("success");
      } else if (res.status === 409) {
        setSubmit("taken");
        // refresh availability so the taken slot disappears
        const d = await fetch(`/api/availability?date=${selectedDay.iso}`).then((r) => r.json());
        setApiSlots(Array.isArray(d?.slots) ? d.slots : []);
        setTime("");
      } else {
        setSubmit("error");
      }
    } catch {
      setSubmit("error");
    }
  }

  function reset() {
    setSubmit("idle");
    setService("");
    setDayIso("");
    setTime("");
    setName("");
    setPhone("");
  }

  const selectClass =
    "rounded-xl border border-teal-100 bg-cream-50 px-3 py-2.5 text-sm text-teal-900 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400/30 disabled:opacity-50";

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
          {submit === "success" ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                <Check className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-serif text-2xl uppercase tracking-wide text-teal-900">
                {t.successTitle}
              </h3>
              <p className="mt-2 text-teal-800/80">
                {t.successBody
                  .replace("{day}", selectedDay?.label ?? "")
                  .replace("{time}", time)}
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={reset}
                  className="text-sm text-teal-700 underline-offset-4 hover:underline"
                >
                  {t.againBtn}
                </button>
              </div>
            </div>
          ) : backend === null ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-teal-700/40" />
            </div>
          ) : backend === false ? (
            <div className="text-center">
              <p className="text-teal-800/80">{t.unavailableMsg}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-3">
                <label className="flex flex-col gap-2 text-sm font-medium text-teal-900">
                  {t.serviceLabel}
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">{t.servicePlaceholder}</option>
                    {services.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-teal-900">
                  {t.dayLabel}
                  <select
                    value={dayIso}
                    onChange={(e) => {
                      setDayIso(e.target.value);
                      setTime("");
                    }}
                    className={selectClass}
                  >
                    <option value="">{t.dayPlaceholder}</option>
                    {days.map((d) => (
                      <option key={d.iso} value={d.iso}>
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
                    disabled={!selectedDay || slotsLoading}
                    className={selectClass}
                  >
                    <option value="">
                      {slotsLoading ? t.loadingSlots : t.timePlaceholder}
                    </option>
                    {slots.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {selectedDay && !slotsLoading && slots.length === 0 && (
                <p className="mt-4 text-center text-sm text-teal-800/70">{t.noSlots}</p>
              )}

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-teal-900">
                  {t.nameLabel}
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className={selectClass}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-teal-900">
                  {t.phoneLabel}
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className={selectClass}
                  />
                </label>
                {/* Honeypot — hidden from humans, catches bots */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />
              </div>

              {(submit === "taken" || submit === "error") && (
                <p className="mt-4 rounded-xl bg-terracotta-500/10 px-4 py-3 text-center text-sm text-terracotta-700">
                  {submit === "taken" ? t.takenMsg : t.errorMsg}
                </p>
              )}

              <button
                onClick={handleBook}
                disabled={!bookingComplete || submit === "submitting"}
                className={clsx(
                  "mt-6 flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-medium text-white transition-all",
                  bookingComplete && submit !== "submitting"
                    ? "bg-terracotta-500 hover:bg-terracotta-600 hover:shadow-xl active:scale-95"
                    : "cursor-not-allowed bg-teal-400/40"
                )}
              >
                {submit === "submitting" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
                {t.confirmBtn}
              </button>

              {!bookingComplete && (
                <p className="mt-3 text-center text-xs text-teal-700/60">{t.incompleteHint}</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
