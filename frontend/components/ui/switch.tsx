"use client";

import * as React from "react";
import { Switch as RadixSwitch } from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

type SwitchProps = React.ComponentPropsWithoutRef<typeof RadixSwitch>

export const Switch = React.forwardRef<React.ElementRef<typeof RadixSwitch>, SwitchProps>(
  ({ className, ...props }, ref) => (
    <RadixSwitch
      ref={ref}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-green-500",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          props.checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </RadixSwitch>
  )
);

Switch.displayName = "Switch";
