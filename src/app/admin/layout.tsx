import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de reservas — Eduardo Style",
  robots: { index: false, follow: false }, // owner-only, keep it out of search
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
