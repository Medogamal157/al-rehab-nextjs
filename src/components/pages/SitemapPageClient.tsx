'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Info,
  Package,
  Award,
  FlaskConical,
  Sprout,
  Ship,
  Mail,
  FileText,
  Shield,
  Scale,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  englishName: string;
  slug: string;
  category?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

export function SitemapPageClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        // Group products by category
        const categoriesWithProducts = categoriesData.map((cat: Category) => ({
          ...cat,
          products: productsData.filter(
            (prod: Product) => prod.category?.name === cat.name
          ),
        }));

        setCategories(categoriesWithProducts);
      } catch (error) {
        console.error('Error fetching sitemap data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const mainPages = [
    { name: 'Home', href: '/', icon: Home, description: 'Welcome to Al-Rehab Group for Export' },
    { name: 'About Us', href: '/about', icon: Info, description: 'Learn about our company and mission' },
    { name: 'Products', href: '/products', icon: Package, description: 'Browse our premium Egyptian products' },
    { name: 'Certificates', href: '/certificates', icon: Award, description: 'View our quality certifications' },
    { name: 'Quality Control', href: '/quality-control', icon: FlaskConical, description: 'Our quality assurance process' },
    { name: 'Our Farms', href: '/farms', icon: Sprout, description: 'Discover our sustainable farming practices' },
    { name: 'Shipments', href: '/shipments', icon: Ship, description: 'Learn about our global shipping' },
    { name: 'Contact', href: '/contact', icon: Mail, description: 'Get in touch with us' },
  ];

  const legalPages = [
    { name: 'Export Terms', href: '/export-terms', icon: FileText },
    { name: 'Terms of Service', href: '/terms-of-service', icon: Scale },
    { name: 'Privacy Policy', href: '/privacy-policy', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading sitemap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-amber-900 md:text-5xl">
          Site Map
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Navigate through all pages and discover our complete range of premium Egyptian herbs, spices, and medicinal plants.
        </p>
      </div>

      <div className="space-y-8">
        {/* Main Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-amber-900">
              <Home className="h-6 w-6" />
              Main Pages
            </CardTitle>
            <CardDescription>
              Essential pages about our company and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mainPages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="group flex items-start gap-3 rounded-lg border p-4 transition-all hover:border-amber-500 hover:bg-amber-50/50 hover:shadow-md"
                  >
                    <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-amber-600 transition-transform group-hover:scale-110" />
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-amber-900">
                        {page.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {page.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Products by Category */}
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-amber-900">
                <Package className="h-6 w-6" />
                {category.name}
              </CardTitle>
              <CardDescription>
                {category.products.length} product{category.products.length !== 1 ? 's' : ''} in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.products.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group flex flex-col gap-1 rounded-lg border p-3 transition-all hover:border-amber-500 hover:bg-amber-50/50 hover:shadow-md"
                    >
                      <h3 className="font-semibold text-foreground group-hover:text-amber-900">
                        {product.name}
                      </h3>
                      {product.englishName && (
                        <p className="text-sm text-muted-foreground">
                          {product.englishName}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No products in this category yet.</p>
              )}
            </CardContent>
          </Card>
        ))}

        <Separator className="my-8" />

        {/* Legal Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-amber-900">
              <FileText className="h-6 w-6" />
              Legal & Policies
            </CardTitle>
            <CardDescription>
              Terms, policies, and legal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {legalPages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="group flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-amber-500 hover:bg-amber-50/50 hover:shadow-md"
                  >
                    <Icon className="h-5 w-5 flex-shrink-0 text-amber-600 transition-transform group-hover:scale-110" />
                    <h3 className="font-semibold text-foreground group-hover:text-amber-900">
                      {page.name}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* SEO Note */}
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              For XML sitemap used by search engines, visit{' '}
              <Link href="/sitemap.xml" className="font-medium text-amber-600 hover:text-amber-700 hover:underline" target="_blank">
                /sitemap.xml
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
