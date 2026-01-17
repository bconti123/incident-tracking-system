import { ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
};

export function Label({ children, htmlFor, className = "" }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-700 ${className}`.trim()}>
      {children}
    </label>
  );
}
