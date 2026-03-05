"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import {
  getDependenciesByCategory,
  DEPENDENCIES,
  type Dependency,
} from "@/lib/dependencies";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

function filterDependencies(
  deps: Dependency[],
  query: string
): Record<string, Dependency[]> {
  const q = query.trim().toLowerCase();
  const filtered = q
    ? deps.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      )
    : deps;
  return filtered.reduce((acc, dep) => {
    if (!acc[dep.category]) acc[dep.category] = [];
    acc[dep.category].push(dep);
    return acc;
  }, {} as Record<string, Dependency[]>);
}

export type DependencyScope = "provided" | "bundled";

interface DependenciesModalProps {
  open: boolean;
  onClose: () => void;
  selectedDeps: Map<string, DependencyScope>;
  onToggle: (id: string, scope?: DependencyScope) => void;
  onSetScope: (id: string, scope: DependencyScope) => void;
}

const DEFAULT_SCOPES: Record<string, DependencyScope> = {
  mclib: "provided",
  "inventory-library": "provided",
  "entity-library": "provided",
  "kotlinx-serialization-json": "bundled",
  "kotlinx-coroutines": "bundled",
  mccoroutine: "bundled",
  exposed: "bundled",
  hikaricp: "bundled",
  "sqlite-jdbc": "bundled",
  "mariadb-jdbc": "bundled",
};

export function DependenciesModal({
  open,
  onClose,
  selectedDeps,
  onToggle,
  onSetScope,
}: DependenciesModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const byCategory = useMemo(
    () =>
      searchQuery.trim()
        ? filterDependencies(DEPENDENCIES, searchQuery)
        : getDependenciesByCategory(),
    [searchQuery]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (!open) setSearchQuery("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dependencies-title"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-2xl max-h-[80vh] flex flex-col bg-card border border-border rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2
            id="dependencies-title"
            className="text-base font-semibold text-foreground"
          >
            Add Dependencies
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-6 pt-4 pb-4 border-b border-border space-y-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kotlin, SQLite, Database, Exposed, McLib..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted/50 border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--kotlin-purple)] focus:border-transparent"
              aria-label="Search dependencies"
              autoFocus
            />
          </div>
          {selectedDeps.size > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedDeps.entries()).map(([id, scope]) => {
                const dep = DEPENDENCIES.find((d) => d.id === id);
                return dep ? (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[rgba(240,196,90,0.2)] border border-[var(--kotlin-purple)] text-[var(--kotlin-purple)] rounded-md"
                  >
                    {dep.name}
                    <span className="text-muted-foreground/80 text-[10px]">
                      ({scope === "provided" ? "Provided" : "Bundled"})
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggle(id)}
                      className="hover:text-foreground ml-0.5"
                      aria-label={`Remove ${dep.name}`}
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">
            Provided = server provides it · Bundled = include in JAR · Press Ctrl
            for multiple adds
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {Object.keys(byCategory).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No dependencies match &quot;{searchQuery}&quot;
            </p>
          ) : (
            Object.entries(byCategory).map(([category, deps]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {category}
                </h3>
                <ul className="space-y-1">
                  {deps.map((dep) => (
                    <DependencyItem
                      key={dep.id}
                      dep={dep}
                      selected={selectedDeps.has(dep.id)}
                      scope={selectedDeps.get(dep.id)}
                      defaultScope={DEFAULT_SCOPES[dep.id] ?? "bundled"}
                      onToggle={() =>
                        onToggle(
                          dep.id,
                          selectedDeps.has(dep.id) ? undefined : (DEFAULT_SCOPES[dep.id] ?? "bundled")
                        )
                      }
                      onSetScope={(scope) => onSetScope(dep.id, scope)}
                    />
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DependencyItem({
  dep,
  selected,
  scope,
  defaultScope,
  onToggle,
  onSetScope,
}: {
  dep: Dependency;
  selected: boolean;
  scope?: DependencyScope;
  defaultScope: DependencyScope;
  onToggle: () => void;
  onSetScope: (scope: DependencyScope) => void;
}) {
  return (
    <li>
      <div
        className={cn(
          "px-4 py-3 rounded-lg border transition-colors",
          selected
            ? "border-[var(--kotlin-purple)] bg-[rgba(240,196,90,0.15)]"
            : "border-transparent hover:bg-muted/50 hover:border-border"
        )}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          className="w-full text-left"
        >
          <div className="font-medium text-foreground">{dep.name}</div>
          <div className="text-sm text-muted-foreground mt-0.5">
            {dep.description}
          </div>
        </button>
        {selected && (
          <div className="mt-3 pt-3 border-t border-border flex gap-2">
            <span className="text-xs text-muted-foreground">
              Scope:
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetScope("provided");
                }}
                className={cn(
                  "px-2 py-1 text-xs rounded transition-colors",
                  scope === "provided"
                    ? "bg-[var(--kotlin-purple)] text-white"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
                title="Provided by server or other plugin (compile only)"
              >
                Provided
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetScope("bundled");
                }}
                className={cn(
                  "px-2 py-1 text-xs rounded transition-colors",
                  scope === "bundled"
                    ? "bg-[var(--kotlin-purple)] text-white"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
                title="Bundled with your plugin (implementation)"
              >
                Bundled
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
