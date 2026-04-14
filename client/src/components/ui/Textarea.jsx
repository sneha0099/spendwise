import { cn } from "@/utils/cn";
import { forwardRef } from "react";

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
