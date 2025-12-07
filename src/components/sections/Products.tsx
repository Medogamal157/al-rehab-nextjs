'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sprout, Sparkles, Leaf, LucideIcon } from 'lucide-react';
import { PharaohBorder, LotusIcon } from './EgyptianDecor';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  image: string;
  products: { id: string; name: string }[];
}

// Map icon string names to Lucide icon components
const iconMap: Record<string, LucideIcon> = {
  'Leaf': Leaf,
  'Sparkles': Sparkles,
  'Sprout': Sprout,
};

// Map color names from database to Tailwind gradient classes
const colorMap: Record<string, string> = {
  'green-500': 'from-[#2d7a3e] to-[#1d5a2e]',
  'red-500': 'from-[#c4a24c] to-[#a48a3c]',
  'yellow-500': 'from-[#2d7a3e] to-[#1d5a2e]',
};

export function Products() {
  const router = useRouter();
  const ref = useRef(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories?activeOnly=true');
        const data = await res.json();
        
        if (data.success && data.data) {
          // Fetch products for each category (limit 8)
          const categoriesWithProducts = await Promise.all(
            data.data.map(async (cat: Category) => {
              const prodRes = await fetch(`/api/products?categoryId=${cat.id}&limit=8`);
              const prodData = await prodRes.json();
              return {
                ...cat,
                products: prodData.success ? prodData.data : []
              };
            })
          );
          setCategories(categoriesWithProducts);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section ref={ref} id="products" className="py-20 bg-gradient-to-b from-white to-amber-50/30 relative overflow-hidden">
      {/* Parallax Background Decoration */}
      <motion.div 
        style={{ y: yBackground, opacity: useTransform(opacity, [0, 1], [0, 0.05]), rotate }}
        className="absolute top-20 left-0"
      >
        <LotusIcon className="w-96 h-96 text-[#2d7a3e]" />
      </motion.div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-[#2d7a3e]/10 text-[#2d7a3e] rounded-full border border-[#2d7a3e]/20">
              Our Products
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-6">
            Premium Bulk Herbs, Spices & Aromatic Seeds
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Discover our comprehensive range of high-quality herbs, spices, and aromatic seeds from Egypt
          </p>
          
          {/* Decorative Border */}
          <div className="text-[#c4a24c] opacity-30">
            <PharaohBorder className="w-64 mx-auto" />
          </div>
        </motion.div>

        {/* Products Grid with Parallax */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-lg" />
                <div className="p-6 bg-white rounded-b-lg">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-6 w-16 bg-gray-200 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? null : (
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const IconComponent = iconMap[category.icon] || Leaf;
              const colorClass = colorMap[category.color] || 'from-[#2d7a3e] to-[#1d5a2e]';
              
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => router.push(`/products?category=${category.slug}`)}
                  className="w-full text-left"
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 hover:border-[#2d7a3e]/50 relative cursor-pointer h-full">
                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.8 }}
                    />

                    {/* Image */}
                    {category.image && (
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-600 group-hover:scale-115"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-t ${colorClass} opacity-60`}
                          whileHover={{ opacity: 0.4 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Icon Badge with Animation */}
                        <motion.div
                          className="absolute top-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.6, type: "spring" }}
                        >
                          <IconComponent className="text-[#2d7a3e]" size={32} />
                        </motion.div>
                        
                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                          <motion.h3
                            className="text-3xl text-white"
                            initial={{ x: 0 }}
                            whileHover={{ x: 10 }}
                            transition={{ duration: 0.3 }}
                          >
                            {category.name}
                          </motion.h3>
                        </div>
                      </div>
                    )}

                    {/* Products List - only show if products exist */}
                    {category.products && category.products.length > 0 && (
                      <div className="p-6 bg-white">
                        <div className="flex flex-wrap gap-2">
                          {category.products.map((product, idx) => (
                            <motion.span
                              key={product.id}
                              className="px-3 py-1 bg-gradient-to-r from-amber-50 to-emerald-50 text-gray-700 rounded-full text-sm border border-[#2d7a3e]/10 cursor-pointer"
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.05 }}
                              whileHover={{ scale: 1.1, backgroundColor: '#2d7a3e', color: '#fff' }}
                            >
                              {product.name}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <motion.button
            onClick={() => router.push('/products')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[#2d7a3e] text-white rounded-full hover:bg-[#1d5a2e] transition-colors"
          >
            View All Products
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
