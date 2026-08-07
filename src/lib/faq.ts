// Single source of truth for the JSON-LD FAQPage schema (FAQ.tsx renders the
// per-language versions from content.ts directly — this file mirrors the
// Spanish ones so the two never diverge again).

export const faqs = [
  {
    question: "¿Necesito pedir cita o puedo ir directamente?",
    answer:
      "Puedes pasarte sin cita, pero para no esperar te recomendamos reservar online. Te confirmamos la hora al instante y te guardamos el hueco.",
  },
  {
    question: "¿Cómo reservo una cita?",
    answer:
      "Lo más rápido es reservar online: eliges servicio, día y hora, y te llega un recordatorio por SMS una hora antes. También puedes llamarnos directamente al +34 694 20 07 78.",
  },
  {
    question: "¿Cuánto cuesta un corte?",
    answer:
      "Un corte de caballero cuesta 13 € y el pack corte + barba 20 €. Los niños 10 €. Tienes la lista completa en la sección de Precios. El precio final puede variar según el largo del pelo.",
  },
  {
    question: "¿Cortáis a niños?",
    answer:
      "Sí. Hacemos cortes para niños con mucha paciencia y buen ambiente, para que la experiencia sea fácil y agradable también para los más pequeños.",
  },
  {
    question: "¿Hacéis afeitado a navaja?",
    answer:
      "Sí. Ofrecemos el afeitado clásico a navaja con toalla caliente: apurado, relajante y con un acabado perfecto. Todo un clásico que merece la pena probar.",
  },
  {
    question: "¿Qué formas de pago aceptáis?",
    answer:
      "Aceptamos pago en efectivo y con tarjeta, lo que te resulte más cómodo.",
  },
  {
    question: "¿Dónde estáis y qué horario tenéis?",
    answer:
      "Estamos en Los Abrigos, en el sur de Tenerife, en la Calle La Marina, Local 1 (38618). El horario es de Lunes a Viernes de 10:00 a 14:00 y de 15:00 a 19:00, y Sábados de 07:00 a 14:00. Los Domingos permanecemos cerrados.",
  },
] as const;

export type FAQ = (typeof faqs)[number];
