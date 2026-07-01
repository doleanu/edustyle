import { Phone, MessageCircle, Clock } from "lucide-react";
import { business } from "@/lib/business";

export function Contact() {
  return (
    <section
      id="contacto"
      className="relative isolate overflow-hidden bg-teal-800 text-cream-50"
    >
      {/* Decorative accents */}
      <div
        className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-terracotta-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-teal-600/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-tight relative section">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-400">
            Reserva tu cita
          </span>
          <h2 className="mt-3 font-serif text-4xl font-medium uppercase leading-tight sm:text-5xl lg:text-6xl">
            Tu próximo corte,{" "}
            <span className="text-terracotta-400">a un mensaje</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-cream-100/85 sm:text-xl">
            Escríbenos por WhatsApp o llámanos directamente. Te confirmamos la
            cita en minutos y te reservamos tu hueco.
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
            <a
              href={business.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-terracotta-500 px-8 py-4 text-base font-medium text-white transition-all hover:bg-terracotta-600 hover:shadow-xl active:scale-95"
            >
              <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>Reserva por WhatsApp</span>
            </a>
            <a
              href={`tel:${business.phoneE164}`}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-cream-50 px-8 py-4 text-base font-medium text-teal-900 transition-all hover:bg-cream-100 hover:shadow-xl active:scale-95"
            >
              <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" />
              <span>{business.phone}</span>
            </a>
          </div>

          <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-cream-50/10 px-4 py-2 text-sm text-cream-100/80 backdrop-blur">
            <Clock className="h-4 w-4 text-terracotta-400" />
            <span>
              Solemos responder en pocos minutos durante el horario de apertura
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
