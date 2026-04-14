import { cn } from "@/utils/cn";
import { forwardRef } from "react";

const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
