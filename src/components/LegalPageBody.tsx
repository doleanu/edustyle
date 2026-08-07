import Link from "next/link";
import { business } from "@/lib/business";
import { legalContent, type LegalSection, type LegalListSection } from "@/lib/legal";
import { type Lang } from "@/lib/content";

// Fills {legalName} {city} {country} {phone} tokens, then splits on {EMAIL}
// so the caller can splice in a real <a mailto> link at that exact point.
function fillTemplate(template: string): { pre: string; post: string | null } {
  const filled = template
    .replaceAll("{legalName}", business.legalName)
    .replaceAll("{city}", business.address.city)
    .replaceAll("{country}", business.address.country)
    .replaceAll("{phone}", business.phone);
  const idx = filled.indexOf("{EMAIL}");
  if (idx === -1) return { pre: filled, post: null };
  return { pre: filled.slice(0, idx), post: filled.slice(idx + "{EMAIL}".length) };
}

function EmailLink() {
  return (
    <a
      href={`mailto:${business.email}`}
      className="text-teal-700 underline-offset-4 hover:underline"
    >
      {business.email}
    </a>
  );
}

function Body({ text }: { text: string }) {
  const { pre, post } = fillTemplate(text);
  if (post === null) return <>{pre}</>;
  return (
    <>
      {pre}
      <EmailLink />
      {post}
    </>
  );
}

function Section({ section }: { section: LegalSection }) {
  return (
    <section>
      <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
        {section.title}
      </h2>
      <p className="mt-3 leading-relaxed">
        <Body text={section.body} />
      </p>
    </section>
  );
}

function ListSection({ section }: { section: LegalListSection }) {
  return (
    <section>
      <h2 className="font-serif text-2xl uppercase tracking-wide text-teal-900">
        {section.title}
      </h2>
      <p className="mt-3 leading-relaxed">{section.intro}</p>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        {section.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {section.outro && (
        <p className="mt-3 leading-relaxed">
          <Body text={section.outro} />
        </p>
      )}
    </section>
  );
}

export function AvisoLegalBody({ lang }: { lang: Lang }) {
  const t = legalContent[lang];
  return (
    <article className="container-tight py-12 sm:py-16">
      <BackLink lang={lang} />
      <h1 className="mt-6 font-serif text-4xl uppercase tracking-wide text-teal-900 sm:text-5xl">
        {t.avisoLegal.pageTitle}
      </h1>
      <div className="prose prose-teal mt-10 max-w-none space-y-6 text-teal-800/90">
        <Section section={t.avisoLegal.s1} />
        <Section section={t.avisoLegal.s2} />
        <Section section={t.avisoLegal.s3} />
        <Section section={t.avisoLegal.s4} />
        <Section section={t.avisoLegal.s5} />
        <Section section={t.avisoLegal.s6} />
      </div>
    </article>
  );
}

export function PoliticaPrivacidadBody({ lang }: { lang: Lang }) {
  const t = legalContent[lang];
  return (
    <article className="container-tight py-12 sm:py-16">
      <BackLink lang={lang} />
      <h1 className="mt-6 font-serif text-4xl uppercase tracking-wide text-teal-900 sm:text-5xl">
        {t.politicaPrivacidad.pageTitle}
      </h1>
      <div className="prose prose-teal mt-10 max-w-none space-y-6 text-teal-800/90">
        <Section section={t.politicaPrivacidad.p1} />
        <ListSection section={t.politicaPrivacidad.p2} />
        <ListSection section={t.politicaPrivacidad.p3} />
        <Section section={t.politicaPrivacidad.p4} />
        <Section section={t.politicaPrivacidad.p5} />
        <Section section={t.politicaPrivacidad.p6} />
      </div>
    </article>
  );
}

function BackLink({ lang }: { lang: Lang }) {
  const t = legalContent[lang];
  const home = lang === "es" ? "/" : `/${lang}`;
  return (
    <Link
      href={home}
      className="text-sm text-teal-700 underline-offset-4 hover:underline"
    >
      {t.backLink}
    </Link>
  );
}
