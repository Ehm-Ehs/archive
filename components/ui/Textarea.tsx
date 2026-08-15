import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, maxLength, value, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={textareaId} className="font-heading font-semibold text-sm text-text-main">
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-xs text-neutral-400">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            "w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 text-sm text-text-main placeholder:text-neutral-400 transition-all duration-200 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 min-h-[110px] resize-y disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-brand-terracotta focus:border-brand-terracotta focus:ring-brand-terracotta/20",
            className
          )}
          {...props}
        />
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

Textarea.displayName = "Textarea";
