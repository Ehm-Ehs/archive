import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: (string | SelectOption)[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options = [], children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="font-heading font-semibold text-sm text-text-main">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full appearance-none rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 pr-10 text-sm text-text-main transition-all duration-200 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-brand-terracotta focus:border-brand-terracotta focus:ring-brand-terracotta/20",
              className
            )}
            {...props}
          >
            {children
              ? children
              : options.map((opt) => {
                  const val = typeof opt === "string" ? opt : opt.value;
                  const lbl = typeof opt === "string" ? opt : opt.label;
                  return (
                    <option key={val} value={val}>
                      {lbl}
                    </option>
                  );
                })}
          </select>
          <ChevronDown size={16} className="absolute right-3.5 pointer-events-none text-neutral-400" />
        </div>
        {error && (
          <p className="flex items-center gap-1 text-xs font-semibold text-brand-terracotta mt-0.5">
            <AlertCircle size={13} className="shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
