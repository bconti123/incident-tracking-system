type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: boolean;
};

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        {...props}
        className={`w-full rounded-md border ${
          error ? "border-red-300" : "border-gray-300"
        } px-3 py-2 text-sm outline-none transition-colors focus:border-transparent focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-blue-500"
        } disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${className}`.trim()}
      />
    </div>
  );
}
