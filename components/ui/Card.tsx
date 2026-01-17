import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${className}`.trim()}>
      {children}
    </div>
  );
}
