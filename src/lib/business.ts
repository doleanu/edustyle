// Single source of truth for business details, used by JSON-LD, footer, etc.
// Update once here, propagates everywhere.

export const business = {
  name: "Eduardo Style",
  legalName: "Eduardo Style Barbería",
  description:
    "Barbería en Tenerife. Cortes de pelo, arreglo de barba y afeitado clásico a navaja. Reserva tu cita online.",
  longDescription:
    "En Eduardo Style cuidamos tu imagen como se merece. Cortes de pelo, arreglo de barba, afeitado clásico a navaja y diseños personalizados, en un ambiente cercano y relajado en Tenerife. Reserva tu cita online en segundos.",
  email: "eduardosaiz46@gmail.com",
  phone: "+34 694 20 07 78",
  phoneE164: "+34694200778",
  whatsapp: {
    raw: "34694200778",
    link: "https://wa.me/34694200778?text=%C2%A1Hola%21%20Me%20gustar%C3%ADa%20reservar%20una%20cita%20en%20Eduardo%20Style.",
  },
  address: {
    street: "Calle La Marina, Local 1",
    city: "Los Abrigos",
    region: "Santa Cruz de Tenerife",
    postalCode: "38618",
    country: "España",
    countryCode: "ES",
    full: "Calle La Marina, Local 1, 38618 Los Abrigos, Santa Cruz de Tenerife",
  },
  geo: {
    // Coordenadas reales del pin de Google Maps (sur de Tenerife).
    latitude: 28.030003,
    longitude: -16.5941873,
  },
  hours: [
    // Horario confirmado (sesión previa con Edu).
    { day: "Lunes", open: "10:00", close: "19:00" },
    { day: "Martes", open: "10:00", close: "19:00" },
    { day: "Miércoles", open: "10:00", close: "19:00" },
    { day: "Jueves", open: "10:00", close: "19:00" },
    { day: "Viernes", open: "10:00", close: "19:00" },
    { day: "Sábado", open: "07:00", close: "14:00" },
    { day: "Domingo", open: null, close: null }, // Cerrado
  ],
  social: {
    instagram: "https://www.instagram.com/edustyle4/",
    googleMaps: "https://maps.app.goo.gl/GH1yP5RzL4Cbe8oP6",
    facebook: "",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.barberiaeduardostyle.es",
} as const;

export const services = [
  {
    slug: "corte-de-pelo",
    name: "Corte de pelo",
    short:
      "Corte a tijera o máquina, adaptado a tu estilo. Incluye lavado y peinado.",
    icon: "Scissors",
  },
  {
    slug: "corte-barba",
    name: "Corte + Barba",
    short:
      "El pack completo: corte de pelo y arreglo de barba para un look impecable.",
    icon: "Crown",
  },
  {
    slug: "arreglo-barba",
    name: "Arreglo de barba",
    short:
      "Perfilado, recorte y cuidado de la barba con toalla caliente.",
    icon: "Brush",
  },
  {
    slug: "afeitado-navaja",
    name: "Afeitado a navaja",
    short:
      "Afeitado clásico a navaja, apurado y relajante, con toalla caliente.",
    icon: "Droplets",
  },
  {
    slug: "corte-nino",
    name: "Corte niño",
    short:
      "Cortes para los más pequeños, con paciencia y buen ambiente.",
    icon: "Baby",
  },
  {
    slug: "disenos-lineas",
    name: "Diseños y líneas",
    short:
      "Líneas, degradados y diseños personalizados para destacar.",
    icon: "PenTool",
  },
  {
    slug: "tinte-color",
    name: "Tinte y color",
    short:
      "Color, mechas y camuflaje de canas con un acabado natural.",
    icon: "Palette",
  },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];
