'use client';

import { motion } from 'framer-motion';
import { Leaf, Sparkles, Sprout, LucideIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PharaohBorder } from '@/components/sections/EgyptianDecor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  botanicalName?: string;
  categoryId: string;
  category?: { name: string; slug: string };
  image?: string;
  images?: { url: string; alt?: string; isMain?: boolean; order: number }[];
  availableForms: string[];
  packing?: string;
  weight?: string;
  season?: string;
  harvestSeason?: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
}

// Map icon string names to Lucide icon components
const iconMap: Record<string, LucideIcon> = {
  'Leaf': Leaf,
  'Sparkles': Sparkles,
  'Sprout': Sprout,
};

// Map color names from database to Tailwind gradient classes
const colorMap: Record<string, string> = {
  'green-500': 'from-green-500 to-emerald-600',
  'red-500': 'from-red-500 to-orange-600',
  'yellow-500': 'from-amber-500 to-yellow-600',
};

export function ProductsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory || null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from database
  useEffect(() => {
    fetch('/api/categories?activeOnly=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch products from database
  useEffect(() => {
    setLoading(true);
    const url = activeCategory 
      ? `/api/products?categorySlug=${activeCategory}`
      : '/api/products';
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProducts(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (slug: string) => {
    if (activeCategory === slug) {
      // Clear filter - remove param from URL
      setActiveCategory(null);
      router.push('/products');
    } else {
      setActiveCategory(slug);
      router.push(`/products?category=${slug}`);
    }
  };

  const handleClearFilter = () => {
    setActiveCategory(null);
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      {/* Hero Section */}
      <div className="pt-28 pb-8 sm:pt-32 sm:pb-12 bg-gradient-to-b from-emerald-50/40 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-4">
              Our <span className="text-[#2d7a3e]">Premium Products</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">
              Explore our selection of premium Egyptian herbs, spices, and aromatic seeds
            </p>
            <PharaohBorder className="w-48 mx-auto text-[#c4a24c] opacity-30" />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl text-gray-900 mb-2">
              Browse by Category
            </h2>
            <p className="text-gray-600">
              {activeCategory 
                ? `Showing ${categories.find(c => c.slug === activeCategory)?.name || activeCategory}` 
                : 'Select a category to filter products'}
            </p>
          </div>
          
          {categories.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
              {categories.map((category, index) => {
                const IconComponent = iconMap[category.icon] || Leaf;
                const colorClass = colorMap[category.color] || 'from-green-500 to-emerald-600';
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${colorClass} text-white shadow-lg hover:shadow-xl transition-all ${
                      activeCategory === category.slug ? 'ring-4 ring-white ring-offset-4' : ''
                    }`}
                  >
                    <IconComponent className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="text-xl mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-white/90">{category.description}</p>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {activeCategory && (
            <div className="text-center">
              <Button
                onClick={handleClearFilter}
                variant="outline"
                className="border-[#2d7a3e] text-[#2d7a3e] hover:bg-[#2d7a3e] hover:text-white"
              >
                Clear Filter
              </Button>
            </div>
          )}
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-56 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => {
              // Get the first image from images array or fallback to image field
              const productImage = product.images?.[0]?.url || product.image;
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer group"
                  onClick={() => router.push(`/products/${product.slug}`)}
                >
                  {/* Product Image */}
                  {productImage && (
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.category?.name && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-[#2d7a3e] text-white text-xs">
                            {product.category.name}
                          </Badge>
                        </div>
                      )}
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <Button 
                          size="sm" 
                          className="w-full bg-white text-[#2d7a3e] hover:bg-gray-100"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-5">
                    {product.name && (
                      <h3 className="text-lg text-gray-900 mb-1 group-hover:text-[#2d7a3e] transition-colors">
                        {product.name}
                      </h3>
                    )}
                    
                    {product.botanicalName && (
                      <p className="text-xs text-gray-500 italic mb-3">
                        {product.botanicalName}
                      </p>
                    )}

                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      {product.season && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Leaf className="w-3 h-3 text-[#2d7a3e]" />
                          <span>{product.season}</span>
                        </div>
                      )}
                      {product.harvestSeason && (
                        <div className="text-xs text-gray-500">
                          Harvest: {product.harvestSeason}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-gray-600 mb-4">
              No products found in this category
            </p>
            <Button
              onClick={handleClearFilter}
              className="bg-[#2d7a3e] hover:bg-[#1d5a2e] text-white"
            >
              View All Products
            </Button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#2d7a3e] to-[#1d5a2e] rounded-2xl p-8 md:p-12 shadow-xl">
            <Sparkles className="w-16 h-16 text-[#c4a24c] mx-auto mb-4" />
            <h3 className="text-3xl text-white mb-4">
              Need a Custom Order?
            </h3>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              We don&apos;t list prices online. Contact us for detailed specifications, custom blends, bulk orders, and personalized quotes for your business needs.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/contact')}
              className="bg-white text-[#2d7a3e] hover:bg-gray-100 px-8"
            >
              Request a Quote
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
