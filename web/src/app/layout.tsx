import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paper Plugin Generator",
  description:
    "Generate a Paper plugin project – Java or Kotlin, single or multi-module",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
