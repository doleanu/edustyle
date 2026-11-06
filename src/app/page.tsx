import { SiteBody } from "@/components/SiteBody";

// Refreshed on demand when the owner saves in /admin/precios; this is only the daily safety net.
export const revalidate = 86400;

export default async function HomePage() {
  return <SiteBody lang="es" />;
}
