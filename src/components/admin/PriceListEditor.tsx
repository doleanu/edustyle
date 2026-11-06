"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LIMITS,
  parsePriceInput,
  priceToInput,
  type Item,
  type LText,
  type Price,
  type PriceListConfig,
  type PriceListData,
} from "@/lib/pricelist/model";

/* ---------------------------------------------------------------------------
   admin-kit · owner-facing editor (Spanish UI). Self-contained: its own CSS
   (scoped under .plk), so it looks the same on any site whatever its Tailwind /
   design system. One state tree = the whole price list; "Guardar" posts it in one
   request and the server validates it again.
   --------------------------------------------------------------------------- */

export type EditorConfig = {
  cfg: PriceListConfig;
  /** "producto" / "productos", "servicio" / "servicios"… */
  noun: { one: string; many: string; article?: "un" | "una" };
  /** non-default languages shown under «Más», with their display names */
  langs: { code: string; label: string }[];
  groups: { id: string; label: string }[];
  categories: { id: string; title: string; group: string }[];
  features: { note: boolean; highlight: boolean };
  /** item id → reason: its name can't be changed/deleted (e.g. other code depends on the name) */
  locked?: Record<string, string>;
  /** POST endpoint, e.g. "/api/admin/pricelist" */
  endpoint: string;
  /** one-line hint about accepted price formats */
  priceHint?: string;
  /** brand accent colour for buttons */
  accent?: string;
  /** link shown in the header (public page) */
  viewHref?: string;
};

type Row = {
  id: string;
  name: Record<string, string>;
  note: Record<string, string>;
  price: string;
  hidden: boolean;
  highlight: boolean;
  isNew: boolean;
  /** the price as stored + the text it was shown as: an untouched price keeps its per-language texts */
  origPrice: Price | null;
  origPriceInput: string;
};
type Cat = { id: string; title: string; group: string; rows: Row[] };

const blank = (langs: readonly string[]): Record<string, string> => Object.fromEntries(langs.map((l) => [l, ""]));

function toRow(it: Item, ec: EditorConfig): Row {
  const price = priceToInput(it.price, ec.cfg);
  const name = blank(ec.cfg.langs);
  const note = blank(ec.cfg.langs);
  for (const l of ec.cfg.langs) {
    name[l] = it.name[l] ?? "";
    note[l] = it.note?.[l] ?? "";
  }
  return { id: it.id, name, note, price, hidden: Boolean(it.hidden), highlight: Boolean(it.highlight), isNew: false, origPrice: it.price, origPriceInput: price };
}

function fromData(ec: EditorConfig, data: PriceListData): Cat[] {
  const byId = new Map(data.categories.map((c) => [c.id, c]));
  return ec.categories.map((m) => ({ ...m, rows: (byId.get(m.id)?.items ?? []).map((it) => toRow(it, ec)) }));
}

function lt(t: Record<string, string>, langs: readonly string[]): LText | undefined {
  const out: LText = {};
  for (const l of langs) if (t[l]?.trim()) out[l] = t[l].trim();
  return Object.keys(out).length ? out : undefined;
}

function rowPrice(r: Row, cfg: PriceListConfig): Price | null {
  if (r.origPrice && r.price.trim() === r.origPriceInput.trim()) return r.origPrice;
  return parsePriceInput(r.price, cfg);
}

function rowError(r: Row, ec: EditorConfig): string | null {
  const d = ec.cfg.defaultLang;
  if (!r.name[d]?.trim()) return "Falta el nombre.";
  if (r.name[d].trim().length > LIMITS.name) return `El nombre es demasiado largo (máx. ${LIMITS.name}).`;
  if (!r.price.trim()) return "Falta el precio.";
  if (!rowPrice(r, ec.cfg)) return "Precio no válido." + (ec.priceHint ? ` ${ec.priceHint}` : "");
  if ((r.note[d] ?? "").trim().length > LIMITS.note) return `La descripción es demasiado larga (máx. ${LIMITS.note}).`;
  return null;
}

function toData(cats: Cat[], version: number, ec: EditorConfig): PriceListData {
  const d = ec.cfg.defaultLang;
  return {
    version,
    updatedAt: "",
    categories: cats.map((c) => ({
      id: c.id,
      items: c.rows.map((r): Item => {
        const item: Item = {
          id: r.id,
          name: lt(r.name, ec.cfg.langs) ?? { [d]: "" },
          price: rowPrice(r, ec.cfg) ?? { kind: "text", text: { [d]: r.price.trim() } },
        };
        const note = ec.features.note ? lt(r.note, ec.cfg.langs) : undefined;
        if (note) item.note = note;
        if (r.hidden) item.hidden = true;
        if (ec.features.highlight && r.highlight) item.highlight = true;
        return item;
      }),
    })),
  };
}

const snapshot = (cats: Cat[]) =>
  JSON.stringify(cats.map((c) => c.rows.map((r) => [r.id, r.name, r.note, r.price.trim(), r.hidden, r.highlight])));
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const newId = () => "n" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

export function PriceListEditor({ ec, initialData }: { ec: EditorConfig; initialData: PriceListData }) {
  const d = ec.cfg.defaultLang;
  const [cats, setCats] = useState<Cat[]>(() => fromData(ec, initialData));
  const [version, setVersion] = useState(initialData.version);
  const [savedSnap, setSavedSnap] = useState(() => snapshot(fromData(ec, initialData)));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error" | "conflict">("idle");
  const [message, setMessage] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [query, setQuery] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [focusId, setFocusId] = useState<string | null>(null);
  const flash = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dirty = useMemo(() => snapshot(cats) !== savedSnap, [cats, savedSnap]);
  const searching = query.trim().length > 0;
  const q = norm(query.trim());
  const locked = ec.locked ?? {};
  const many = ec.noun.many;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!focusId) return;
    document.getElementById(`plk-name-${focusId}`)?.focus();
    setFocusId(null);
  }, [focusId, cats]);

  function patchRow(catId: string, rowId: string, patch: Partial<Row>) {
    setCats((cs) => cs.map((c) => (c.id !== catId ? c : { ...c, rows: c.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)) })));
    if (status === "saved" || status === "error") setStatus("idle");
  }
  const setText = (catId: string, r: Row, field: "name" | "note", lang: string, value: string) =>
    patchRow(catId, r.id, { [field]: { ...r[field], [lang]: value } } as Partial<Row>);

  function move(catId: string, rowId: string, dir: -1 | 1) {
    setCats((cs) =>
      cs.map((c) => {
        if (c.id !== catId) return c;
        const i = c.rows.findIndex((r) => r.id === rowId);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= c.rows.length) return c;
        const rows = [...c.rows];
        [rows[i], rows[j]] = [rows[j], rows[i]];
        return { ...c, rows };
      })
    );
  }

  function remove(catId: string, row: Row) {
    if (!window.confirm(`¿Eliminar «${row.name[d] || `este ${ec.noun.one}`}»?\n\nSi solo quieres que no salga por ahora, usa «Ocultar».`)) return;
    setCats((cs) => cs.map((c) => (c.id !== catId ? c : { ...c, rows: c.rows.filter((r) => r.id !== row.id) })));
  }

  function add(catId: string) {
    const id = newId();
    const row: Row = { id, name: blank(ec.cfg.langs), note: blank(ec.cfg.langs), price: "", hidden: false, highlight: false, isNew: true, origPrice: null, origPriceInput: "" };
    setCats((cs) => cs.map((c) => (c.id !== catId ? c : { ...c, rows: [...c.rows, row] })));
    setOpenCats((o) => ({ ...o, [catId]: true }));
    setFocusId(id);
  }

  function discard() {
    if (!window.confirm("¿Descartar todos los cambios sin guardar?")) return;
    setCats(fromData(ec, initialData));
    setSavedSnap(snapshot(fromData(ec, initialData)));
    setShowErrors(false);
    setStatus("idle");
  }

  async function save() {
    const bad = cats.flatMap((c) => c.rows.filter((r) => rowError(r, ec)).map((r) => ({ c, r })));
    if (bad.length > 0) {
      setShowErrors(true);
      setOpenCats((o) => ({ ...o, ...Object.fromEntries(bad.map(({ c }) => [c.id, true])) }));
      setStatus("error");
      setMessage(`Hay ${bad.length} ${bad.length === 1 ? ec.noun.one : many} con datos que corregir (marcados en rojo).`);
      setTimeout(() => document.getElementById(`plk-row-${bad[0].r.id}`)?.scrollIntoView({ block: "center", behavior: "smooth" }), 50);
      return;
    }
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch(ec.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseVersion: version, data: toData(cats, version, ec) }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; version?: number; message?: string };
      if (res.ok && json.ok && typeof json.version === "number") {
        const settled = cats.map((c) => ({ ...c, rows: c.rows.map((r) => ({ ...r, isNew: false, origPrice: rowPrice(r, ec.cfg), origPriceInput: r.price })) }));
        setCats(settled);
        setSavedSnap(snapshot(settled));
        setVersion(json.version);
        setShowErrors(false);
        setStatus("saved");
        if (flash.current) clearTimeout(flash.current);
        flash.current = setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 8000);
      } else if (res.status === 409) {
        setStatus("conflict");
        setMessage("Los datos se han cambiado desde otro dispositivo o pestaña.");
      } else if (res.status === 401) {
        setStatus("error");
        setMessage("La sesión ha caducado. Vuelve a entrar (tus cambios siguen aquí hasta que cierres la página).");
      } else {
        setStatus("error");
        setMessage(json.message || "No se pudo guardar. Inténtalo de nuevo.");
      }
    } catch {
      setStatus("error");
      setMessage("Sin conexión. Inténtalo de nuevo.");
    }
  }

  const total = cats.reduce((n, c) => n + c.rows.length, 0);
  const untranslated = ec.langs.length
    ? cats.reduce((n, c) => n + c.rows.filter((r) => ec.langs.some((l) => !r.name[l.code]?.trim())).length, 0)
    : 0;

  function renderCat(c: Cat) {
    const visible = searching ? c.rows.filter((r) => norm(r.name[d] ?? "").includes(q)) : c.rows;
    if (searching && visible.length === 0) return null;
    const open = searching || Boolean(openCats[c.id]);
    const hiddenCount = c.rows.filter((r) => r.hidden).length;
    return (
      <section key={c.id} className="plk-cat">
        <button type="button" aria-expanded={open} onClick={() => setOpenCats((o) => ({ ...o, [c.id]: !open }))} className="plk-cat-head">
          <span className="plk-cat-title">{c.title}</span>
          <span className="plk-cat-meta">
            {hiddenCount > 0 && <span className="plk-chip">{hiddenCount} oculto{hiddenCount > 1 ? "s" : ""}</span>}
            <span>{c.rows.length}</span>
            <span aria-hidden className={open ? "plk-caret open" : "plk-caret"}>▾</span>
          </span>
        </button>

        {open && (
          <div className="plk-cat-body">
            <ul className="plk-list">
              {visible.map((r) => {
                const err = showErrors ? rowError(r, ec) : null;
                const idx = c.rows.findIndex((x) => x.id === r.id);
                const moreOpen = Boolean(openRows[r.id]);
                const lockedReason = locked[r.id];
                const missingTr = ec.langs.some((l) => !r.name[l.code]?.trim());
                return (
                  <li key={r.id} id={`plk-row-${r.id}`} className={r.hidden ? "plk-row dim" : "plk-row"}>
                    <div className="plk-line">
                      <input
                        id={`plk-name-${r.id}`}
                        value={r.name[d] ?? ""}
                        onChange={(e) => setText(c.id, r, "name", d, e.target.value)}
                        placeholder={`Nombre del ${ec.noun.one}`}
                        aria-label="Nombre"
                        maxLength={LIMITS.name}
                        disabled={Boolean(lockedReason)}
                        className={`plk-input plk-grow${err && !r.name[d]?.trim() ? " bad" : ""}`}
                      />
                      <span className="plk-price">
                        <input
                          value={r.price}
                          onChange={(e) => patchRow(c.id, r.id, { price: e.target.value })}
                          placeholder="0,00"
                          inputMode="decimal"
                          aria-label="Precio"
                          className={`plk-input plk-price-in${err && !rowPrice(r, ec.cfg) ? " bad" : ""}`}
                        />
                        <b>€</b>
                      </span>
                    </div>

                    <div className="plk-actions">
                      <button type="button" className="plk-btn" disabled={searching || idx === 0} onClick={() => move(c.id, r.id, -1)} aria-label="Subir" title="Subir">▲</button>
                      <button type="button" className="plk-btn" disabled={searching || idx === c.rows.length - 1} onClick={() => move(c.id, r.id, 1)} aria-label="Bajar" title="Bajar">▼</button>
                      <button type="button" className="plk-btn" onClick={() => patchRow(c.id, r.id, { hidden: !r.hidden })}>{r.hidden ? "Mostrar" : "Ocultar"}</button>
                      <button type="button" className="plk-btn" aria-expanded={moreOpen} onClick={() => setOpenRows((o) => ({ ...o, [r.id]: !moreOpen }))}>{moreOpen ? "Menos" : "Más"}</button>
                      <button type="button" className="plk-btn danger" disabled={Boolean(lockedReason)} title={lockedReason} onClick={() => remove(c.id, r)}>Eliminar</button>
                      <span className="plk-tags">
                        {r.isNew && <span className="plk-chip solid">Nuevo</span>}
                        {r.hidden && <span className="plk-chip">Oculto en la web</span>}
                        {r.highlight && <span className="plk-chip warm">Destacado</span>}
                        {!r.isNew && missingTr && <span className="plk-chip amber">Sin traducir</span>}
                      </span>
                    </div>

                    {lockedReason && <p className="plk-help">🔒 {lockedReason}</p>}
                    {err && <p className="plk-err">{err}</p>}

                    {moreOpen && (
                      <div className="plk-more">
                        {ec.features.note && (
                          <label className="plk-field">
                            <span>Descripción (opcional)</span>
                            <input value={r.note[d] ?? ""} onChange={(e) => setText(c.id, r, "note", d, e.target.value)} maxLength={LIMITS.note} className="plk-input" />
                          </label>
                        )}
                        {ec.features.highlight && (
                          <label className="plk-check">
                            <input type="checkbox" checked={r.highlight} onChange={(e) => patchRow(c.id, r.id, { highlight: e.target.checked })} />
                            <span>Destacar este {ec.noun.one} en la web</span>
                          </label>
                        )}
                        {ec.priceHint && <p className="plk-help">Precio: {ec.priceHint}</p>}
                        {ec.langs.length > 0 && (
                          <>
                            <p className="plk-help">
                              Las traducciones son opcionales: si las dejas vacías, en ese idioma saldrá el texto en español. Si cambias el nombre, revisa también sus traducciones.
                            </p>
                            {ec.langs.map((l) => (
                              <div key={l.code} className="plk-pair">
                                <label className="plk-field">
                                  <span>{l.label} · nombre</span>
                                  <input value={r.name[l.code] ?? ""} onChange={(e) => setText(c.id, r, "name", l.code, e.target.value)} maxLength={LIMITS.name} disabled={Boolean(lockedReason)} className="plk-input" />
                                </label>
                                {ec.features.note && (
                                  <label className="plk-field">
                                    <span>{l.label} · descripción</span>
                                    <input value={r.note[l.code] ?? ""} onChange={(e) => setText(c.id, r, "note", l.code, e.target.value)} maxLength={LIMITS.note} className="plk-input" />
                                  </label>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            {!searching && (
              <button type="button" onClick={() => add(c.id)} className="plk-add">
                + Añadir {ec.noun.one} a {c.title}
              </button>
            )}
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="plk" style={{ ["--plk-accent" as string]: ec.accent ?? "#1f6feb" }}>
      <style>{CSS}</style>

      <div className="plk-bar">
        <p className="plk-status" role="status" aria-live="polite">
          {status === "saved" && <b className="ok">✓ Guardado. La web se actualiza en unos segundos.</b>}
          {status === "saving" && <span>Guardando…</span>}
          {(status === "error" || status === "conflict") && <b className="no">{message}</b>}
          {status === "idle" && (dirty ? <b className="warn">Tienes cambios sin guardar.</b> : <span className="muted">Sin cambios.</span>)}
        </p>
        <div className="plk-bar-actions">
          {dirty && status !== "saving" && <button type="button" onClick={discard} className="plk-link">Descartar</button>}
          {status === "conflict" ? (
            <button type="button" onClick={() => window.location.reload()} className="plk-primary red">Recargar</button>
          ) : (
            <button type="button" onClick={save} disabled={!dirty || status === "saving"} className="plk-primary">Guardar</button>
          )}
        </div>
      </div>

      <div className="plk-tools">
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Buscar ${ec.noun.article === "una" ? "una" : "un"} ${ec.noun.one}…`} aria-label="Buscar" className="plk-input" />
        <p className="plk-help">
          {total} {many}
          {untranslated > 0 && ` · ${untranslated} sin alguna traducción (en esos idiomas sale el español)`}
        </p>
      </div>

      {ec.groups.map((g) => {
        const list = cats.filter((c) => c.group === g.id);
        if (list.length === 0) return null;
        return (
          <div key={g.id}>
            {ec.groups.length > 1 && <h2 className="plk-group">{g.label}</h2>}
            <div className="plk-cats">{list.map(renderCat)}</div>
          </div>
        );
      })}
    </div>
  );
}

const CSS = `
.plk{--ink:#1d1d1f;--mute:#6e6e73;--line:#e3e3e6;--bg:#f6f6f7;--card:#fff;font:15px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ink);padding-bottom:4rem}
.plk *,.plk *::before,.plk *::after{box-sizing:border-box}
.plk button{font:inherit;cursor:pointer}
.plk-bar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin:0 -1rem 1rem;padding:.7rem 1rem;background:rgba(255,255,255,.96);border-bottom:1px solid var(--line);backdrop-filter:blur(6px)}
.plk-status{margin:0;min-width:0;font-size:.9rem}
.plk-status .ok{color:#15803d}.plk-status .no{color:#dc2626}.plk-status .warn{color:#b45309}.plk-status .muted{color:var(--mute)}
.plk-bar-actions{display:flex;align-items:center;gap:.6rem;flex:none}
.plk-primary{border:0;border-radius:999px;background:var(--plk-accent);color:#fff;padding:.55rem 1.3rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;font-size:.8rem}
.plk-primary.red{background:#dc2626}
.plk-primary:disabled{opacity:.4;cursor:default}
.plk-link{border:0;background:none;color:var(--mute);font-weight:700;text-transform:uppercase;letter-spacing:.04em;font-size:.72rem}
.plk-link:hover{color:var(--ink)}
.plk-tools{margin-bottom:1.1rem}
.plk-help{margin:.4rem 0 0;font-size:.78rem;color:var(--mute)}
.plk-err{margin:.4rem 0 0;font-size:.8rem;font-weight:600;color:#dc2626}
.plk-input{width:100%;border:1px solid #cfcfd4;border-radius:10px;background:#fff;padding:.55rem .75rem;font:inherit;font-size:.92rem;color:var(--ink);outline:none}
.plk-input:focus{border-color:var(--plk-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--plk-accent) 18%,transparent)}
.plk-input:disabled{background:#f1f1f3;color:var(--mute)}
.plk-input.bad{border-color:#dc2626}
.plk-group{margin:1.6rem 0 .5rem;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mute)}
.plk-cats{display:grid;gap:.5rem}
.plk-cat{background:var(--card);border:1px solid var(--line);border-radius:16px}
.plk-cat-head{display:flex;width:100%;align-items:center;justify-content:space-between;gap:.75rem;border:0;background:none;padding:.8rem 1rem;text-align:left;color:var(--ink)}
.plk-cat-title{font-weight:700;font-size:1.05rem}
.plk-cat-meta{display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:var(--mute);flex:none}
.plk-caret{transition:transform .15s}.plk-caret.open{transform:rotate(180deg)}
.plk-cat-body{border-top:1px solid var(--line);padding:.25rem .75rem .75rem}
.plk-list{list-style:none;margin:0;padding:0}
.plk-row{padding:.8rem 0;border-bottom:1px solid var(--line)}
.plk-row:last-child{border-bottom:0}
.plk-row.dim{opacity:.6}
.plk-line{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem}
.plk-grow{flex:1 1 11rem;min-width:0}
.plk-price{display:flex;align-items:center;gap:.25rem}
.plk-price b{color:var(--plk-accent)}
.plk-price-in{width:8.5rem;text-align:right;font-weight:700;color:var(--plk-accent)}
.plk-actions{display:flex;flex-wrap:wrap;align-items:center;gap:.35rem;margin-top:.55rem}
.plk-btn{min-width:2.25rem;height:2.25rem;border:1px solid #cfcfd4;border-radius:9px;background:#fff;padding:0 .65rem;font-size:.78rem;font-weight:700;color:#444}
.plk-btn:hover:not(:disabled){border-color:#888;color:var(--ink)}
.plk-btn:disabled{opacity:.3;cursor:default}
.plk-btn.danger{color:#dc2626}
.plk-tags{display:flex;flex-wrap:wrap;gap:.3rem;margin-left:.2rem}
.plk-chip{border-radius:999px;background:#ececef;padding:.1rem .55rem;font-size:.7rem;color:#555}
.plk-chip.solid{background:var(--plk-accent);color:#fff;font-weight:700}
.plk-chip.amber{background:#fef3c7;color:#92400e}
.plk-chip.warm{background:#ffedd5;color:#9a3412}
.plk-more{margin-top:.7rem;display:grid;gap:.7rem;border-radius:12px;background:var(--bg);padding:.8rem}
.plk-field{display:block}
.plk-field>span{display:block;margin-bottom:.25rem;font-size:.75rem;font-weight:600;color:var(--mute)}
.plk-pair{display:grid;gap:.6rem}
@media(min-width:640px){.plk-pair{grid-template-columns:1fr 1fr}}
.plk-check{display:flex;align-items:center;gap:.5rem;font-size:.88rem}
.plk-add{width:100%;margin-top:.6rem;border:2px dashed #cfcfd4;border-radius:12px;background:none;padding:.7rem;font-weight:700;color:var(--plk-accent)}
.plk-add:hover{border-color:var(--plk-accent)}
`;
