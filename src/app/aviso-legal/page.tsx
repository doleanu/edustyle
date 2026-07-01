import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal y condiciones de uso del sitio web de EduStyle.",
  robots: { index: true, follow: true },
};

export default function LegalNotice() {
  return (
    <>
      <Header minimal />
      <main className="pt-24 sm:pt-32">
        <article className="container-tight py-12 sm:py-16">
          <Link
            href="/"
            className="text-sm text-teal-700 underline-offset-4 hover:underline"
          >
            ← Volver a la página principal
          </Link>
          <h1 className="mt-6 font-serif text-4xl uppercase tracking-wide text-teal-900 sm:text-5xl">
            Aviso legal
          </h1>

          <div className="prose prose-teal mt-10 max-w-none space-y-6 text-teal-800/90">
            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                1. Titular
              </h2>
              <p className="mt-3 leading-relaxed">
                Este sitio web pertenece a {business.legalName}, barbería situada
                en {business.address.city}, {business.address.country}. Puedes
                contactar en el {business.phone} o en{" "}
                <a
                  href={`mailto:${business.email}`}
                  className="text-teal-700 underline-offset-4 hover:underline"
                >
                  {business.email}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                2. Objeto
              </h2>
              <p className="mt-3 leading-relaxed">
                Este sitio tiene carácter informativo sobre los servicios de
                barbería de EduStyle (cortes de pelo, arreglo de barba, afeitado
                y otros servicios) y facilita la reserva de citas por WhatsApp o
                teléfono.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                3. Reservas y precios
              </h2>
              <p className="mt-3 leading-relaxed">
                Las reservas se gestionan por WhatsApp o teléfono; la cita se
                considera confirmada cuando te respondemos. Los precios mostrados
                son orientativos y pueden variar según el servicio y el largo del
                pelo. Te rogamos que avises con antelación si no vas a poder
                acudir a tu cita.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                4. Propiedad intelectual
              </h2>
              <p className="mt-3 leading-relaxed">
                Todos los contenidos de este sitio (textos, imágenes y logotipo)
                son propiedad de {business.legalName} y están protegidos por la
                normativa de propiedad intelectual. Queda prohibido su uso sin
                autorización.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                5. Responsabilidad
              </h2>
              <p className="mt-3 leading-relaxed">
                Procuramos que la información del sitio sea correcta y esté
                actualizada, pero no garantizamos la ausencia de errores. El uso
                de este sitio web se realiza bajo la responsabilidad del usuario.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
                6. Legislación aplicable
              </h2>
              <p className="mt-3 leading-relaxed">
                Este aviso legal se rige por la legislación española. Para
                cualquier cuestión relacionada, escríbenos a{" "}
                <a
                  href={`mailto:${business.email}`}
                  className="text-teal-700 underline-offset-4 hover:underline"
                >
                  {business.email}
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
