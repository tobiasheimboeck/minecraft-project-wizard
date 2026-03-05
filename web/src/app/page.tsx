import { Github } from "lucide-react";
import { Wizard } from "@/components/wizard/Wizard";

const GITHUB_REPO = "https://github.com/tobiasheimboeck/minecraft-project-wizard";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center p-8 md:p-8">
        <div className="w-full max-w-[900px] flex flex-col min-h-[calc(100vh-4rem)]">
          <Wizard />
        </div>
      </div>
      <footer className="w-full border-t border-border py-4 flex-shrink-0">
        <div className="flex items-center justify-center gap-4">
          <p className="text-xs text-muted-foreground">
            Not affiliated with Mojang or Paper. Not approved by or associated with
            Mojang Studios or the PaperMC project.
          </p>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="View on GitHub"
          >
            <Github className="size-5" />
          </a>
        </div>
      </footer>
    </main>
  );
}
