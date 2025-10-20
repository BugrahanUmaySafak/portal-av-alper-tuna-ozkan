import type { PropsWithChildren } from "react";
import clsx from "clsx";

export function Section({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={clsx("py-4 sm:py-6 lg:py-16", className)}>
      {children}
    </section>
  );
}

export default Section;
