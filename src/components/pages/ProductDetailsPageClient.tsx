'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Sprout, 
  Package, 
  Check, 
  Leaf,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PharaohBorder } from '@/components/sections/EgyptianDecor';
import { PageViewTracker } from '@/components/shared/PageViewTracker';

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain: boolean;
  order: number;
}

interface Product {
  id: string;
  name: string;
  englishName?: string;
  botanicalName?: string;
  slug: string;
  description?: string;
  category?: { id: string; name: string; slug: string };
  season?: string;
  harvestSeason?: string;
  packing?: string;
  weight?: string;
  origin?: string;
  shelfLife?: string;
  storageTemp?: string;
  availableForms: string[];
  specifications?: Record<string, string>;
  features: string[];
  images: ProductImage[];
}

interface ProductDetailsPageClientProps {
  slug: string;
}

export function ProductDetailsPageClient({ slug }: ProductDetailsPageClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        
        if (!data.success || !data.data) {
          setError('Product not found');
          // Redirect to products page after a short delay
          setTimeout(() => router.push('/products'), 2000);
          return;
        }
        
        setProduct(data.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product');
        setTimeout(() => router.push('/products'), 2000);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [slug, router]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 sm:pt-32">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#2d7a3e] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 sm:pt-32">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'The requested product could not be found.'}</p>
            <p className="text-sm text-gray-500">Redirecting to products page...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get images array - sorted by order
  const images = product.images.length > 0 
    ? product.images.sort((a, b) => a.order - b.order).map(img => img.url)
    : ['/products/placeholder.jpg'];

  // Parse specifications if it's a JSON object
  const specifications = product.specifications && typeof product.specifications === 'object'
    ? product.specifications
    : {};

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 sm:pt-32">
      {/* Track this product page view */}
      <PageViewTracker 
        pageType="DYNAMIC"
        resourceType="product"
        resourceId={product.id}
        resourceSlug={product.slug}
        pageName={product.name}
      />
      
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link href="/products">
          <Button
            variant="ghost"
            className="text-[#2d7a3e] hover:text-[#1d5a2e] hover:bg-[#2d7a3e]/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </motion.div>

      {/* Product Main Section */}
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Left - Images */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Image */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-4">
            <motion.div
              key={selectedImage}
              className="relative w-full h-96"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((image: string, index: number) => (
              <motion.button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === index 
                    ? 'border-[#2d7a3e] shadow-lg' 
                    : 'border-gray-200 hover:border-[#2d7a3e]/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative w-full h-24">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 16vw"
                  />
                </div>
              </motion.button>
            ))}
            </div>
          )}
        </motion.div>

        {/* Right - Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Category Badge */}
            {product.category?.name && (
              <Badge className="bg-[#2d7a3e]/10 text-[#2d7a3e] mb-4">
                {product.category.name}
              </Badge>
            )}

            {/* Product Name */}
            <h1 className="text-4xl text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Botanical Name */}
            {product.botanicalName && (
              <p className="text-lg text-gray-500 italic mb-6">
                {product.botanicalName}
              </p>
            )}

            <PharaohBorder className="w-32 text-[#c4a24c] opacity-30 mb-6" />

            {/* Description */}
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-[#2d7a3e] mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Season</span>
                </div>
                <p className="text-sm text-gray-700">{product.season}</p>
              </div>

              {product.harvestSeason && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#c4a24c] mb-2">
                    <Sprout className="w-5 h-5" />
                    <span className="text-sm">Harvest</span>
                  </div>
                  <p className="text-sm text-gray-700">{product.harvestSeason}</p>
                </div>
              )}

              {product.packing && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Package className="w-5 h-5" />
                    <span className="text-sm">Packing</span>
                  </div>
                  <p className="text-sm text-gray-700">{product.packing}</p>
                </div>
              )}

              {product.weight && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <Package className="w-5 h-5" />
                    <span className="text-sm">Weight</span>
                  </div>
                  <p className="text-sm text-gray-700">{product.weight}</p>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link href="/contact">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-[#2d7a3e] to-[#1d5a2e] hover:from-[#235a2f] hover:to-[#163f20] text-white shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5 mr-2" />
                Request Quote
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Available Forms Section */}
      {product.availableForms && product.availableForms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <h2 className="text-2xl text-gray-900 mb-6">Available Forms</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {product.availableForms.map((form: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-[#2d7a3e]/10"
              >
                <Check className="w-5 h-5 text-[#2d7a3e] flex-shrink-0" />
                <span className="text-sm text-gray-700">{form}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Specifications & Features */}
      {(Object.keys(specifications).length > 0 || (product.features && product.features.length > 0)) && (
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Specifications */}
          {Object.keys(specifications).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl text-gray-900 mb-6">Specifications</h2>
              <div className="space-y-4">
                {Object.entries(specifications).map(([key, value], index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                  >
                    <dt className="text-sm text-gray-500">{key}</dt>
                    <dd className="text-sm text-gray-900 font-medium">{value}</dd>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl text-gray-900 mb-6">Key Features</h2>
              <div className="space-y-3">
                {product.features.map((feature: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg"
                  >
                    <Leaf className="w-5 h-5 text-[#c4a24c] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center bg-gradient-to-r from-[#2d7a3e] to-[#1d5a2e] rounded-2xl p-12 shadow-xl"
      >
        <Package className="w-16 h-16 text-[#c4a24c] mx-auto mb-4" />
        <h3 className="text-3xl text-white mb-3">
          Interested in This Product?
        </h3>
        <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
          We don&apos;t display prices online. Contact our export team for detailed specifications, bulk pricing, custom packaging options, and shipping quotations tailored to your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-white text-[#2d7a3e] hover:bg-gray-100 px-8"
            >
              <Mail className="w-5 h-5 mr-2" />
              Request Quote
            </Button>
          </Link>
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/10 hover:bg-white/20 hover:text-white px-8"
            >
              View More Products
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
