type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';
  size?: 'sm' | 'md' | 'lg';
  type: 'button' | 'submit' | 'reset';
};

const VARIANTS = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  warning: "bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-400",
  success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  info: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500",
} as const;

const SIZES = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
} as const;

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const base = "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      type={type}
      {...props}
      className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim()}
    >
      {children}
    </button>
  );
};
