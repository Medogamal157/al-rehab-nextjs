import type { Metadata } from 'next';
import { PharaohBorder } from '@/components/sections/EgyptianDecor';

export const metadata: Metadata = {
  title: 'Terms of Service - Al-Rehab Group for Export | Egyptian Herbs & Spices Export',
  description: 'Terms of Service for Al-Rehab Group for Export. Read our terms and conditions for using our website and services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Last updated: December 2025
            </p>
            <PharaohBorder className="w-48 mx-auto text-[#c4a24c] opacity-30" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg prose-green">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing or using the Al-Rehab Group for Export website and services, you agree to be 
                bound by these Terms of Service. If you do not agree to these terms, please do not use our 
                website or services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
              <p className="text-gray-600">
                Al-Rehab Group for Export provides premium Egyptian herbs, spices, and aromatic seeds for 
                international export. Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                <li>Export of dried herbs, spices, and seeds</li>
                <li>Custom packaging and labeling services</li>
                <li>Quality assurance and certification documentation</li>
                <li>International shipping coordination</li>
                <li>Business-to-business trade facilitation</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Business Accounts</h2>
              <p className="text-gray-600">
                Our services are primarily intended for business clients engaged in wholesale and retail 
                distribution. By submitting an export request, you represent that:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                <li>You are authorized to conduct business on behalf of your company</li>
                <li>All information provided is accurate and complete</li>
                <li>You have the legal capacity to enter into binding agreements</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Product Information</h2>
              <p className="text-gray-600">
                We strive to provide accurate product descriptions, specifications, and images. However:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                <li>Natural products may vary slightly in appearance, color, and characteristics</li>
                <li>Specifications are subject to seasonal variations</li>
                <li>Prices and availability are subject to change without notice</li>
                <li>Final product specifications will be confirmed in formal quotations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Orders and Payments</h2>
              <p className="text-gray-600 mb-4">
                All orders are subject to acceptance and confirmation. Payment terms will be specified in 
                individual contracts and may include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Letter of Credit (L/C)</li>
                <li>Advance payment or deposit</li>
                <li>Other terms as agreed upon</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Minimum order quantities may apply depending on the product and destination.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Shipping and Delivery</h2>
              <p className="text-gray-600">
                Shipping terms (Incoterms) will be specified in individual quotations and contracts. 
                We typically offer FOB, CIF, and other standard international trade terms. Risk of loss 
                transfers according to the agreed Incoterms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Quality and Certifications</h2>
              <p className="text-gray-600">
                Our products comply with international food safety standards. We maintain various 
                certifications and can provide documentation including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                <li>Certificate of Origin</li>
                <li>Phytosanitary Certificate</li>
                <li>Quality analysis certificates</li>
                <li>Other documentation as required by destination country</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-600">
                All content on this website, including text, images, logos, and graphics, is the property 
                of Al-Rehab Group for Export and is protected by intellectual property laws. You may not 
                reproduce, distribute, or use our content without written permission.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600">
                To the fullest extent permitted by law, Al-Rehab Group for Export shall not be liable for 
                any indirect, incidental, special, consequential, or punitive damages arising from your 
                use of our website or services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-600">
                These Terms of Service shall be governed by and construed in accordance with the laws of 
                the Arab Republic of Egypt. Any disputes arising from these terms shall be subject to the 
                exclusive jurisdiction of the Egyptian courts.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 font-semibold">Al-Rehab Group for Export</p>
                <p className="text-gray-600">Email: info@al-rehabgroup.com</p>
                <p className="text-gray-600">Phone: +201055558189</p>
                <p className="text-gray-600">Location: Faiyum, Egypt</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these Terms of Service at any time. Changes will be 
                effective immediately upon posting to this website. Your continued use of our services 
                constitutes acceptance of the modified terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
