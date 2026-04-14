import { cn } from "@/utils/cn";

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="inline-flex rounded-2xl border bg-background p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-medium transition",
            value === tab.value ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-muted-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
