import type { PropsWithChildren } from "react";
import clsx from "clsx";

/**
 * Site genelinde yatay padding ve max genişliği eşitlemek için tek Container.
 * Header'ın px-16 değeriyle birebir hizalanır.
 */
export function Container({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx("px-4 sm:px-6 lg:px-16", className)}>{children}</div>
  );
}

export default Container;
