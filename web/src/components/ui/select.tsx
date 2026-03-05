"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

function parseOptions(children: React.ReactNode): SelectOption[] {
  const options: SelectOption[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === "option") {
      const props = child.props as { value?: string; children?: React.ReactNode };
      options.push({
        value: props.value ?? String(props.children ?? ""),
        label: String(props.children ?? props.value ?? ""),
      });
    }
  });
  return options;
}

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentPropsWithoutRef<"select">
>(({ className, children, id, name, defaultValue, value, onChange, ...props }, ref) => {
  const options = parseOptions(children);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(
    (value as string) ?? (defaultValue as string) ?? options[0]?.value ?? ""
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === selectedValue) ?? options[0];

  React.useEffect(() => {
    if (value !== undefined) setSelectedValue(value as string);
  }, [value]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (opt: SelectOption) => {
    setSelectedValue(opt.value);
    setOpen(false);
    onChange?.({ target: { value: opt.value } } as React.ChangeEvent<HTMLSelectElement>);
  };

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === "function") ref(node as unknown as HTMLSelectElement);
      else if (ref) (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node as unknown as HTMLSelectElement;
    },
    [ref]
  );

  return (
    <div ref={setRefs} className="relative">
      <input type="hidden" name={name} value={selectedValue} form={props.form} />
      <button
        type="button"
        id={id}
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full px-2.5 py-2 text-sm font-mono bg-card border border-border border-b-2",
          "text-foreground text-left flex items-center justify-between cursor-pointer",
          "focus:outline-none focus:border-[var(--kotlin-purple)] focus:border-b-[var(--kotlin-purple)]",
          "transition-colors hover:border-[#555]",
          className
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={id ? `${id}-label` : undefined}
      >
        <span className="whitespace-nowrap overflow-hidden text-ellipsis min-w-0">{selectedOption?.label}</span>
        <ChevronDown
          className={cn("size-4 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-48 overflow-auto border border-border shadow-xl py-1"
          style={{ backgroundColor: "var(--wizard-bg-elevated)" }}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === selectedValue}
              onClick={() => handleSelect(opt)}
              className={cn(
                "px-2.5 py-2 text-sm font-mono cursor-pointer transition-colors",
                opt.value === selectedValue
                  ? "bg-[rgba(240,196,90,0.2)] text-[var(--kotlin-purple)] border-l-2 border-[var(--kotlin-purple)]"
                  : "text-foreground hover:bg-[rgba(240,196,90,0.1)] hover:text-[var(--kotlin-purple)]"
              )}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
Select.displayName = "Select";

export { Select };
