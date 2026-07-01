import { HeartHandshake, Sparkles, UserCog } from "lucide-react";

const values = [
  {
    icon: UserCog,
    title: "Oficio",
    description:
      "Años detrás de la silla. Cada corte, cada barba y cada degradado hecho con técnica y buen pulso.",
  },
  {
    icon: HeartHandshake,
    title: "Cercanía",
    description:
      "Aquí no eres un número. Te escuchamos, entendemos tu estilo y te aconsejamos lo que de verdad te queda bien.",
  },
  {
    icon: Sparkles,
    title: "Detalle",
    description:
      "Toalla caliente, líneas limpias y acabados cuidados. Sales con la sensación de haberte cuidado de verdad.",
  },
];

export function About() {
  return (
    <section id="sobre" className="section">
      <div className="container-tight">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
              Sobre nosotros
            </span>
            <h2 className="section-heading mt-3">
              No es solo un corte. Es tu imagen.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-teal-800/90">
              En <strong className="font-medium text-teal-900">EduStyle</strong>{" "}
              tratamos cada cliente como se merece: sin prisas, escuchando lo que
              buscas y cuidando cada detalle. Cortes de pelo, arreglo de barba,
              afeitado clásico a navaja y diseños personalizados, todo en un{" "}
              <strong className="font-medium text-teal-900">
                ambiente cercano y relajado
              </strong>
              .
            </p>
            <p className="mt-4 text-base leading-relaxed text-teal-700/80">
              Da igual si vienes a por tu corte de siempre o quieres cambiar de
              look por completo: te aconsejamos lo que mejor te queda y lo hacemos
              con la técnica y el mimo que se merece tu imagen.
            </p>
            <p className="mt-4 text-base leading-relaxed text-teal-700/80">
              Reservar es fácil.{" "}
              <strong className="font-medium text-teal-900">
                Un mensaje de WhatsApp y listo.
              </strong>
            </p>
          </div>

          <div className="grid gap-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex gap-4 rounded-2xl border border-teal-700/10 bg-cream-50 p-6 transition-all hover:border-terracotta-400/40 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-700/10 text-teal-700 transition-colors group-hover:bg-terracotta-500 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl uppercase tracking-wide text-teal-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-teal-700/80">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
