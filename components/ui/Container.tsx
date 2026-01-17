import { ReactNode } from "react";
import clsx from "clsx";

type ContainerProps = {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "max-w-sm",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-7xl",
};

export function Container({
  children,
  size = "md",
  className,
}: ContainerProps) {
  return (
    <div className={clsx("mx-auto px-4", sizes[size], className)}>
      {children}
    </div>
  );
}
