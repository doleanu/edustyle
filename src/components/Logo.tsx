import clsx from "clsx";

// Clean typographic logo lockup for Eduardo Style Barber Shop.
// tone="dark" for light backgrounds (header), tone="light" for dark ones (footer).
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const main = tone === "light" ? "text-cream-50" : "text-teal-900";
  const sub = tone === "light" ? "text-cream-100/60" : "text-teal-700/55";
  return (
    <span className={clsx("inline-flex flex-col leading-none", className)}>
      <span
        className={clsx(
          "font-serif text-xl font-semibold uppercase tracking-[0.08em] sm:text-2xl",
          main
        )}
      >
        Eduardo <span className="text-terracotta-500">Style</span>
      </span>
      <span
        className={clsx(
          "mt-1.5 text-[9px] font-medium uppercase tracking-[0.42em] sm:text-[10px]",
          sub
        )}
      >
        Barber Shop
      </span>
    </span>
  );
}
