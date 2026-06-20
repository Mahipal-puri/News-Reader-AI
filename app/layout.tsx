import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "NewsAI — Personalized news, summarized for you",
  description:
    "An AI-powered news reader. Aggregated headlines, AI summaries, voice playback, and a personalized feed.",
  applicationName: "NewsAI",
  authors: [{ name: "Digital Hammer" }],
  creator: "Digital Hammer",
  publisher: "Digital Hammer",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <a href="#main" className="skip-link">Skip to content</a>
        <ThemeProvider>
          <ReduxProvider>
            <ToastProvider>{children}</ToastProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
