export default function Progress({ value = 0, color = "bg-emerald-500" }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
