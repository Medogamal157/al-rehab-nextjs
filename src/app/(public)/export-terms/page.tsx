import type { Metadata } from 'next';
import { PharaohBorder } from '@/components/sections/EgyptianDecor';

export const metadata: Metadata = {
  title: 'Export Terms & Conditions - Al-REHAB GROUP | Egyptian Herbs & Spices',
  description: 'Export terms and conditions for Al-REHAB GROUP. Learn about our international trade policies, shipping, and documentation.',
};

export default function ExportTermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Export Terms & Conditions
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Export Quotations</h2>
              <p className="text-gray-600 mb-4">
                All quotations provided by Al-Rehab Group for Export are subject to the following:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Quotations are valid for 15 days unless otherwise specified</li>
                <li>Prices are quoted in USD unless otherwise agreed</li>
                <li>Quotations are subject to product availability at time of order confirmation</li>
                <li>Prices may be adjusted based on market conditions and currency fluctuations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Minimum Order Quantities</h2>
              <p className="text-gray-600">
                Minimum order quantities (MOQ) vary by product and are designed to ensure efficient 
                shipping and handling:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                <li><strong>Dried Herbs:</strong> Minimum 500 kg per variety</li>
                <li><strong>Spices:</strong> Minimum 500 kg per variety</li>
                <li><strong>Seeds:</strong> Minimum 1,000 kg per variety</li>
                <li><strong>Mixed orders:</strong> Minimum container load (FCL or LCL options available)</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Samples can be arranged for quality evaluation prior to placing bulk orders.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Incoterms & Shipping</h2>
              <p className="text-gray-600 mb-4">
                We offer flexible shipping terms based on Incoterms 2020:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 mt-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-gray-600">
                    <tr>
                      <td className="px-4 py-3 font-medium">EXW</td>
                      <td className="px-4 py-3">Ex Works - Buyer arranges all transportation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">FOB</td>
                      <td className="px-4 py-3">Free On Board - Alexandria/Port Said ports</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">CFR</td>
                      <td className="px-4 py-3">Cost and Freight - Includes shipping to destination port</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">CIF</td>
                      <td className="px-4 py-3">Cost, Insurance, and Freight - Full door-to-port service</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-600 mb-4">
                We accept the following payment methods for international transactions:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Letter of Credit (L/C):</strong> Irrevocable L/C at sight, confirmed by a first-class international bank</li>
                <li><strong>Telegraphic Transfer (T/T):</strong> 30% advance, 70% against copy of Bill of Lading</li>
                <li><strong>Documentary Collection:</strong> D/P (Documents against Payment) for established clients</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Payment terms may be negotiated based on order volume and established business relationships.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Quality Specifications</h2>
              <p className="text-gray-600 mb-4">
                All products meet international quality standards:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Moisture content as per international standards</li>
                <li>Free from foreign matter and adulterants</li>
                <li>Compliant with destination country import regulations</li>
                <li>Samples available for pre-shipment approval</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Custom specifications can be accommodated upon request. Third-party inspection 
                (SGS, Bureau Veritas, etc.) available at buyer&apos;s cost.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Packaging Options</h2>
              <p className="text-gray-600 mb-4">
                Standard packaging options include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>PP woven bags (25 kg, 50 kg)</li>
                <li>Paper bags with PE liner</li>
                <li>Jute bags (traditional/organic)</li>
                <li>Vacuum-sealed packaging</li>
                <li>Custom packaging available upon request</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Private labeling services available for bulk orders.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Documentation</h2>
              <p className="text-gray-600 mb-4">
                Standard export documentation includes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Commercial Invoice</li>
                <li>Packing List</li>
                <li>Certificate of Origin</li>
                <li>Phytosanitary Certificate</li>
                <li>Health Certificate</li>
                <li>Bill of Lading / Airway Bill</li>
                <li>Quality/Analysis Certificate</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Additional documentation (fumigation certificate, organic certification, etc.) 
                available as required by destination country.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Lead Time</h2>
              <p className="text-gray-600 mb-4">
                Typical production and shipping lead times:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Production:</strong> 7-14 days from order confirmation</li>
                <li><strong>Documentation:</strong> 3-5 business days</li>
                <li><strong>Shipping (Sea):</strong> Varies by destination (15-45 days)</li>
                <li><strong>Shipping (Air):</strong> 3-7 days to most destinations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Claims & Returns</h2>
              <p className="text-gray-600">
                Quality claims must be submitted within 14 days of receipt of goods, accompanied by:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                <li>Detailed description of the issue</li>
                <li>Photographic evidence</li>
                <li>Third-party inspection report if applicable</li>
                <li>Original documentation</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Legitimate claims will be resolved through replacement, credit, or refund as 
                mutually agreed.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Force Majeure</h2>
              <p className="text-gray-600">
                Neither party shall be liable for delays or failures in performance resulting from 
                circumstances beyond reasonable control, including but not limited to natural disasters, 
                war, government actions, or other force majeure events.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Dispute Resolution</h2>
              <p className="text-gray-600">
                Any disputes arising from export transactions shall be resolved through:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                <li>Good faith negotiation between parties</li>
                <li>Mediation if negotiation fails</li>
                <li>Arbitration under ICC rules as final resolution</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact for Export Inquiries</h2>
              <p className="text-gray-600">
                For export quotations and inquiries, please contact:
              </p>
              <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-amber-50 rounded-lg border border-green-100">
                <p className="text-gray-700 font-semibold text-lg">Al-Rehab Group for Export</p>
                <p className="text-gray-600 mt-2">
                  <strong>Export Department:</strong> export@al-rehabgroup.com
                </p>
                <p className="text-gray-600">
                  <strong>Sales:</strong> export@al-rehabgroup.com
                </p>
                <p className="text-gray-600">
                  <strong>General:</strong> info@al-rehabgroup.com
                </p>
                <p className="text-gray-600">
                  <strong>Phone/WhatsApp:</strong> +201055558189
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong> Faiyum, Egypt
                </p>
              </div>
              <p className="text-gray-600 mt-4">
                Our export team is available Monday-Friday, 9:00 AM - 6:00 PM (Egypt Time) 
                and Saturday, 10:00 AM - 3:00 PM.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
