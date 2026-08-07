import { type Lang } from "./content";

// Legal pages (Aviso legal / Política de privacidad) in all 4 languages.
// Section bodies are plain-text templates with tokens filled in by the
// shared page components: {legalName} {city} {country} {phone}, and
// {EMAIL} which marks where a clickable mailto link gets spliced in.

export type LegalSection = { title: string; body: string };
export type LegalListSection = {
  title: string;
  intro: string;
  items: string[];
  outro?: string;
};

export type LegalContent = {
  backLink: string;
  avisoLegal: {
    metaTitle: string;
    metaDescription: string;
    pageTitle: string;
    s1: LegalSection;
    s2: LegalSection;
    s3: LegalSection;
    s4: LegalSection;
    s5: LegalSection;
    s6: LegalSection;
  };
  politicaPrivacidad: {
    metaTitle: string;
    metaDescription: string;
    pageTitle: string;
    p1: LegalSection;
    p2: LegalListSection;
    p3: LegalListSection;
    p4: LegalSection;
    p5: LegalSection;
    p6: LegalSection;
  };
};

// Legal-page URL for a given doc + language (ES stays at the root path,
// matching how the homepage itself works).
export function legalPath(
  doc: "aviso-legal" | "politica-privacidad",
  lang: Lang
): string {
  return lang === "es" ? `/${doc}` : `/${lang}/${doc}`;
}

export const legalContent: Record<Lang, LegalContent> = {
  es: {
    backLink: "← Volver a la página principal",
    avisoLegal: {
      metaTitle: "Aviso legal",
      metaDescription: "Aviso legal y condiciones de uso del sitio web de Eduardo Style.",
      pageTitle: "Aviso legal",
      s1: {
        title: "1. Titular",
        body: "Este sitio web pertenece a {legalName}, barbería situada en {city}, {country}. Puedes contactar en el {phone} o en {EMAIL}.",
      },
      s2: {
        title: "2. Objeto",
        body: "Este sitio tiene carácter informativo sobre los servicios de barbería de Eduardo Style (cortes de pelo, arreglo de barba, afeitado y otros servicios) y facilita la reserva de citas online o por teléfono.",
      },
      s3: {
        title: "3. Reservas y precios",
        body: "Las reservas se gestionan online o por teléfono; la cita se considera confirmada al recibir la confirmación. Los precios mostrados son orientativos y pueden variar según el servicio y el largo del pelo. Te rogamos que avises con antelación si no vas a poder acudir a tu cita.",
      },
      s4: {
        title: "4. Propiedad intelectual",
        body: "Todos los contenidos de este sitio (textos, imágenes y logotipo) son propiedad de {legalName} y están protegidos por la normativa de propiedad intelectual. Queda prohibido su uso sin autorización.",
      },
      s5: {
        title: "5. Responsabilidad",
        body: "Procuramos que la información del sitio sea correcta y esté actualizada, pero no garantizamos la ausencia de errores. El uso de este sitio web se realiza bajo la responsabilidad del usuario.",
      },
      s6: {
        title: "6. Legislación aplicable",
        body: "Este aviso legal se rige por la legislación española. Para cualquier cuestión relacionada, escríbenos a {EMAIL}.",
      },
    },
    politicaPrivacidad: {
      metaTitle: "Política de privacidad",
      metaDescription: "Política de privacidad de Eduardo Style: cómo recogemos, usamos y protegemos tus datos personales.",
      pageTitle: "Política de privacidad",
      p1: {
        title: "1. Responsable del tratamiento",
        body: "{legalName}, con actividad en {city}, {country}, es responsable del tratamiento de los datos recogidos a través de este sitio web y de los canales de contacto. Puedes escribirnos en cualquier momento a {EMAIL} o llamarnos al {phone}.",
      },
      p2: {
        title: "2. Qué datos recogemos",
        intro: "Este sitio web tiene un formulario de reserva de citas online. Al reservar, recogemos:",
        items: ["Nombre", "Número de teléfono", "El servicio, día y hora que elijas"],
        outro: "También podemos recibir tus datos si nos contactas directamente por teléfono o email.",
      },
      p3: {
        title: "3. Para qué usamos tus datos",
        intro: "Usamos tus datos únicamente para:",
        items: [
          "Gestionar y confirmar tu cita",
          "Enviarte un recordatorio automático de tu cita por SMS",
          "Responder a tus consultas sobre nuestros servicios",
        ],
        outro:
          "Los datos de tu cita se guardan en el Google Calendar del negocio y el recordatorio se envía a través de Twilio Inc., nuestro proveedor de mensajería SMS — ambos actúan como encargados del tratamiento, únicamente para prestar este servicio. No usamos tus datos para marketing sin tu consentimiento ni los compartimos con terceros con fines comerciales.",
      },
      p4: {
        title: "4. Conservación",
        body: "Conservamos tus datos durante el tiempo necesario para atender tu solicitud y, en su caso, mientras seas cliente, salvo obligación legal de conservarlos durante más tiempo.",
      },
      p5: {
        title: "5. Tus derechos (RGPD)",
        body: "Conforme al Reglamento (UE) 2016/679 (RGPD) y a la normativa española de protección de datos, tienes derecho a acceder, rectificar, suprimir, limitar u oponerte al tratamiento de tus datos, así como a la portabilidad de los mismos. Para ejercer cualquiera de estos derechos, escríbenos a {EMAIL}. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).",
      },
      p6: {
        title: "6. Cookies",
        body: "Este sitio no utiliza cookies de seguimiento ni de publicidad. Únicamente se emplean las cookies técnicas imprescindibles para su funcionamiento.",
      },
    },
  },
  en: {
    backLink: "← Back to homepage",
    avisoLegal: {
      metaTitle: "Legal Notice",
      metaDescription: "Legal notice and terms of use for the Eduardo Style website.",
      pageTitle: "Legal Notice",
      s1: {
        title: "1. Owner",
        body: "This website belongs to {legalName}, a barbershop located in {city}, {country}. You can contact us at {phone} or at {EMAIL}.",
      },
      s2: {
        title: "2. Purpose",
        body: "This site provides information about Eduardo Style's barbershop services (haircuts, beard trims, shaves and other services) and enables booking appointments online or by phone.",
      },
      s3: {
        title: "3. Bookings and prices",
        body: "Bookings are managed online or by phone; an appointment is considered confirmed once you receive confirmation. The prices shown are indicative and may vary depending on the service and hair length. Please let us know in advance if you're unable to make your appointment.",
      },
      s4: {
        title: "4. Intellectual property",
        body: "All content on this site (text, images and logo) is the property of {legalName} and is protected by intellectual property law. Its use without authorisation is prohibited.",
      },
      s5: {
        title: "5. Liability",
        body: "We try to keep the information on this site accurate and up to date, but we do not guarantee it is free of errors. Use of this website is at the user's own responsibility.",
      },
      s6: {
        title: "6. Governing law",
        body: "This legal notice is governed by Spanish law. For any related query, write to us at {EMAIL}.",
      },
    },
    politicaPrivacidad: {
      metaTitle: "Privacy Policy",
      metaDescription: "Eduardo Style's privacy policy: how we collect, use and protect your personal data.",
      pageTitle: "Privacy Policy",
      p1: {
        title: "1. Data controller",
        body: "{legalName}, operating in {city}, {country}, is responsible for processing the data collected through this website and our contact channels. You can write to us at any time at {EMAIL} or call us at {phone}.",
      },
      p2: {
        title: "2. What data we collect",
        intro: "This website has an online appointment booking form. When you book, we collect:",
        items: ["Name", "Phone number", "The service, day and time you choose"],
        outro: "We may also receive your data if you contact us directly by phone or email.",
      },
      p3: {
        title: "3. What we use your data for",
        intro: "We use your data only to:",
        items: [
          "Manage and confirm your appointment",
          "Send you an automatic SMS reminder of your appointment",
          "Respond to your questions about our services",
        ],
        outro:
          "Your appointment data is stored in the business's Google Calendar, and the reminder is sent via Twilio Inc., our SMS provider — both act as data processors, solely to provide this service. We don't use your data for marketing without your consent, nor do we share it with third parties for commercial purposes.",
      },
      p4: {
        title: "4. Retention",
        body: "We keep your data for as long as necessary to handle your request and, where applicable, for as long as you remain a client, unless a legal obligation requires us to keep it longer.",
      },
      p5: {
        title: "5. Your rights (GDPR)",
        body: "Under Regulation (EU) 2016/679 (GDPR) and Spanish data protection law, you have the right to access, rectify, erase, restrict or object to the processing of your data, as well as to data portability. To exercise any of these rights, write to us at {EMAIL}. You can also file a complaint with the Spanish Data Protection Agency (AEPD).",
      },
      p6: {
        title: "6. Cookies",
        body: "This site does not use tracking or advertising cookies. Only the technical cookies strictly necessary for it to function are used.",
      },
    },
  },
  fr: {
    backLink: "← Retour à la page d'accueil",
    avisoLegal: {
      metaTitle: "Mentions légales",
      metaDescription: "Mentions légales et conditions d'utilisation du site web d'Eduardo Style.",
      pageTitle: "Mentions légales",
      s1: {
        title: "1. Titulaire",
        body: "Ce site appartient à {legalName}, un salon de coiffure pour hommes situé à {city}, {country}. Vous pouvez nous contacter au {phone} ou à {EMAIL}.",
      },
      s2: {
        title: "2. Objet",
        body: "Ce site a un caractère informatif sur les services de barbier d'Eduardo Style (coupes de cheveux, taille de barbe, rasage et autres services) et permet de réserver un rendez-vous en ligne ou par téléphone.",
      },
      s3: {
        title: "3. Réservations et tarifs",
        body: "Les réservations sont gérées en ligne ou par téléphone ; le rendez-vous est considéré comme confirmé dès réception de la confirmation. Les prix indiqués sont donnés à titre indicatif et peuvent varier selon le service et la longueur des cheveux. Merci de nous prévenir à l'avance si vous ne pouvez pas vous rendre à votre rendez-vous.",
      },
      s4: {
        title: "4. Propriété intellectuelle",
        body: "L'ensemble des contenus de ce site (textes, images et logo) est la propriété de {legalName} et est protégé par la réglementation sur la propriété intellectuelle. Leur utilisation sans autorisation est interdite.",
      },
      s5: {
        title: "5. Responsabilité",
        body: "Nous veillons à ce que les informations du site soient exactes et à jour, mais nous ne garantissons pas l'absence d'erreurs. L'utilisation de ce site web se fait sous la responsabilité de l'utilisateur.",
      },
      s6: {
        title: "6. Législation applicable",
        body: "Ces mentions légales sont régies par la législation espagnole. Pour toute question à ce sujet, écrivez-nous à {EMAIL}.",
      },
    },
    politicaPrivacidad: {
      metaTitle: "Politique de confidentialité",
      metaDescription: "Politique de confidentialité d'Eduardo Style : comment nous recueillons, utilisons et protégeons vos données personnelles.",
      pageTitle: "Politique de confidentialité",
      p1: {
        title: "1. Responsable du traitement",
        body: "{legalName}, exerçant son activité à {city}, {country}, est responsable du traitement des données recueillies via ce site web et nos canaux de contact. Vous pouvez nous écrire à tout moment à {EMAIL} ou nous appeler au {phone}.",
      },
      p2: {
        title: "2. Quelles données nous recueillons",
        intro: "Ce site dispose d'un formulaire de réservation de rendez-vous en ligne. Lors de la réservation, nous recueillons :",
        items: ["Nom", "Numéro de téléphone", "Le service, le jour et l'heure que vous choisissez"],
        outro: "Nous pouvons également recevoir vos données si vous nous contactez directement par téléphone ou par email.",
      },
      p3: {
        title: "3. À quoi servent vos données",
        intro: "Nous utilisons vos données uniquement pour :",
        items: [
          "Gérer et confirmer votre rendez-vous",
          "Vous envoyer un rappel automatique de votre rendez-vous par SMS",
          "Répondre à vos questions sur nos services",
        ],
        outro:
          "Les données de votre rendez-vous sont conservées dans le Google Calendar de l'entreprise, et le rappel est envoyé via Twilio Inc., notre prestataire de SMS — tous deux agissent en tant que sous-traitants, uniquement pour fournir ce service. Nous n'utilisons pas vos données à des fins marketing sans votre consentement et ne les partageons pas avec des tiers à des fins commerciales.",
      },
      p4: {
        title: "4. Conservation",
        body: "Nous conservons vos données le temps nécessaire pour traiter votre demande et, le cas échéant, tant que vous restez client, sauf obligation légale de les conserver plus longtemps.",
      },
      p5: {
        title: "5. Vos droits (RGPD)",
        body: "Conformément au Règlement (UE) 2016/679 (RGPD) et à la réglementation espagnole sur la protection des données, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation ou d'opposition au traitement de vos données, ainsi que d'un droit à la portabilité. Pour exercer l'un de ces droits, écrivez-nous à {EMAIL}. Vous pouvez également déposer une réclamation auprès de l'Agence espagnole de protection des données (AEPD).",
      },
      p6: {
        title: "6. Cookies",
        body: "Ce site n'utilise pas de cookies de suivi ni de publicité. Seuls les cookies techniques indispensables à son fonctionnement sont utilisés.",
      },
    },
  },
  de: {
    backLink: "← Zurück zur Startseite",
    avisoLegal: {
      metaTitle: "Impressum",
      metaDescription: "Impressum und Nutzungsbedingungen der Website von Eduardo Style.",
      pageTitle: "Impressum",
      s1: {
        title: "1. Betreiber",
        body: "Diese Website gehört {legalName}, einem Barbershop in {city}, {country}. Sie erreichen uns unter {phone} oder unter {EMAIL}.",
      },
      s2: {
        title: "2. Zweck",
        body: "Diese Seite dient der Information über die Barbershop-Leistungen von Eduardo Style (Haarschnitt, Bartpflege, Rasur und weitere Leistungen) und ermöglicht die Terminbuchung online oder telefonisch.",
      },
      s3: {
        title: "3. Buchungen und Preise",
        body: "Buchungen werden online oder telefonisch abgewickelt; der Termin gilt als bestätigt, sobald Sie die Bestätigung erhalten. Die angegebenen Preise sind Richtwerte und können je nach Leistung und Haarlänge variieren. Bitte sagen Sie uns rechtzeitig Bescheid, falls Sie einen Termin nicht wahrnehmen können.",
      },
      s4: {
        title: "4. Geistiges Eigentum",
        body: "Sämtliche Inhalte dieser Website (Texte, Bilder und Logo) sind Eigentum von {legalName} und durch das Recht des geistigen Eigentums geschützt. Ihre Nutzung ohne Genehmigung ist untersagt.",
      },
      s5: {
        title: "5. Haftung",
        body: "Wir bemühen uns, die Informationen auf dieser Website korrekt und aktuell zu halten, garantieren jedoch nicht deren Fehlerfreiheit. Die Nutzung dieser Website erfolgt auf eigene Verantwortung des Nutzers.",
      },
      s6: {
        title: "6. Anwendbares Recht",
        body: "Dieses Impressum unterliegt spanischem Recht. Bei Fragen dazu schreiben Sie uns bitte an {EMAIL}.",
      },
    },
    politicaPrivacidad: {
      metaTitle: "Datenschutzerklärung",
      metaDescription: "Datenschutzerklärung von Eduardo Style: wie wir Ihre personenbezogenen Daten erheben, verwenden und schützen.",
      pageTitle: "Datenschutzerklärung",
      p1: {
        title: "1. Verantwortlicher",
        body: "{legalName}, tätig in {city}, {country}, ist verantwortlich für die Verarbeitung der über diese Website und unsere Kontaktkanäle erhobenen Daten. Sie können uns jederzeit unter {EMAIL} schreiben oder uns unter {phone} anrufen.",
      },
      p2: {
        title: "2. Welche Daten wir erheben",
        intro: "Diese Website verfügt über ein Online-Terminbuchungsformular. Bei einer Buchung erheben wir:",
        items: ["Name", "Telefonnummer", "Die von Ihnen gewählte Leistung, Tag und Uhrzeit"],
        outro: "Wir können Ihre Daten auch erhalten, wenn Sie uns direkt telefonisch oder per E-Mail kontaktieren.",
      },
      p3: {
        title: "3. Wofür wir Ihre Daten verwenden",
        intro: "Wir verwenden Ihre Daten ausschließlich, um:",
        items: [
          "Ihren Termin zu verwalten und zu bestätigen",
          "Ihnen eine automatische SMS-Erinnerung an Ihren Termin zu senden",
          "Ihre Fragen zu unseren Leistungen zu beantworten",
        ],
        outro:
          "Ihre Termindaten werden im Google Calendar des Unternehmens gespeichert, und die Erinnerung wird über Twilio Inc., unseren SMS-Anbieter, versendet — beide handeln als Auftragsverarbeiter, ausschließlich zur Erbringung dieses Dienstes. Wir verwenden Ihre Daten nicht ohne Ihre Einwilligung für Marketingzwecke und geben sie nicht zu kommerziellen Zwecken an Dritte weiter.",
      },
      p4: {
        title: "4. Aufbewahrung",
        body: "Wir bewahren Ihre Daten so lange auf, wie es zur Bearbeitung Ihrer Anfrage erforderlich ist, und gegebenenfalls, solange Sie Kunde sind, sofern keine gesetzliche Pflicht zu einer längeren Aufbewahrung besteht.",
      },
      p5: {
        title: "5. Ihre Rechte (DSGVO)",
        body: "Gemäß der Verordnung (EU) 2016/679 (DSGVO) und dem spanischen Datenschutzrecht haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung oder Widerspruch gegen die Verarbeitung Ihrer Daten sowie auf Datenübertragbarkeit. Um eines dieser Rechte auszuüben, schreiben Sie uns an {EMAIL}. Sie können außerdem eine Beschwerde bei der spanischen Datenschutzbehörde (Agencia Española de Protección de Datos, AEPD) einreichen.",
      },
      p6: {
        title: "6. Cookies",
        body: "Diese Website verwendet keine Tracking- oder Werbe-Cookies. Es werden ausschließlich technisch notwendige Cookies für den Betrieb der Website eingesetzt.",
      },
    },
  },
};
