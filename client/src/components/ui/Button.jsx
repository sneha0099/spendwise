import { LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const variants = {
  default: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "bg-transparent hover:bg-secondary",
  outline: "border bg-background hover:bg-secondary",
  destructive: "bg-red-600 text-white hover:bg-red-500"
};

export default function Button({
  className,
  variant = "default",
  size = "md",
  loading = false,
  children,
  ...props
}) {
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
