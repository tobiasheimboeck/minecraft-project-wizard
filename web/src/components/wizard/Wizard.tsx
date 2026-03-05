"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import JSZip from "jszip";
import { Package, FileCode, FileText } from "lucide-react";
import { singleTemplates, multiTemplates } from "@/lib/templates";
import { DEPENDENCIES, GITHUB_AUTH_DEP_IDS } from "@/lib/dependencies";
import { depIdToVarKey } from "@/lib/wizard-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DependenciesModal } from "./DependenciesModal";
import {
  toCamelCase,
  replacePlaceholders,
  processConditionalBlocks,
  filterTemplatesBySourceLang,
} from "@/lib/wizard-utils";
import { cn } from "@/lib/utils";

const VERSIONS = {
  java: ["17", "21", "25"],
  kotlin: ["2.2.21", "2.1.0"],
  /** Fallback when Paper API is unavailable */
  paper: [
    "1.21.11-R0.1-SNAPSHOT",
    "1.21.4-R0.1-SNAPSHOT",
    "1.21.3-R0.1-SNAPSHOT",
    "1.21.1-R0.1-SNAPSHOT",
    "1.20.4-R0.1-SNAPSHOT",
  ],
};

const BINARY_PREFIX = "__BINARY_BASE64__";

function generateZip(vars: Record<string, string>, templates: Record<string, string>) {
  const filtered = filterTemplatesBySourceLang(templates, vars.SOURCE_LANG);
  const zip = new JSZip();
  for (const [filePath, content] of Object.entries(filtered)) {
    const resolvedPath = replacePlaceholders(filePath, vars);
    if (typeof content === "string" && content.startsWith(BINARY_PREFIX)) {
      const base64 = content.slice(BINARY_PREFIX.length);
      const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      zip.file(resolvedPath, binary);
    } else {
      let resolvedContent = replacePlaceholders(content, vars);
      resolvedContent = processConditionalBlocks(resolvedContent, vars);
      zip.file(resolvedPath, resolvedContent);
    }
  }
  return zip;
}

function downloadZip(zip: JSZip, filename: string) {
  zip.generateAsync({ type: "blob" }).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });
}

export function Wizard() {
  const [projectType, setProjectType] = useState<"single" | "multi">("single");
  const [sourceLang, setSourceLang] = useState<"kotlin" | "java">("kotlin");
  const [showGithubOwner, setShowGithubOwner] = useState(false);
  /** Map: depId -> "provided" | "bundled" */
  const [selectedDependencies, setSelectedDependencies] = useState<
    Map<string, "provided" | "bundled">
  >(new Map());
  const [dependenciesModalOpen, setDependenciesModalOpen] = useState(false);
  const [gprUser, setGprUser] = useState("");
  const [gprKey, setGprKey] = useState("");
  const [includeLocalProperties, setIncludeLocalProperties] = useState(false);
  const [pluginVersion, setPluginVersion] = useState("1.0-SNAPSHOT");
  const [pluginAuthors, setPluginAuthors] = useState("YourName");
  const [pluginDescription, setPluginDescription] = useState("");
  const [pluginWebsite, setPluginWebsite] = useState("");
  const [paperVersions, setPaperVersions] = useState<string[]>(VERSIONS.paper);
  const [preview, setPreview] = useState({
    projectName: "my-plugin",
    groupId: "com.example",
    apiModule: "mclib-api",
    pluginModule: "mclib-plugin",
  });

  const hasGithubAuthDeps = GITHUB_AUTH_DEP_IDS.some((id) => selectedDependencies.has(id));

  const formRef = useRef<HTMLFormElement>(null);
  const syncPreview = useCallback((form: HTMLFormElement | null) => {
    if (!form) return;
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement)?.value ?? "";
    setPreview({
      projectName: get("projectName") || "my-plugin",
      groupId: get("groupId") || "com.example",
      apiModule: get("apiModule") || "mclib-api",
      pluginModule: get("pluginModule") || "mclib-plugin",
    });
  }, []);

  useEffect(() => {
    syncPreview(formRef.current);
  }, [projectType, syncPreview]);

  useEffect(() => {
    fetch("/api/paper-versions")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((versions: string[]) => {
        if (Array.isArray(versions) && versions.length > 0) {
          setPaperVersions(versions);
        }
      })
      .catch(() => {});
  }, []);

  const toggleDependency = (id: string, scope?: "provided" | "bundled") => {
    setSelectedDependencies((prev) => {
      const next = new Map(prev);
      if (scope === undefined) {
        next.delete(id);
      } else {
        next.set(id, scope);
      }
      return next;
    });
  };

  const setDependencyScope = (id: string, scope: "provided" | "bundled") => {
    setSelectedDependencies((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.set(id, scope);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const projectName = (formData.get("projectName") as string)?.trim();
    const groupId = (formData.get("groupId") as string)?.trim();

    if (!projectName || !groupId) {
      alert("Please fill in Project Name and Group ID.");
      return;
    }

    const paperVersion = formData.get("paperVersion") as string;
    const paperApiVersion = paperVersion.split("-")[0];

    const vars: Record<string, string> = {
      PROJECT_NAME: projectName,
      PROJECT_NAME_CAMEL: toCamelCase(projectName.replace(/-/g, " ")),
      GROUP_ID: groupId,
      PACKAGE_PATH: groupId.replace(/\./g, "/"),
      JAVA_VERSION: formData.get("javaVersion") as string,
      KOTLIN_VERSION: formData.get("kotlinVersion") as string,
      PAPER_VERSION: paperVersion,
      PAPER_API_VERSION: paperApiVersion,
      SOURCE_LANG: sourceLang,
      SOURCE_KOTLIN: sourceLang === "kotlin" ? "true" : "false",
      SOURCE_JAVA: sourceLang === "java" ? "true" : "false",
      GITHUB_PUBLISH: formData.get("githubPublish") ? "true" : "false",
      GITHUB_OWNER: (formData.get("githubOwner") as string) || "github",
      PLUGIN_VERSION: pluginVersion || "1.0-SNAPSHOT",
      PLUGIN_AUTHORS_YAML: pluginAuthors
        .split(",")
        .map((a) => `  - ${a.trim()}`)
        .filter((s) => s.length > 4)
        .join("\n") || "  - YourName",
      PLUGIN_DESCRIPTION: pluginDescription.trim(),
      PLUGIN_WEBSITE: pluginWebsite.trim(),
      PLUGIN_HAS_DESCRIPTION: pluginDescription.trim() ? "true" : "false",
      PLUGIN_HAS_WEBSITE: pluginWebsite.trim() ? "true" : "false",
    };

    for (const dep of DEPENDENCIES) {
      const scope = selectedDependencies.get(dep.id);
      const key = depIdToVarKey(dep.id);
      const isSelected = scope !== undefined;
      vars[key] = isSelected ? "true" : "false"; // for repo blocks
      vars[`${key}_COMPILEONLY`] = scope === "provided" ? "true" : "false";
      vars[`${key}_IMPLEMENTATION`] = scope === "bundled" ? "true" : "false";
    }

    if (projectType === "multi") {
      const apiModule = (formData.get("apiModule") as string)?.trim();
      const pluginModule = (formData.get("pluginModule") as string)?.trim();
      if (!apiModule || !pluginModule) {
        alert("Please fill in API and Plugin module names.");
        return;
      }
      vars.API_MODULE = apiModule;
      vars.PLUGIN_MODULE = pluginModule;
    }

    const templates = projectType === "multi" ? multiTemplates : singleTemplates;
    const zip = generateZip(vars, templates);

    const gprUserVal = (formData.get("gprUser") as string)?.trim();
    const gprKeyVal = (formData.get("gprKey") as string)?.trim();
    const includeLocalProps = formData.get("includeLocalProperties") === "on";
    if (includeLocalProps && gprUserVal && gprKeyVal) {
      zip.file(
        "local.properties",
        `gpr.user=${gprUserVal}\ngpr.key=${gprKeyVal}\n`
      );
    }

    downloadZip(zip, `${projectName}.zip`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <header className="mb-10 text-center">
        <h1 className="text-[1.75rem] font-semibold text-foreground mb-2">
          Minecraft Plugin Generator
        </h1>
        <p className="text-muted-foreground text-sm">
          Generate a Minecraft plugin project – Java or Kotlin, single or multi-module
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="flex flex-col gap-6">
          <form
            ref={formRef}
            id="wizard-form"
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
            onInput={(e) => syncPreview(e.currentTarget)}
            onChange={(e) => syncPreview(e.currentTarget)}
          >
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Project
              </h2>
              <div className="flex flex-wrap gap-2">
                {(["single", "multi"] as const).map((value) => (
                  <label
                    key={value}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 text-[0.8125rem] border cursor-pointer transition-colors",
                      projectType === value
                        ? "border-[var(--kotlin-purple)] bg-[rgba(240,196,90,0.15)] text-[var(--kotlin-purple)]"
                        : "border-border bg-card text-foreground hover:border-[#555] hover:bg-[#2d2d2d]"
                    )}
                  >
                    <input
                      type="radio"
                      name="projectType"
                      value={value}
                      checked={projectType === value}
                      onChange={() => setProjectType(value)}
                      className="sr-only"
                    />
                    {value === "single" ? "Single" : "Multi-Module"}
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Source Language
              </h2>
              <div className="flex flex-wrap gap-2">
                {(["kotlin", "java"] as const).map((value) => (
                  <label
                    key={value}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 text-[0.8125rem] border cursor-pointer transition-colors",
                      sourceLang === value
                        ? "border-[var(--kotlin-purple)] bg-[rgba(240,196,90,0.15)] text-[var(--kotlin-purple)]"
                        : "border-border bg-card text-foreground hover:border-[#555] hover:bg-[#2d2d2d]"
                    )}
                  >
                    <input
                      type="radio"
                      name="sourceLang"
                      value={value}
                      checked={sourceLang === value}
                      onChange={() => setSourceLang(value)}
                      className="sr-only"
                    />
                    {value === "kotlin" ? "Kotlin" : "Java"}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Gradle build files (.kts) stay Kotlin DSL in both cases.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Project Metadata
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName" className="mb-1.5 block">
                    Name
                  </Label>
                  <Input
                    id="projectName"
                    name="projectName"
                    defaultValue="my-plugin"
                    placeholder="my-plugin"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="groupId" className="mb-1.5 block">
                    Group
                  </Label>
                  <Input
                    id="groupId"
                    name="groupId"
                    defaultValue="com.example"
                    placeholder="com.example"
                    required
                  />
                </div>
              </div>
            </section>

            <section className={cn(projectType !== "multi" && "hidden")}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Modules
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apiModule" className="mb-1.5 block">
                    API Module
                  </Label>
                  <Input
                    id="apiModule"
                    name="apiModule"
                    defaultValue="mclib-api"
                    placeholder="mclib-api"
                  />
                </div>
                <div>
                  <Label htmlFor="pluginModule" className="mb-1.5 block">
                    Plugin Module
                  </Label>
                  <Input
                    id="pluginModule"
                    name="pluginModule"
                    defaultValue="mclib-plugin"
                    placeholder="mclib-plugin"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Dependencies
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDependenciesModalOpen(true)}
                >
                  ADD DEPENDENCIES...
                </Button>
              </div>
              <div className="min-h-[60px] border border-border px-4 py-3">
                {selectedDependencies.size === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No dependency selected
                  </p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {Array.from(selectedDependencies.entries()).map(([id, scope]) => {
                      const dep = DEPENDENCIES.find((d) => d.id === id);
                      return dep ? (
                        <li key={id}>
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-[rgba(240,196,90,0.15)] border border-[var(--kotlin-purple)] text-[var(--kotlin-purple)]">
                            {dep.name}
                            <span className="text-muted-foreground/80">
                              ({scope === "provided" ? "Provided" : "Bundled"})
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setDependencyScope(id, scope === "provided" ? "bundled" : "provided")
                              }
                              className="hover:text-foreground px-0.5 text-[10px]"
                              title={
                                scope === "provided"
                                  ? "Switch to Bundled"
                                  : "Switch to Provided"
                              }
                            >
                              ⇄
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleDependency(id)}
                              className="hover:text-foreground"
                              aria-label={`Remove ${dep.name}`}
                            >
                              ×
                            </button>
                          </span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                )}
              </div>
            </section>

            <section className={cn(!hasGithubAuthDeps && "hidden")}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                GitHub Credentials (for private libraries)
              </h2>
              <p className="text-xs text-muted-foreground mb-3">
                McLib, Inventory Library, and Entity Library are hosted on GitHub Packages.
                Provide credentials to download them, or use environment variables GPR_USER / GPR_KEY.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gprUser" className="mb-1.5 block">
                    GitHub Username
                  </Label>
                  <Input
                    id="gprUser"
                    name="gprUser"
                    placeholder="username"
                    value={gprUser}
                    onChange={(e) => setGprUser(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gprKey" className="mb-1.5 block">
                    GitHub Token (PAT)
                  </Label>
                  <Input
                    id="gprKey"
                    name="gprKey"
                    type="password"
                    placeholder="ghp_..."
                    value={gprKey}
                    onChange={(e) => setGprKey(e.target.value)}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground mt-3">
                <Checkbox
                  id="includeLocalProperties"
                  name="includeLocalProperties"
                  checked={includeLocalProperties}
                  onChange={(e) => setIncludeLocalProperties(e.target.checked)}
                />
                Include local.properties with credentials in generated project
              </label>
            </section>

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Java
              </h2>
              <div className="flex flex-wrap gap-2">
                {VERSIONS.java.map((v) => (
                  <label
                    key={v}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 text-[0.8125rem] border cursor-pointer transition-colors",
                      "border-border bg-card text-foreground hover:border-[#555] hover:bg-[#2d2d2d]",
                      "has-[:checked]:border-[var(--kotlin-purple)] has-[:checked]:bg-[rgba(240,196,90,0.15)] has-[:checked]:text-[var(--kotlin-purple)]"
                    )}
                  >
                    <input
                      type="radio"
                      name="javaVersion"
                      value={v}
                      defaultChecked={v === "21"}
                      className="sr-only"
                    />
                    {v}
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Versions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={cn(sourceLang !== "kotlin" && "hidden")}>
                  <Label htmlFor="kotlinVersion" className="mb-1.5 block">
                    Kotlin
                  </Label>
                  <Select id="kotlinVersion" name="kotlinVersion" defaultValue="2.2.21">
                    {VERSIONS.kotlin.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paperVersion" className="mb-1.5 block">
                    Paper API
                  </Label>
                  <Select
                    id="paperVersion"
                    name="paperVersion"
                    defaultValue="1.21.11-R0.1-SNAPSHOT"
                  >
                    {paperVersions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </section>

            <section className={cn(projectType !== "multi" && "hidden")}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Publishing
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                <Checkbox
                  id="githubPublish"
                  name="githubPublish"
                  onChange={(e) => setShowGithubOwner(e.target.checked)}
                />
                GitHub Packages Maven Publish
              </label>
              <div className={cn("mt-4", !showGithubOwner && "hidden")}>
                <Label htmlFor="githubOwner" className="mb-1.5 block">
                  GitHub Owner
                </Label>
                <Input
                  id="githubOwner"
                  name="githubOwner"
                  placeholder="username"
                />
              </div>
            </section>
          </form>
        </div>

        <aside className="bg-card border border-border p-6 min-h-[200px] flex flex-col gap-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Package className="size-3.5" />
              Project Preview
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Name</span>
                <span className="font-mono text-foreground truncate" title={preview.projectName}>
                  {preview.projectName || "—"}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Group</span>
                <span className="font-mono text-foreground truncate" title={preview.groupId}>
                  {preview.groupId || "—"}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground">
                  {projectType === "single" ? "Single-module" : "Multi-module"}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Language</span>
                <span className="text-foreground">
                  {sourceLang === "kotlin" ? "Kotlin" : "Java"}
                </span>
              </div>
              {projectType === "multi" && (
                <>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">API Module</span>
                    <span className="font-mono text-foreground truncate" title={preview.apiModule}>
                      {preview.apiModule || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Plugin Module</span>
                    <span className="font-mono text-foreground truncate" title={preview.pluginModule}>
                      {preview.pluginModule || "—"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <FileText className="size-3.5" />
              plugin.yml
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <Label htmlFor="pluginVersion" className="mb-1 block text-xs">
                  Version
                </Label>
                <Input
                  id="pluginVersion"
                  value={pluginVersion}
                  onChange={(e) => setPluginVersion(e.target.value)}
                  placeholder="1.0-SNAPSHOT"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="pluginAuthors" className="mb-1 block text-xs">
                  Authors (comma-separated)
                </Label>
                <Input
                  id="pluginAuthors"
                  value={pluginAuthors}
                  onChange={(e) => setPluginAuthors(e.target.value)}
                  placeholder="YourName, CoAuthor"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="pluginDescription" className="mb-1 block text-xs">
                  Description (optional)
                </Label>
                <Input
                  id="pluginDescription"
                  value={pluginDescription}
                  onChange={(e) => setPluginDescription(e.target.value)}
                  placeholder="A short plugin description"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="pluginWebsite" className="mb-1 block text-xs">
                  Website (optional)
                </Label>
                <Input
                  id="pluginWebsite"
                  value={pluginWebsite}
                  onChange={(e) => setPluginWebsite(e.target.value)}
                  placeholder="https://..."
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </section>

          {selectedDependencies.size > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <FileCode className="size-3.5" />
                Dependencies ({selectedDependencies.size})
              </h3>
              <ul className="space-y-1.5 text-sm">
                {Array.from(selectedDependencies.entries()).map(([id, scope]) => {
                  const dep = DEPENDENCIES.find((d) => d.id === id);
                  return dep ? (
                    <li key={id} className="flex justify-between gap-2">
                      <span className="text-foreground truncate" title={dep.name}>
                        {dep.name}
                      </span>
                      <span className="text-muted-foreground text-xs shrink-0">
                        {scope === "provided" ? "Provided" : "Bundled"}
                      </span>
                    </li>
                  ) : null;
                })}
              </ul>
            </section>
          )}

          <section className="mt-auto pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gradle Kotlin DSL, Paper API, shadow plugin. Output:{" "}
              <span className="font-mono text-foreground">{preview.projectName}.zip</span>
            </p>
          </section>
        </aside>
      </div>

      <div className="mt-auto pt-8 flex justify-end">
        <Button type="submit" form="wizard-form">
          Generate
        </Button>
      </div>

      <DependenciesModal
        open={dependenciesModalOpen}
        onClose={() => setDependenciesModalOpen(false)}
        selectedDeps={selectedDependencies}
        onToggle={toggleDependency}
        onSetScope={setDependencyScope}
      />
    </div>
  );
}
