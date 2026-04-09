import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snip Labs",
  description: "Personal Knowledge Base. Save links, code snippets, and notes.",
  openGraph: {
    title: "Snip Labs",
    description: "Personal Knowledge Base. Save links, code snippets, and notes.",
    type: "website",
    siteName: "Snip Labs",
  },
  twitter: {
    card: "summary",
    title: "Snip Labs",
    description: "Personal Knowledge Base. Save links, code snippets, and notes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full bg-white font-[family-name:var(--font-inter)] text-black dark:bg-black dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          {children}
          <Toaster richColors position="bottom-right" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
