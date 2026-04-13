import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spicy Regs Dashboard — Presidential Regulatory Timeline",
  description:
    "Explore U.S. federal regulatory dockets across presidential administrations. Visualize docket volume, public comment engagement, and agency activity from 2000 to present.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* 1. Added suppressHydrationWarning because we are modifying classes via script */
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* 2. Critical: This script runs BEFORE React to prevent the theme "flash" */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      {/* 3. Updated body: Removed hardcoded bg-zinc-950 and added dark: variants */}
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
