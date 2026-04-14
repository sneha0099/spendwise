export default function Avatar({ src, fallback, className = "" }) {
  return src ? (
    <img src={src} alt={fallback} className={`h-10 w-10 rounded-full object-cover ${className}`} />
  ) : (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900 ${className}`}>
      {fallback?.slice(0, 2).toUpperCase()}
    </div>
  );
}
