import type { SaveResult } from "./service";

const MAX_BODY_BYTES = 800_000; // a whole menu is ~100 KB; much bigger is not from the editor

export function getCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return undefined;
}

/**
 * Framework-agnostic POST handler for the editor's "Guardar" button.
 *   export const POST = makeSaveHandler({ isAuthed, save: pl.save, revalidate })
 */
export function makeSaveHandler(opts: {
  isAuthed: (req: Request) => boolean | Promise<boolean>;
  save: (input: unknown, baseVersion: number) => Promise<SaveResult>;
  /** called after a successful save: revalidatePath(...) for every page that shows the data */
  revalidate: () => void | Promise<void>;
}) {
  return async function POST(req: Request): Promise<Response> {
    if (!(await opts.isAuthed(req))) return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });

    if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
      return Response.json({ ok: false, error: "too_large" }, { status: 413 });
    }
    let body: { baseVersion?: unknown; data?: unknown };
    try {
      const text = await req.text();
      if (text.length > MAX_BODY_BYTES) return Response.json({ ok: false, error: "too_large" }, { status: 413 });
      body = JSON.parse(text);
    } catch {
      return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
    }
    if (typeof body.baseVersion !== "number") return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });

    const result = await opts.save(body.data, body.baseVersion);
    if (!result.ok) {
      const status = result.error === "conflict" ? 409 : result.error === "invalid" ? 400 : 500;
      return Response.json({ ok: false, error: result.error, message: result.message }, { status });
    }
    await opts.revalidate();
    return Response.json({ ok: true, version: result.version });
  };
}
