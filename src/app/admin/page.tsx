"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock,
  LogOut,
  Loader2,
  Check,
  TriangleAlert,
  Scissors,
} from "lucide-react";

// Owner-facing dashboard (Spanish only — this is for Edu). Gated by the Google
// sign-in behind /api/settings: 503 = backend not set up yet, 401 = not signed
// in, 200 = signed in (renders the settings form).

type DayConfig = { enabled: boolean; open: string; close: string };
type Settings = { slotMinutes: number; weeklyHours: Record<number, DayConfig> };

type State =
  | { kind: "loading" }
  | { kind: "unconfigured" }
  | { kind: "signedout" }
  | { kind: "ready"; settings: Settings; connected: boolean; email: string };

const DAY_NAMES: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

const SLOT_OPTIONS = [20, 30, 40, 45, 60];

export default function AdminPage() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (res.status === 503) return setState({ kind: "unconfigured" });
      if (res.status === 401) return setState({ kind: "signedout" });
      const data = await res.json();
      setState({
        kind: "ready",
        settings: data.settings,
        connected: data.connected,
        email: data.ownerEmail,
      });
    } catch {
      setState({ kind: "unconfigured" });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function patchDay(day: number, patch: Partial<DayConfig>) {
    setState((s) =>
      s.kind === "ready"
        ? {
            ...s,
            settings: {
              ...s.settings,
              weeklyHours: {
                ...s.settings.weeklyHours,
                [day]: { ...s.settings.weeklyHours[day], ...patch },
              },
            },
          }
        : s
    );
    setSaved(false);
  }

  async function save() {
    if (state.kind !== "ready") return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.settings),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setState({ kind: "signedout" });
  }

  return (
    <main className="min-h-screen bg-cream-50 py-10 sm:py-16">
      <div className="container-tight max-w-3xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-800 text-cream-50">
            <Scissors className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
              Panel de reservas
            </h1>
            <p className="text-sm text-teal-800/70">Eduardo Style</p>
          </div>
        </div>

        {state.kind === "loading" && (
          <div className="flex items-center gap-2 rounded-2xl bg-cream-100 p-6 text-teal-800/70">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando…
          </div>
        )}

        {state.kind === "unconfigured" && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
            <div className="flex items-center gap-2 font-medium text-amber-900">
              <TriangleAlert className="h-5 w-5" />
              Sistema de reservas aún no configurado
            </div>
            <p className="mt-2 text-sm text-amber-900/80">
              Faltan las credenciales de Google Calendar y del almacenamiento.
              Una vez añadidas en Vercel, esta página permitirá conectar el
              calendario y gestionar el horario. Mientras tanto, la web sigue
              funcionando con reservas por WhatsApp con normalidad.
            </p>
          </div>
        )}

        {state.kind === "signedout" && (
          <div className="rounded-3xl bg-cream-100 p-8 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-800/10 text-teal-800">
              <CalendarCheck className="h-7 w-7" />
            </span>
            <h2 className="mt-4 font-serif text-xl uppercase tracking-wide text-teal-900">
              Conecta tu Google Calendar
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-teal-800/70">
              Inicia sesión con tu cuenta de Google. Tus citas se guardarán en tu
              calendario y los clientes solo verán los huecos libres.
            </p>
            <a
              href="/api/auth/google"
              className="btn-primary mx-auto mt-6 inline-flex"
            >
              <CalendarCheck className="h-4 w-4" />
              Conectar con Google
            </a>
          </div>
        )}

        {state.kind === "ready" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream-100 p-5">
              <div className="flex items-center gap-3">
                <span
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-full " +
                    (state.connected
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700")
                  }
                >
                  {state.connected ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <TriangleAlert className="h-5 w-5" />
                  )}
                </span>
                <div className="text-sm">
                  <div className="font-medium text-teal-900">
                    {state.connected
                      ? "Calendario conectado"
                      : "Calendario sin conectar"}
                  </div>
                  <div className="text-teal-800/60">{state.email}</div>
                </div>
              </div>
              <div className="flex gap-2">
                {!state.connected && (
                  <a href="/api/auth/google" className="btn-primary text-sm">
                    <CalendarCheck className="h-4 w-4" />
                    Conectar
                  </a>
                )}
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-full border border-teal-800/20 px-4 py-2 text-sm text-teal-800 transition-colors hover:bg-cream-200"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </button>
              </div>
            </div>

            {/* Weekly hours */}
            <div className="rounded-3xl bg-cream-100 p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2 font-serif text-lg uppercase tracking-wide text-teal-900">
                <Clock className="h-5 w-5 text-terracotta-500" />
                Tu horario
              </h2>
              <p className="mt-1 text-sm text-teal-800/60">
                Marca los días que trabajas y a qué horas. Los clientes solo
                podrán reservar dentro de este horario.
              </p>

              <div className="mt-5 space-y-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const cfg = state.settings.weeklyHours[day];
                  return (
                    <div
                      key={day}
                      className="flex flex-wrap items-center gap-3 rounded-xl bg-cream-50 px-4 py-3"
                    >
                      <label className="flex w-32 items-center gap-2 text-sm font-medium text-teal-900">
                        <input
                          type="checkbox"
                          checked={cfg.enabled}
                          onChange={(e) =>
                            patchDay(day, { enabled: e.target.checked })
                          }
                          className="h-4 w-4 accent-terracotta-500"
                        />
                        {DAY_NAMES[day]}
                      </label>
                      <div
                        className={
                          "flex items-center gap-2 " +
                          (cfg.enabled ? "" : "pointer-events-none opacity-40")
                        }
                      >
                        <input
                          type="time"
                          value={cfg.open}
                          onChange={(e) => patchDay(day, { open: e.target.value })}
                          className="rounded-lg border border-teal-100 bg-cream-50 px-2 py-1.5 text-sm text-teal-900"
                        />
                        <span className="text-teal-800/50">–</span>
                        <input
                          type="time"
                          value={cfg.close}
                          onChange={(e) => patchDay(day, { close: e.target.value })}
                          className="rounded-lg border border-teal-100 bg-cream-50 px-2 py-1.5 text-sm text-teal-900"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Slot length */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium text-teal-900">
                  Duración de cada cita
                </label>
                <select
                  value={state.settings.slotMinutes}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setState((s) =>
                      s.kind === "ready"
                        ? { ...s, settings: { ...s.settings, slotMinutes: v } }
                        : s
                    );
                    setSaved(false);
                  }}
                  className="rounded-xl border border-teal-100 bg-cream-50 px-3 py-2 text-sm text-teal-900"
                >
                  {SLOT_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m} min
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={save}
                  disabled={saving}
                  className="btn-primary disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Guardar cambios
                </button>
                {saved && (
                  <span className="text-sm font-medium text-green-700">
                    Guardado ✓
                  </span>
                )}
              </div>
            </div>

            {/* How to block time */}
            <div className="rounded-2xl border-l-4 border-terracotta-500 bg-cream-100 px-5 py-4 text-sm text-teal-800/85">
              <strong className="text-teal-900">¿Necesitas bloquear un rato?</strong>{" "}
              Crea un evento en tu Google Calendar (una comida, un recado, lo que
              sea) y esas horas dejarán de aparecer disponibles para los clientes
              automáticamente.
            </div>

            <div className="text-center">
              <a
                href="/"
                className="text-sm text-teal-700 underline-offset-4 hover:underline"
              >
                ← Volver a la web
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
