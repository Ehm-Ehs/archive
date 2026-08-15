import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "gold" | "terracotta" | "white";
  text?: string;
}

export function Loader({ size = "md", variant = "primary", text, className, ...props }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const variantClasses = {
    primary: "text-brand-green",
    gold: "text-brand-gold",
    terracotta: "text-brand-terracotta",
    white: "text-white",
  };

  return (
    <div className={cn("inline-flex items-center justify-center gap-2", className)} {...props}>
      <Loader2 className={cn("animate-spin", sizeClasses[size], variantClasses[variant])} />
      {text && <span className="text-sm font-semibold opacity-90">{text}</span>}
    </div>
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800", className)}
      {...props}
    />
  );
}

export function PageLoader({ text = "Loading Nigerian Oral Archive..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4 p-6 glass-card rounded-2xl shadow-xl">
        <Loader size="xl" variant="primary" />
        <p className="text-base font-semibold text-text-main animate-pulse">{text}</p>
      </div>
    </div>
  );
}
