import Button from "./Button";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="glass-panel flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-full bg-secondary p-4">{Icon ? <Icon className="h-8 w-8" /> : "•"}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
