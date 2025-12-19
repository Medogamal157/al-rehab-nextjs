export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://al-rehabgroup.com';

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Al-Rehab Group for Export",
    alternateName: ["Al Rehab Group", "Al-Rehab Group", "الرحاب جروب للتصدير"],
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/logo.png`,
      width: 200,
      height: 60,
    },
    image: `${baseUrl}/og-image.jpg`,
    description: "Leading Egyptian herbs and spices exporter. Premium quality dried herbs, organic spices, chamomile, hibiscus, cumin, and aromatic seeds. Wholesale B2B supplier from Egypt.",
    foundingDate: "2015",
    founders: [
      {
        "@type": "Person",
        name: "Al-Rehab Group Founders",
      }
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Faiyum",
      addressLocality: "Faiyum",
      addressRegion: "Faiyum Governorate",
      postalCode: "63511",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.3084,
      longitude: 30.8428,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+20-105-555-8189",
        contactType: "sales",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Arabic"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+20-105-555-8189",
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Arabic"],
      },
    ],
    sameAs: [
      // Add your social media URLs here
      // "https://www.facebook.com/al-rehab-group-for-export",
      "https://www.linkedin.com/company/al-rehab-group-for-export"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Egyptian Herbs and Spices",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Herbs",
          itemListElement: [
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Chamomile",
                description: "Premium Egyptian Chamomile - Dried flowers for tea and herbal products",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Basil",
                description: "Premium Egyptian Basil - Dried herb for culinary and medicinal use",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Marjoram",
                description: "Premium Egyptian Marjoram - Aromatic dried herb",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Mint",
                description: "Premium Egyptian Mint - Fresh dried mint leaves",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Parsley",
                description: "Premium Egyptian Parsley - Dried herb for culinary use",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Dill",
                description: "Premium Egyptian Dill - Dried herb for culinary applications",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Spices",
          itemListElement: [
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Cumin Seeds",
                description: "Premium Egyptian Cumin Seeds - Whole or ground spice",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Coriander Seeds",
                description: "Premium Egyptian Coriander Seeds - Whole or ground spice",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Caraway Seeds",
                description: "Premium Egyptian Caraway Seeds - Aromatic spice seeds",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Fennel Seeds",
                description: "Premium Egyptian Fennel Seeds - Aromatic spice seeds",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Seeds & Flowers",
          itemListElement: [
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Hibiscus",
                description: "Premium Egyptian Hibiscus - Dried flowers for tea",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Sesame Seeds",
                description: "Premium Egyptian Sesame Seeds - White or hulled",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
            { 
              "@type": "Offer", 
              itemOffered: { 
                "@type": "Product", 
                name: "Nigella Seeds",
                description: "Premium Egyptian Nigella Seeds - Black seed for health and culinary use",
                brand: { "@type": "Brand", name: "Al-Rehab Group" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "USD",
                  price: "0",
                  priceValidUntil: "2025-12-31",
                  seller: { "@type": "Organization", name: "Al-Rehab Group for Export" }
                }
              } 
            },
          ],
        },
      ],
    },
  };

  // LocalBusiness Schema (important for local SEO)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#localbusiness`,
    name: "Al-Rehab Group for Export",
    image: `${baseUrl}/og-image.jpg`,
    url: baseUrl,
    telephone: "+20-105-555-8189",
    email: "info@al-rehabgroup.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Faiyum",
      addressLocality: "Faiyum",
      addressRegion: "Faiyum Governorate",
      postalCode: "63511",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.3084,
      longitude: 30.8428,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 29.3084,
        longitude: 30.8428,
      },
      geoRadius: "50000",
    },
    serviceArea: {
      "@type": "Place",
      name: "Worldwide",
    },
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Al-Rehab Group for Export",
    description: "Premium Egyptian Herbs & Spices Exporter",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // BreadcrumbList Schema for homepage
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
    ],
  };

  // FAQPage Schema (helps with rich snippets)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What herbs and spices does Al-Rehab Group export from Egypt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Al-Rehab Group for Export specializes in premium Egyptian herbs including chamomile, basil, marjoram, mint, parsley, and dill. We also export spices like cumin, coriander, caraway, fennel seeds, and aromatic products like hibiscus and sesame seeds.",
        },
      },
      {
        "@type": "Question",
        name: "Does Al-Rehab Group offer organic herbs and spices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Al-Rehab Group for Export offers both organic and conventional herbs and spices. We hold certifications including EU Organic, USDA Organic, FSSC 22000, ISO 22000, and HACCP.",
        },
      },
      {
        "@type": "Question",
        name: "Which countries does Al-Rehab Group export to?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Al-Rehab Group for Export ships to over 50 countries worldwide including Europe, North America, Asia, Middle East, and Africa. We provide reliable global shipping with proper documentation.",
        },
      },
      {
        "@type": "Question",
        name: "What certifications does Al-Rehab Group hold?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Al-Rehab Group for Export holds prestigious certifications including FSSC 22000, ISO 22000, ISO 9001, HACCP, EU Organic, USDA Organic, Kosher, and Halal certifications.",
        },
      },
      {
        "@type": "Question",
        name: "What is the minimum order quantity for herbs from Egypt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Al-Rehab Group for Export caters to B2B wholesale orders. Minimum order quantities vary by product. Contact us for specific MOQ requirements and custom packaging options.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
