import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PriceListEditor } from "@/components/admin/PriceListEditor";
import { editorConfig, pl } from "@/lib/pricelist/instance";
import { hasBookingBackend } from "@/lib/booking/config";
import { readSession, SESSION_COOKIE } from "@/lib/booking/session";

export const dynamic = "force-dynamic";

// Owner-only. The login lives in /admin (same signed session cookie), so anyone not signed in goes there.
export default async function PricesAdminPage() {
  const jar = await cookies();
  if (!hasBookingBackend() || !readSession(jar.get(SESSION_COOKIE)?.value)) redirect("/admin");

  const { data } = await pl.getData();
  const link = { border: "1px solid #cfcfd4", borderRadius: 999, padding: "6px 14px", font: "700 11px system-ui", letterSpacing: ".05em", textTransform: "uppercase", color: "#666", textDecoration: "none" } as const;
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px 64px", fontFamily: "system-ui, sans-serif", color: "#1d1d1f" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>Precios y servicios</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6e6e73" }}>
            Cambia precios, añade o quita servicios. La web se actualiza en los 4 idiomas.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flex: "none" }}>
          <a href="/admin" style={link}>Reservas</a>
          <a href="/#precios" target="_blank" rel="noopener noreferrer" style={link}>Ver web</a>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <PriceListEditor ec={editorConfig} initialData={data} />
      </div>
    </main>
  );
}
