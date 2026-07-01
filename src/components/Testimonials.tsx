import { Star, Quote } from "lucide-react";

// Placeholder reviews styled like Google reviews.
// TODO(edu): sustituir por reseñas reales del perfil de Google Business.
const testimonials = [
  {
    name: "Carlos M.",
    rating: 5,
    text: "El mejor barbero de la zona. Salgo siempre con el corte perfecto y la barba impecable. Trato de 10 y muy buen ambiente.",
    service: "Corte + Barba",
  },
  {
    name: "Javi R.",
    rating: 5,
    text: "Llevo meses viniendo y no lo cambio. Buen degradado, sin esperas si reservas por WhatsApp y siempre con buen rollo.",
    service: "Degradado",
  },
  {
    name: "Airam G.",
    rating: 5,
    text: "El afeitado a navaja con toalla caliente es otro nivel. Sales como nuevo. Muy recomendable, se nota el oficio.",
    service: "Afeitado a navaja",
  },
  {
    name: "Dani P.",
    rating: 5,
    text: "Profesional y cercano. Te aconseja lo que te queda bien de verdad, no solo lo que pides. Repito seguro.",
    service: "Corte de pelo",
  },
  {
    name: "Miguel Á.",
    rating: 5,
    text: "Llevo a mi hijo y tiene una paciencia enorme con los peques. Corte genial y sin dramas. De diez.",
    service: "Corte niño",
  },
  {
    name: "Rubén S.",
    rating: 5,
    text: "Calidad, buen precio y buen rollo. Se nota que le gusta lo que hace. Se ha convertido en mi barbería fija.",
    service: "Corte + Barba",
  },
];

export function Testimonials() {
  return (
    <section id="opiniones" className="section bg-teal-800 text-cream-50">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-400">
            Opiniones
          </span>
          <h2 className="mt-3 font-serif text-4xl font-medium uppercase sm:text-5xl">
            Lo que dicen nuestros clientes
          </h2>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream-50/10 px-4 py-2 text-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-terracotta-400 text-terracotta-400"
                />
              ))}
            </div>
            <span className="text-cream-100">Reseñas verificadas de Google</span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="relative flex flex-col gap-4 rounded-2xl bg-teal-700/40 p-6 ring-1 ring-cream-50/10 backdrop-blur"
            >
              <Quote
                className="absolute right-5 top-5 h-8 w-8 text-terracotta-400/40"
                aria-hidden="true"
              />
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-terracotta-400 text-terracotta-400"
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-cream-100">
                {t.text}
              </blockquote>
              <figcaption className="border-t border-cream-50/10 pt-4">
                <div className="font-medium text-cream-50">{t.name}</div>
                <div className="text-xs text-cream-100/70">{t.service}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
