import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="font-heading font-semibold text-sm text-text-main flex items-center gap-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-neutral-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-text-main placeholder:text-neutral-400 transition-all duration-200 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              error && "border-brand-terracotta focus:border-brand-terracotta focus:ring-brand-terracotta/20",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="flex items-center gap-1 text-xs font-semibold text-brand-terracotta mt-0.5">
            <AlertCircle size={13} className="shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
