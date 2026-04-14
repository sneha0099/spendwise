import { cn } from "@/utils/cn";

export function Card({ className, children }) {
  return <div className={cn("glass-panel", className)}>{children}</div>;
}

export function CardHeader({ className, children }) {
  return <div className={cn("flex items-center justify-between gap-4 p-5 pb-0", className)}>{children}</div>;
}

export function CardContent({ className, children }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return <div className={cn("border-t p-5", className)}>{children}</div>;
}
