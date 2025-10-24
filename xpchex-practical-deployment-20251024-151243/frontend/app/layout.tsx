import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Rubik } from 'next/font/google';
import "./globals.css";
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/theme-toggle"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "KCB App AI Analysis",
  description: "KCB App AI Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${plusJakarta.variable} ${rubik.variable} antialiased`} suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
      <body className="font-inter">
        <ModeToggle />
        <main>
          {children}
        </main>
      </body>
      </ThemeProvider>
    </html>
  );
}
