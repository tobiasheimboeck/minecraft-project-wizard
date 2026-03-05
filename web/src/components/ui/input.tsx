import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-2.5 py-2 text-sm font-mono bg-card border border-border border-b-2",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:border-primary focus:border-b-primary",
          "transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
