import { Scissors, CalendarCheck, MapPin, Star } from "lucide-react";

const reasons = [
  {
    icon: Scissors,
    title: "Cortes a tu medida",
    description:
      "Degradados, clásicos, diseños y barba trabajada. Adaptamos cada corte a tu tipo de pelo y a tu estilo.",
  },
  {
    icon: CalendarCheck,
    title: "Reserva sin llamadas",
    description:
      "Pide tu cita por WhatsApp cuando quieras, incluso fuera del horario. Te confirmamos en minutos.",
  },
  {
    icon: Star,
    title: "Clientes que repiten",
    description:
      "La mayoría de quienes prueban EduStyle vuelven. Buen trato, buen ambiente y un acabado que se nota.",
  },
  {
    icon: MapPin,
    title: "En tu zona, en Tenerife",
    description:
      "Fácil de encontrar y con ese trato de barbería de barrio en el que te sientes como en casa.",
  },
];

export function WhyUs() {
  return (
    <section id="por-que" className="section">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
            Por qué EduStyle
          </span>
          <h2 className="section-heading mt-3">
            Cuatro razones para sentarte en nuestra silla
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {reasons.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="relative flex gap-5 rounded-3xl bg-cream-50 p-6 sm:p-8"
            >
              <span className="absolute -top-3 left-6 rounded-full bg-teal-800 px-3 py-1 text-xs font-medium text-cream-50">
                0{index + 1}
              </span>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-terracotta-400/20 text-terracotta-600">
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-serif text-2xl uppercase tracking-wide text-teal-900">{title}</h3>
                <p className="mt-2 leading-relaxed text-teal-700/80">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
