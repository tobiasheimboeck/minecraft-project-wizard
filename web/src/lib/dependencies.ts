export interface Dependency {
  id: string;
  name: string;
  description: string;
  category: string;
  repoUrl: string;
  /** Maven repository block for build.gradle.kts */
  repoBlock: string;
  /** Maven coordinates without scope, e.g. "group:artifact:version" */
  coordinates: string | string[];
  /** GitHub URL */
  githubUrl: string;
  /** Requires GitHub Packages auth (gpr.user, gpr.key) */
  requiresGithubAuth?: boolean;
}

export const DEPENDENCIES: Dependency[] = [
  {
    id: "kotlinx-serialization-json",
    name: "Kotlinx Serialization JSON",
    description: "Kotlin multiplatform serialization runtime for JSON format.",
    category: "KOTLIN",
    repoUrl: "",
    repoBlock: "",
    coordinates: "org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0",
    githubUrl: "https://github.com/Kotlin/kotlinx.serialization",
  },
  {
    id: "kotlinx-coroutines",
    name: "Kotlin Coroutines",
    description: "Library support for Kotlin coroutines. Asynchronous programming with suspend functions.",
    category: "KOTLIN",
    repoUrl: "",
    repoBlock: "",
    coordinates: "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0",
    githubUrl: "https://github.com/Kotlin/kotlinx.coroutines",
  },
  {
    id: "mccoroutine",
    name: "MCCoroutine",
    description: "Kotlin Coroutines support for Minecraft servers. Suspendable commands, events, and schedulers.",
    category: "KOTLIN",
    repoUrl: "https://jitpack.io",
    repoBlock: `    maven {
        name = "jitpack"
        url = uri("https://jitpack.io")
    }`,
    coordinates: [
      "com.github.shynixn.mccoroutine:mccoroutine-bukkit-api:2.22.0",
      "com.github.shynixn.mccoroutine:mccoroutine-bukkit-core:2.22.0",
    ],
    githubUrl: "https://github.com/Shynixn/MCCoroutine",
  },
  {
    id: "exposed",
    name: "Exposed",
    description: "Kotlin SQL library. Lightweight SQL framework with type-safe DSL for database access.",
    category: "KOTLIN",
    repoUrl: "",
    repoBlock: "",
    coordinates: [
      "org.jetbrains.exposed:exposed-core:1.0.0",
      "org.jetbrains.exposed:exposed-dao:1.0.0",
      "org.jetbrains.exposed:exposed-jdbc:1.0.0",
    ],
    githubUrl: "https://github.com/JetBrains/Exposed",
  },
  {
    id: "mclib",
    name: "McLib",
    description:
      "Shared library for Minecraft plugins. Format system, localization, configuration, scoreboard, commands.",
    category: "LIBRARIES",
    repoUrl: "https://maven.pkg.github.com/DeveloperTobi/mc-lib",
    repoBlock: `    maven {
        name = "mclib"
        url = uri("https://maven.pkg.github.com/DeveloperTobi/mc-lib")
    }`,
    coordinates: "net.developertobi.mclib:mclib-api:1.0-SNAPSHOT",
    githubUrl: "https://github.com/tobiasheimboeck/McLib",
    requiresGithubAuth: true,
  },
  {
    id: "inventory-library",
    name: "Inventory Library",
    description:
      "A comprehensive Kotlin library for creating GUI inventories in Bukkit/Spigot/Paper Minecraft servers.",
    category: "LIBRARIES",
    repoUrl: "https://maven.pkg.github.com/DeveloperTobi-Server/inventory-library",
    repoBlock: `    maven {
        name = "inventory-library"
        url = uri("https://maven.pkg.github.com/DeveloperTobi-Server/inventory-library")
    }`,
    coordinates: "net.developertobi.inventorylib:inventory-api:1.0-SNAPSHOT",
    githubUrl: "https://github.com/DeveloperTobi-Server/inventory-library",
    requiresGithubAuth: true,
  },
  {
    id: "entity-library",
    name: "Entity Library",
    description: "Library for entity management and utilities in Minecraft plugins.",
    category: "LIBRARIES",
    repoUrl: "https://maven.pkg.github.com/DeveloperTobi-Server/entity-library",
    repoBlock: `    maven {
        name = "entity-library"
        url = uri("https://maven.pkg.github.com/DeveloperTobi-Server/entity-library")
    }`,
    coordinates: "net.developertobi.entitylib:entity-api:1.0-SNAPSHOT",
    githubUrl: "https://github.com/DeveloperTobi-Server/entity-library",
    requiresGithubAuth: true,
  },
];

export const GITHUB_AUTH_DEP_IDS = ["mclib", "inventory-library", "entity-library"];

export function getCategories(): string[] {
  return [...new Set(DEPENDENCIES.map((d) => d.category))];
}

export function getDependenciesByCategory(): Record<string, Dependency[]> {
  return DEPENDENCIES.reduce((acc, dep) => {
    if (!acc[dep.category]) acc[dep.category] = [];
    acc[dep.category].push(dep);
    return acc;
  }, {} as Record<string, Dependency[]>);
}
