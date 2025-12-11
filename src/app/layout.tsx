import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://al-rehabgroup.com'),
  title: {
    default: "Al-Rehab Group for Export | Premium Egyptian Herbs & Spices Supplier",
    template: "%s | Al-Rehab Group for Export",
  },
  description:
    "Leading Egyptian herbs and spices exporter since establishment. Premium quality dried herbs, organic spices, chamomile, hibiscus, cumin, and aromatic seeds. Wholesale B2B supplier from Egypt to worldwide. FSSC 22000, ISO certified.",
  keywords: [
    // Primary target keywords (competitors rank for these)
    "herbs and spices in egypt",
    "egyptian herbs exporter",
    "herbs egypt",
    "spices egypt",
    // Secondary keywords
    "dried herbs egypt",
    "organic herbs egypt",
    "bulk herbs supplier egypt",
    "egyptian spices wholesale",
    "herbs supplier egypt",
    // Product-specific keywords
    "chamomile egypt",
    "hibiscus egypt",
    "cumin seeds egypt",
    "fennel seeds egypt",
    "basil egypt",
    "marjoram egypt",
    "mint egypt",
    "coriander seeds egypt",
    // Business keywords
    "herbs exporter",
    "spices exporter",
    "Egyptian agricultural products",
    "premium spices",
    "wholesale herbs",
    "B2B herbs supplier",
    "organic spices export",
    "dried herbs wholesale",
    // Long-tail keywords
    "buy egyptian herbs online",
    "egyptian herbs wholesale supplier",
    "best herbs exporter egypt",
    "quality spices from egypt",
  ],
  authors: [{ name: "Al-Rehab Group for Export" }],
  creator: "Al-Rehab Group for Export",
  publisher: "Al-Rehab Group for Export",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  // Geographic and language targeting
  alternates: {
    canonical: "https://al-rehabgroup.com",
    languages: {
      'en': 'https://al-rehabgroup.com',
      'x-default': 'https://al-rehabgroup.com',
    },
  },
  // Category classification
  category: "Business",
  classification: "Herbs and Spices Export",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://al-rehabgroup.com",
    siteName: "Al-Rehab Group for Export",
    title: "Al-Rehab Group for Export | #1 Egyptian Herbs & Spices Exporter",
    description:
      "Premium Egyptian herbs and spices exporter. Wholesale dried herbs, organic spices, chamomile, hibiscus, cumin from Egypt. FSSC 22000 & ISO certified. Global shipping.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Al-Rehab Group for Export - Premium Egyptian Herbs & Spices",
      },
    ],
    countryName: "Egypt",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Rehab Group for Export | Egyptian Herbs & Spices",
    description: "Leading Egyptian exporter of premium herbs, spices, and agricultural products. Wholesale B2B supplier.",
    creator: "@alrehabgroup",
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
  // Verification tags (you'll need to add your actual verification codes)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  other: {
    // Geographic meta tags for local SEO
    "geo.region": "EG",
    "geo.placename": "Faiyum, Egypt",
    "geo.position": "29.3084;30.8428",
    "ICBM": "29.3084, 30.8428",
    // Business meta tags
    "business:contact_data:locality": "Faiyum",
    "business:contact_data:country_name": "Egypt",
    // Content language
    "content-language": "en",
    // Distribution
    "distribution": "global",
    "rating": "general",
    "revisit-after": "7 days",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <SessionProvider>
          {children}
          <Toaster position="top-center" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
