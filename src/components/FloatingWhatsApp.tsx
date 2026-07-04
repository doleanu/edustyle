import { MessageCircle } from "lucide-react";
import { business } from "@/lib/business";
import { content, type Lang } from "@/lib/content";

// Floating WhatsApp button: appears on all viewports, easy to reach.
export function FloatingWhatsApp({ lang }: { lang: Lang }) {
  const label = content[lang].floatingWhatsappLabel;
  return (
    <a
      href={business.whatsapp.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:bottom-8 sm:right-8"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}
