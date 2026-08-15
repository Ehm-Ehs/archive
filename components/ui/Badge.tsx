import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "green" | "gold" | "terracotta" | "neutral" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    green: "bg-brand-green-light text-brand-green border border-brand-green/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40",
    gold: "bg-brand-gold-light text-brand-gold border border-brand-gold/20 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40",
    terracotta: "bg-brand-terracotta-light text-brand-terracotta border border-brand-terracotta/20 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40",
    neutral: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700",
    outline: "border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 bg-transparent",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[0.7rem]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-heading font-semibold uppercase tracking-wider rounded-full leading-none transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
