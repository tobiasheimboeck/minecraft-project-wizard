import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentPropsWithoutRef<"select">
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded px-2.5 py-2 pr-9 text-sm font-mono bg-card border border-border border-b-2",
      "text-foreground appearance-none cursor-pointer",
      "focus:outline-none focus:border-primary focus:border-b-primary",
      "bg-[length:12px_12px] bg-[right_0.6rem_center] bg-no-repeat",
      "transition-colors",
      className
    )}
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    }}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export { Select };
