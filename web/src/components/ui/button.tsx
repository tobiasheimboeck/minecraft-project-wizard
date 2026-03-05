import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 inline-flex items-center justify-center font-mono",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--kotlin-purple)] text-white border-[var(--kotlin-purple)] hover:bg-[var(--kotlin-purple-hover)] hover:border-[var(--kotlin-purple-hover)]",
        outline:
          "border-border bg-card hover:bg-muted hover:text-foreground text-foreground",
        ghost: "border-transparent hover:bg-muted text-foreground",
      },
      size: {
        default: "h-9 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
