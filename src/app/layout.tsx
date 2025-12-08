import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://alrehabgroup.com'),
  title: {
    default: "Al-Rehab Group | Premium Egyptian Herbs & Spices Exporter",
    template: "%s | Al-Rehab Group",
  },
  description:
    "Leading Egyptian exporter of premium herbs, spices, and agricultural products. Quality certified with global shipping to over 50 countries.",
  keywords: [
    "Egyptian herbs",
    "spices exporter",
    "Egyptian agricultural products",
    "herbs supplier",
    "fennel seeds",
    "chamomile",
    "basil",
    "cumin",
    "premium spices",
    "wholesale herbs",
  ],
  authors: [{ name: "Al-Rehab Group" }],
  creator: "Al-Rehab Group",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alrehabgroup.com",
    siteName: "Al-Rehab Group",
    title: "Al-Rehab Group | Premium Egyptian Herbs & Spices Exporter",
    description:
      "Leading Egyptian exporter of premium herbs, spices, and agricultural products.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Al-Rehab Group - Premium Egyptian Herbs & Spices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Rehab Group | Premium Egyptian Herbs & Spices",
    description: "Leading Egyptian exporter of premium herbs, spices, and agricultural products.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <SessionProvider>
          {children}
          <Toaster position="top-center" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
