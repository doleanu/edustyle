import { revalidatePath } from "next/cache";
import { makeSaveHandler } from "@/lib/pricelist/handler";
import { pl, isAuthed, REVALIDATE_PATHS } from "@/lib/pricelist/instance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Auth, size cap, full server-side validation, version check and previous-copy backup live in the kit.
export const POST = makeSaveHandler({
  isAuthed,
  save: pl.save,
  revalidate: () => {
    for (const p of REVALIDATE_PATHS) revalidatePath(p);
  },
});
