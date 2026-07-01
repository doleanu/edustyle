// Price menu — single source of truth for the Precios section.
//
// ⚠️ TODO(edu): PRECIOS ORIENTATIVOS. Confirmar la lista y las tarifas reales
// con Edu antes de publicar en el dominio final.

export type PriceItem = {
  name: string;
  desc?: string;
  price: string; // string so we can write "12 €" or "desde 15 €"
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
          name: "Corte de pelo",
          desc: "Tijera o máquina · incluye lavado y peinado",
          price: "12 €",
        },
        {
          name: "Corte + Barba",
          desc: "El pack completo",
          price: "18 €",
          highlight: true,
        },
        {
          name: "Corte niño",
          desc: "Hasta 12 años",
          price: "10 €",
        },
        {
          name: "Diseños y líneas",
          desc: "Detalles y diseños personalizados",
          price: "desde 3 €",
        },
      ],
    },
    {
      title: "Barba y afeitado",
      items: [
        {
          name: "Arreglo de barba",
          desc: "Perfilado y toalla caliente",
          price: "8 €",
        },
        {
          name: "Afeitado a navaja",
          desc: "Afeitado clásico con toalla caliente",
          price: "12 €",
        },
      ],
    },
    {
      title: "Color",
      items: [
        {
          name: "Tinte",
          desc: "Color con acabado natural",
          price: "desde 15 €",
        },
        {
          name: "Camuflaje de canas",
          desc: "Disimula las canas de forma natural",
          price: "desde 12 €",
        },
      ],
    },
  ],
  note: "Precios orientativos. El precio final puede variar según el largo del pelo y el servicio. Pregúntanos sin compromiso.",
};
