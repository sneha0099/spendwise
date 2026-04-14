import { cn } from "@/utils/cn";
import { forwardRef } from "react";

const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;
