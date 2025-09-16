// ---> NEXT 13
import type { Metadata } from "next";
import { Barlow, Inter } from "next/font/google";

// ---> THEME PROVIDER
import { ThemeProvider } from "next-themes";

// ---> GLOBAL CSS
import "./globals.css";

// ---> COMPONENTS
import { ClerkProvider } from "@clerk/nextjs";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

// ---> TOAST
import { Toaster as SonnarToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import ModalProvider from "@/providers/modal-provider";

// ---> FONTS
const interFont = Inter({
  subsets: ["latin"],
});

// ---> BARLOW
const barlowFont = Barlow({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-barlow",
});

// ---> METADATA
export const metadata: Metadata = {
  title: "KongMarket",
  description: "Welcome to kong market",
};

// ---> LAYOUT
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <ClerkProvider>
      <SessionProvider session={session}>
        <html lang="en" suppressHydrationWarning>
          <body className={` ${interFont.className} ${barlowFont.variable}`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              <SonnarToaster position="bottom-right" />
              <ModalProvider>{children}</ModalProvider>
            </ThemeProvider>
          </body>
        </html>
      </SessionProvider>
    </ClerkProvider>
  );
}

// #20401c
// #f98d01
// #2d100e
// #b1292f
// #ffb800
// #ffffff
