export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

export function replacePlaceholders(text: string, vars: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    result = result.split(`{{${key}}}`).join(value ?? "");
  }
  return result;
}

export function processConditionalBlocks(text: string, vars: Record<string, string>): string {
  let result = text;
  if (!vars.GITHUB_PUBLISH || vars.GITHUB_PUBLISH !== "true") {
    result = result.replace(/\{\{#GITHUB_PUBLISH\}\}[\s\S]*?\{\{\/GITHUB_PUBLISH\}\}/g, "");
  } else {
    result = result.replace(/\{\{#GITHUB_PUBLISH\}\}/g, "").replace(/\{\{\/GITHUB_PUBLISH\}\}/g, "");
  }
  const isKotlin = vars.SOURCE_LANG === "kotlin";
  result = result.replace(
    /\{\{#SOURCE_KOTLIN\}\}[\s\S]*?\{\{\/SOURCE_KOTLIN\}\}/g,
    (m) => (isKotlin ? m.replace(/\{\{#SOURCE_KOTLIN\}\}|\{\{\/SOURCE_KOTLIN\}\}/g, "") : "")
  );
  result = result.replace(
    /\{\{#SOURCE_JAVA\}\}[\s\S]*?\{\{\/SOURCE_JAVA\}\}/g,
    (m) => (!isKotlin ? m.replace(/\{\{#SOURCE_JAVA\}\}|\{\{\/SOURCE_JAVA\}\}/g, "") : "")
  );
  // Dynamic blocks: DEP_*, PLUGIN_HAS_*, etc. – show when vars[key] === "true"
  result = result.replace(
    /\{\{#([A-Z0-9_]+)\}\}[\s\S]*?\{\{\/\1\}\}/g,
    (m, key) =>
      vars[key] === "true"
        ? m.replace(new RegExp(`\\{\\{#${key}\\}\\}|\\{\\{/${key}\\}\\}`, "g"), "")
        : ""
  );
  return result;
}

/** Converts dependency id to var key, e.g. "inventory-library" -> "DEP_INVENTORY_LIBRARY" */
export function depIdToVarKey(id: string): string {
  return "DEP_" + id.replace(/-/g, "_").toUpperCase();
}

export function filterTemplatesBySourceLang(
  templates: Record<string, string>,
  sourceLang: string
): Record<string, string> {
  const excludeDir = sourceLang === "kotlin" ? "/java/" : "/kotlin/";
  return Object.fromEntries(
    Object.entries(templates).filter(([path]) => !path.includes(excludeDir))
  );
}
