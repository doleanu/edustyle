import { NextRequest } from "next/server";
import { claimOnce } from "@/lib/booking/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Clients can answer the automated WhatsApp message, and that reply lands on
// the Twilio sender — a number nobody reads. Point them to Edu's real
// WhatsApp instead. Once per person per day, so a stranger can't turn this
// into a billed ping-pong.
const REPLY =
  "Hola. Este número solo envía avisos automáticos de tu cita. " +
  "Para cambiar o anular, escribe directamente a Edu: https://wa.me/34694200778";

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const from = String(form?.get("From") ?? "");
  let body = "";
  if (from && (await claimOnce(`wa-inbound:${from}`, 60 * 60 * 24))) {
    body = `<Message>${REPLY}</Message>`;
  }
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${body}</Response>`, {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}
