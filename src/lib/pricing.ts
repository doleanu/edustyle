// Price menu — single source of truth for the Precios section.
//
// Prices confirmed with Edu in a previous session. Standalone "arreglo de
// barba" / "afeitado a navaja" prices were not captured — TODO(edu): confirmar.

export type PriceItem = {
  name: string;
  desc?: string;
  price: string; // string so we can write "13 €" or "15–40 €"
  highlight?: boolean;
};

export type PriceGroup = {
  title: string;
  items: PriceItem[];
};

export const pricing: { groups: PriceGroup[]; note: string } = {
  groups: [
    {
      title: "Cortes",
      items: [
        {
          name: "Corte caballero",
          desc: "Corte a tijera o máquina, lavado y peinado",
          price: "13 €",
        },
        {
          name: "Corte niño",
          desc: "Hasta 12 años",
          price: "10 €",
        },
      ],
    },
    {
      title: "Corte + Barba",
      items: [
        {
          name: "Corte + Barba",
          desc: "El pack más pedido",
          price: "20 €",
          highlight: true,
        },
        {
          name: "Premium",
          desc: "Corte y barba con acabado premium", // TODO(edu): detallar qué incluye
          price: "25 €",
        },
        {
          name: "Pack completo",
          desc: "Corte, barba y cuidado facial", // TODO(edu): detallar qué incluye
          price: "40 €",
        },
      ],
    },
    {
      title: "Color",
      items: [
        {
          name: "Tinte y mechas",
          desc: "Color con acabado natural",
          price: "15–40 €",
        },
        {
          name: "Camuflaje de canas",
          desc: "Disimula las canas de forma natural",
          price: "desde 15 €",
        },
      ],
    },
  ],
  note: "Precios orientativos. El precio final puede variar según el largo del pelo y el servicio. Pregúntanos sin compromiso.",
};
