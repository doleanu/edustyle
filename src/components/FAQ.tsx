"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/faq";
import clsx from "clsx";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="preguntas" className="section bg-cream-100">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
            Preguntas frecuentes
          </span>
          <h2 className="section-heading mt-3">
            Preguntas frecuentes. Respuestas claras.
          </h2>
          <p className="section-subheading mx-auto">
            Respuestas rápidas a lo que más nos preguntan. ¿No encuentras lo que
            buscas? Escríbenos por WhatsApp.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-cream-50 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors sm:p-6"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="font-serif text-lg font-medium text-teal-900 sm:text-xl">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={clsx(
                        "h-5 w-5 shrink-0 text-terracotta-500 transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={clsx(
                    "grid transition-all duration-300 ease-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 leading-relaxed text-teal-800/85 sm:px-6 sm:pb-6 sm:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
