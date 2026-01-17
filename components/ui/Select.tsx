import { ReactNode } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: boolean;
  children?: ReactNode;
};

export function Select({ label, error, children, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        {...props}
        className={`w-full rounded-md border ${
          error ? "border-red-300" : "border-gray-300"
        } bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-transparent focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-blue-500"
        } disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${className}`.trim()}
      >
        {children}
      </select>
    </div>
  );
}
