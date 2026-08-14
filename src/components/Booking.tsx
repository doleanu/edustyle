"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import { content, type Lang } from "@/lib/content";
import { DatePicker, LOCALES, type ClosedRange } from "@/components/DatePicker";

// The calendar backend (see src/lib/booking) is the only booking path now —
// it shows REAL availability from Google Calendar, takes the client's name +
// phone, and creates a real appointment via /api/book. If the backend probe
// ever comes back false (env vars missing, API blip), this shows a plain
// "unavailable, message us" note rather than a parallel WhatsApp booking flow —
// clients only ever see the one real way to book.
//
// The day field is a calendar popover (see DatePicker.tsx) rather than a
// curated list of the next few open days — some clients book a month or more
// ahead, so it opens up to CALENDAR_DAYS_AHEAD days, only greying out closed
// weekdays and past dates.
const CALENDAR_DAYS_AHEAD = 60;

function formatDayLabel(iso: string, lang: Lang): string {
  const raw = new Date(`${iso}T00:00:00`).toLocaleDateString(LOCALES[lang], {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

type SubmitState = "idle" | "submitting" | "success" | "error" | "taken" | "invalid_phone";

export function Booking({ lang }: { lang: Lang }) {
  const t = content[lang].booking;
  const services = useMemo(
    () => content[lang].prices.groups.flatMap((group) => group.items.map((item) => item.name)),
    [lang]
  );
  // null while probing; true = real calendar backend; false = WhatsApp fallback.
  const [backend, setBackend] = useState<boolean | null>(null);
  const [closedRanges, setClosedRanges] = useState<ClosedRange[]>([]);

  const [service, setService] = useState("");
  const [dayIso, setDayIso] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  const [apiSlots, setApiSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>("idle");

  // Probe once on mount to decide backend vs fallback.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/availability")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setBackend(Boolean(d?.configured));
          setClosedRanges(Array.isArray(d?.closedRanges) ? d.closedRanges : []);
        }
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

  const bookingComplete = Boolean(service && dayIso && time && name.trim() && phone.trim());

  async function handleBook() {
    if (!bookingComplete) return;
    setSubmit("submitting");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, service, date: dayIso, time, company }),
      });
      if (res.ok) {
        setSubmit("success");
      } else if (res.status === 409) {
        setSubmit("taken");
        // refresh availability so the taken slot disappears
        const d = await fetch(`/api/availability?date=${dayIso}`).then((r) => r.json());
        setApiSlots(Array.isArray(d?.slots) ? d.slots : []);
        setTime("");
      } else {
        const data = await res.json().catch(() => null);
        setSubmit(data?.error === "invalid_phone" ? "invalid_phone" : "error");
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
                  .replace("{day}", dayIso ? formatDayLabel(dayIso, lang) : "")
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
                  <DatePicker
                    lang={lang}
                    value={dayIso}
                    onChange={(iso) => {
                      setDayIso(iso);
                      setTime("");
                    }}
                    placeholder={t.dayPlaceholder}
                    maxDaysAhead={CALENDAR_DAYS_AHEAD}
                    closedRanges={closedRanges}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-teal-900">
                  {t.timeLabel}
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={!dayIso || slotsLoading}
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

              {dayIso && !slotsLoading && slots.length === 0 && (
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
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (submit === "invalid_phone") setSubmit("idle");
                    }}
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

              {(submit === "taken" || submit === "error" || submit === "invalid_phone") && (
                <p className="mt-4 rounded-xl bg-terracotta-500/10 px-4 py-3 text-center text-sm text-terracotta-700">
                  {submit === "taken"
                    ? t.takenMsg
                    : submit === "invalid_phone"
                    ? t.invalidPhoneMsg
                    : t.errorMsg}
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
