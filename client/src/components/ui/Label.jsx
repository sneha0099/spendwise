export default function Label({ children, ...props }) {
  return (
    <label className="mb-2 block text-sm font-medium text-foreground" {...props}>
      {children}
    </label>
  );
}
