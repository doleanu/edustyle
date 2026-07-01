// Single source of truth for FAQ items (used by FAQ.tsx and FAQPage JSON-LD).
//
// ⚠️ TODO(edu): confirmar horario, precios, formas de pago y dirección reales.

export const faqs = [
  {
    question: "¿Necesito pedir cita o puedo ir directamente?",
    answer:
      "Puedes pasarte sin cita, pero para no esperar te recomendamos reservar por WhatsApp. Te confirmamos la hora en minutos y te guardamos el hueco.",
  },
  {
    question: "¿Cómo reservo una cita?",
    answer:
      "Lo más rápido es por WhatsApp al +34 694 20 07 78. También puedes llamarnos directamente. Solemos responder en pocos minutos durante el horario de apertura.",
  },
  {
    question: "¿Cuánto cuesta un corte?",
    answer:
      "Un corte de pelo cuesta desde 12 € y el pack corte + barba desde 18 €. Tienes la lista completa en la sección de Precios. El precio final puede variar según el largo del pelo.",
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
      "Estamos en Tenerife. El horario es de Lunes a Viernes de 10:00 a 20:00 y Sábados de 10:00 a 15:00. Los Domingos permanecemos cerrados.",
  },
] as const;

export type FAQ = (typeof faqs)[number];
