import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      {/* <Header /> */}
      
      <div className="container mx-auto px-4 py-12 pt-28 sm:pt-32">
        <div className="text-center max-w-lg mx-auto">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The product you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-[#2d7a3e] hover:bg-[#235a2f] text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse All Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-[#2d7a3e] text-[#2d7a3e]">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* <Footer /> */}
    </div>
  );
}
