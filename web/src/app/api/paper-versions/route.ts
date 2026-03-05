import { NextResponse } from "next/server";

const PAPER_API_URL = "https://fill.papermc.io/v3/projects/paper";
const USER_AGENT =
  "minecraft-projekt-wirard/1.0 (https://github.com/DeveloperTobi/minecraft-projekt-wirard)";

/** Compare semantic versions (e.g. 1.21.11 vs 1.21.10) - returns negative if a < b */
function compareVersions(a: string, b: string): number {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);
  const maxLen = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < maxLen; i++) {
    const va = partsA[i] ?? 0;
    const vb = partsB[i] ?? 0;
    if (va !== vb) return vb - va; // descending (newest first)
  }
  return 0;
}

export async function GET() {
  try {
    const res = await fetch(PAPER_API_URL, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Paper API returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      versions?: Record<string, string[]>;
    };

    const versions = data.versions ?? {};
    const allVersions: string[] = [];
    for (const group of Object.values(versions)) {
      for (const v of group) {
        // Only stable releases (no -rc, -pre) - these have paper-api Maven artifacts
        if (!v.includes("-rc") && !v.includes("-pre")) {
          allVersions.push(v);
        }
      }
    }

    const unique = [...new Set(allVersions)];
    unique.sort(compareVersions);

    // Convert to paper-api Maven format: {version}-R0.1-SNAPSHOT
    const paperApiVersions = unique.map((v) => `${v}-R0.1-SNAPSHOT`);

    return NextResponse.json(paperApiVersions);
  } catch (err) {
    console.error("Failed to fetch Paper versions:", err);
    return NextResponse.json(
      { error: "Failed to fetch Paper versions" },
      { status: 500 }
    );
  }
}
