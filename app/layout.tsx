import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Header } from "@/src/components/ui/Layout/Header";
import { BottomNav } from "@/src/components/ui/Layout/BottomNav";
import type { Language } from "@/src/lib/i18n/dictionaries";

export const viewport: Viewport = {
  themeColor: "#BB6653",
};

export const metadata: Metadata = {
  title: "Artisans",
  description: "AI-Driven Market Linkage and Smart Cataloging Mobile Application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Artisans",
  },
};

import { getUserAndProfile } from '@/src/lib/supabase/server'

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value === 'hi' ? 'hi' : 'en') as Language
  const { profile } = await getUserAndProfile()
  const role = profile?.role || null

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen flex flex-col bg-background">
        <Header lang={lang} />
        <main className="flex-1 pb-20">
          {children}
        </main>
        <BottomNav role={role} lang={lang} />
      </body>
    </html>
  );
}
