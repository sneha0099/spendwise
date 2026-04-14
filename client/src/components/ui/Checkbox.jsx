import { forwardRef } from "react";

const Checkbox = forwardRef(({ label, ...props }, ref) => {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <input ref={ref} type="checkbox" className="h-4 w-4 rounded border-zinc-300" {...props} />
      {label}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
