import { cn } from "@/utils/cn";

export default function Badge({ className, variant = "default", children }) {
  const variants = {
    default: "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    danger: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    outline: "border text-foreground"
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", variants[variant], className)}>
      {children}
    </span>
  );
}
