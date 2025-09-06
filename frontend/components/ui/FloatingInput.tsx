"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, className, type = "text", value, defaultValue, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);

    const isControlled = value !== undefined;
    const isFloating =
      focused || (isControlled ? value !== "" : defaultValue !== "");

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={type}
          
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "peer w-full border rounded-lg px-4 pt-6 pb-2 text-sm placeholder-transparent focus:outline-none focus:ring-2",
            "focus:border-blue-500 focus:ring-blue-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          placeholder={label}
          value={isControlled ? value ?? "" : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 text-sm transition-all bg-white px-1 pointer-events-none",
            isFloating
              ? "-top-2 text-blue-500 text-xs"
              : "top-3 text-gray-400"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";
