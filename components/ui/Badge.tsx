import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
};

const VARIANTS = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-teal-100 text-teal-800",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${VARIANTS[variant]} ${className}`.trim()}>
      {children}
    </span>
  );
}
