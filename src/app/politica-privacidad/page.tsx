import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de Eduardo Style: cómo recogemos, usamos y protegemos tus datos personales.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header lang="es" minimal />
      <main className="pt-24 sm:pt-32">
        <article className="container-tight py-12 sm:py-16">
          <Link
            href="/"
            className="text-sm text-teal-700 underline-offset-4 hover:underline"
          >
            ← Volver a la página principal
          </Link>
          <h1 className="mt-6 font-serif text-4xl uppercase tracking-wide text-teal-900 sm:text-5xl">
            Política de privacidad
          </h1>

          <div className="prose prose-teal mt-10 max-w-none space-y-6 text-teal-800/90">
            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                1. Responsable del tratamiento
              </h2>
              <p className="mt-3 leading-relaxed">
                {business.legalName}, con actividad en {business.address.city},{" "}
                {business.address.country}, es responsable del tratamiento de los
                datos recogidos a través de este sitio web y de los canales de
                contacto. Puedes escribirnos en cualquier momento a{" "}
                <a
                  href={`mailto:${business.email}`}
                  className="text-teal-700 underline-offset-4 hover:underline"
                >
                  {business.email}
                </a>{" "}
                o llamarnos al {business.phone}.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                2. Qué datos recogemos
              </h2>
              <p className="mt-3 leading-relaxed">
                Este sitio web tiene un formulario de reserva de citas online.
                Al reservar, recogemos:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>Nombre</li>
                <li>Número de teléfono</li>
                <li>El servicio, día y hora que elijas</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                También podemos recibir tus datos si nos contactas
                directamente por teléfono o email.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                3. Para qué usamos tus datos
              </h2>
              <p className="mt-3 leading-relaxed">Usamos tus datos únicamente para:</p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>Gestionar y confirmar tu cita</li>
                <li>Enviarte un recordatorio automático de tu cita por SMS</li>
                <li>Responder a tus consultas sobre nuestros servicios</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                Los datos de tu cita se guardan en el Google Calendar del
                negocio y el recordatorio se envía a través de Twilio Inc.,
                nuestro proveedor de mensajería SMS — ambos actúan como
                encargados del tratamiento, únicamente para prestar este
                servicio. No usamos tus datos para marketing sin tu
                consentimiento ni los compartimos con terceros con fines
                comerciales.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                4. Conservación
              </h2>
              <p className="mt-3 leading-relaxed">
                Conservamos tus datos durante el tiempo necesario para atender tu
                solicitud y, en su caso, mientras seas cliente, salvo obligación
                legal de conservarlos durante más tiempo.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                5. Tus derechos (RGPD)
              </h2>
              <p className="mt-3 leading-relaxed">
                Conforme al Reglamento (UE) 2016/679 (RGPD) y a la normativa
                española de protección de datos, tienes derecho a acceder,
                rectificar, suprimir, limitar u oponerte al tratamiento de tus
                datos, así como a la portabilidad de los mismos. Para ejercer
                cualquiera de estos derechos, escríbenos a{" "}
                <a
                  href={`mailto:${business.email}`}
                  className="text-teal-700 underline-offset-4 hover:underline"
                >
                  {business.email}
                </a>
                . También puedes presentar una reclamación ante la Agencia
                Española de Protección de Datos (AEPD).
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                6. Cookies
              </h2>
              <p className="mt-3 leading-relaxed">
                Este sitio no utiliza cookies de seguimiento ni de publicidad.
                Únicamente se emplean las cookies técnicas imprescindibles para
                su funcionamiento.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer lang="es" />
    </>
  );
}
