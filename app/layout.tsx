import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bagossCondensed = localFont({
  src: "../public/fonts/BagossCondensedTRIAL-Medium.woff2",
  variable: "--font-bagoss",
  weight: "500",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SnippetVault",
  description: "Personal Knowledge Base — save links, code snippets, and notes",
  openGraph: {
    title: "SnippetVault",
    description: "Personal Knowledge Base — save links, code snippets, and notes",
    type: "website",
    siteName: "SnippetVault",
  },
  twitter: {
    card: "summary",
    title: "SnippetVault",
    description: "Personal Knowledge Base — save links, code snippets, and notes",
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
      className={`${inter.variable} ${bagossCondensed.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full bg-white font-[family-name:var(--font-inter)] text-gray-900 dark:bg-[#091413] dark:text-zinc-50">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
