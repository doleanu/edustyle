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
                Este sitio web no recoge datos de forma automática ni utiliza
                formularios. Los datos que nos facilitas voluntariamente por
                WhatsApp, teléfono o email pueden incluir:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>Nombre</li>
                <li>Número de teléfono</li>
                <li>La información que decidas compartir al pedir tu cita</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                3. Para qué usamos tus datos
              </h2>
              <p className="mt-3 leading-relaxed">Usamos tus datos únicamente para:</p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>Gestionar y confirmar tu cita</li>
                <li>Responder a tus consultas sobre nuestros servicios</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                No usamos tus datos para marketing sin tu consentimiento ni los
                compartimos con terceros con fines comerciales.
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
