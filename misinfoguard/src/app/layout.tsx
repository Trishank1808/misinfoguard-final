import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MisinfoGuard — AI Misinformation Risk Analyzer",
  description:
    "Analyze WhatsApp messages for fake news, scams, spam, and manipulation using an explainable AI risk engine.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts via <link>: looks right online, falls back to system fonts offline (never breaks the build). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-base-950 font-body antialiased">
        {children}
        <Toaster
          theme="light"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              border: "1px solid rgba(11,13,20,0.08)",
              color: "#14161F",
              boxShadow: "0 8px 28px rgba(20,25,45,0.10)",
            },
          }}
        />
      </body>
    </html>
  );
}
