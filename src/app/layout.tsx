import type { Metadata, Viewport } from "next";
import { Fustat, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#22d3ee",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "SkillSwap",
  description: "Peer-to-peer skill exchange platform built with Liquid Glass UI",
  appleWebApp: {
    capable: true,
    title: "SkillSwap",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fustat.variable} ${inter.variable} h-full antialiased scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-inter" suppressHydrationWarning>
        <Providers>{children}</Providers>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </body>
    </html>
  );
}
