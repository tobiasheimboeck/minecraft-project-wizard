import { Wizard } from "@/components/wizard/Wizard";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-8 md:p-8">
      <div className="w-full max-w-[900px] flex flex-col min-h-[calc(100vh-4rem)]">
        <Wizard />
      </div>
    </main>
  );
}
