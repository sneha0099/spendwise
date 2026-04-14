export default function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-zinc-900 dark:bg-white" : "bg-zinc-300 dark:bg-zinc-700"}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition dark:bg-zinc-900 ${checked ? "left-6" : "left-1"}`}
      />
    </button>
  );
}
