import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono, Unbounded } from "next/font/google";
import "./globals.css";

// Headings: wide, heavy display font
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"] });
// Body text: clean sans-serif
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Small labels and numbers: monospace
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Studyboard: Personal & Study Group Dashboard",
  description:
    "Track course topics, materials and notes, alone or with your study group.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a0d" },
  ],
};

// Runs before the page shows, so a saved dark theme doesn't "flash" light first.
const themeScript = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${unbounded.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
