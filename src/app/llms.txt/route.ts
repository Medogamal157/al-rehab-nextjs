import { prisma } from '@/lib/prisma';

// Regenerate at most once per hour; AI crawlers read this first.
export const revalidate = 3600;

/**
 * /llms.txt — a concise, machine-readable Markdown summary of the business.
 * This is the emerging convention that LLM-based search engines (ChatGPT,
 * Perplexity, Gemini, etc.) look for to understand a site quickly.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://al-rehabgroup.com';

  const [categories, products, certificates, contact] = await Promise.all([
    prisma.category
      .findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        select: { name: true, slug: true, description: true },
      })
      .catch(() => []),
    prisma.product
      .findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        select: { name: true, slug: true, englishName: true, botanicalName: true },
      })
      .catch(() => []),
    prisma.certificate
      .findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        select: { name: true, slug: true, fullName: true },
      })
      .catch(() => []),
    prisma.contactInfo.findUnique({ where: { key: 'main' } }).catch(() => null),
  ]);

  const lines: string[] = [];

  lines.push('# Al-Rehab Group for Export');
  lines.push('');
  lines.push(
    '> Leading Egyptian exporter of premium herbs, spices, and agricultural products. ' +
      'Wholesale B2B supplier shipping worldwide from Faiyum, Egypt, with EU Organic, ' +
      'USDA Organic, FSSC 22000, HACCP, ISO, Halal, and Kosher certifications.'
  );
  lines.push('');
  lines.push(
    'Al-Rehab Group cultivates, processes, and exports dried herbs, organic spices, ' +
      'and aromatic seeds to importers, food manufacturers, and distributors across ' +
      'Europe, North America, the Middle East, and Asia. Every shipment is fully ' +
      'traceable and produced under internationally recognized food-safety standards.'
  );
  lines.push('');

  lines.push('## Key Pages');
  lines.push(`- [Home](${baseUrl}/): Company overview and capabilities`);
  lines.push(`- [Products](${baseUrl}/products): Full catalog of herbs, spices, and seeds`);
  lines.push(`- [Certificates](${baseUrl}/certificates): Quality and food-safety certifications`);
  lines.push(`- [Quality Control](${baseUrl}/quality-control): Testing and quality assurance process`);
  lines.push(`- [Farms](${baseUrl}/farms): Sourcing and cultivation`);
  lines.push(`- [Shipments](${baseUrl}/shipments): Export and logistics`);
  lines.push(`- [About](${baseUrl}/about): Company background`);
  lines.push(`- [Contact](${baseUrl}/contact): Get a quote or start an export request`);
  lines.push('');

  if (categories.length > 0) {
    lines.push('## Product Categories');
    for (const c of categories) {
      const desc = c.description ? `: ${c.description}` : '';
      lines.push(`- [${c.name}](${baseUrl}/products?category=${c.slug})${desc}`);
    }
    lines.push('');
  }

  if (products.length > 0) {
    lines.push('## Products');
    for (const p of products) {
      const extra = [p.englishName, p.botanicalName].filter(Boolean).join(', ');
      const suffix = extra ? ` (${extra})` : '';
      lines.push(`- [${p.name}${suffix}](${baseUrl}/products/${p.slug})`);
    }
    lines.push('');
  }

  if (certificates.length > 0) {
    lines.push('## Certifications');
    for (const cert of certificates) {
      lines.push(`- ${cert.fullName || cert.name}`);
    }
    lines.push('');
  }

  lines.push('## Contact');
  lines.push(`- Company: ${contact?.companyName || 'Al-Rehab Group for Export'}`);
  lines.push(`- Location: ${contact?.city || 'Faiyum'}, ${contact?.country || 'Egypt'}`);
  if (contact?.email) lines.push(`- Email: ${contact.email}`);
  if (contact?.emailSales) lines.push(`- Sales/Export: ${contact.emailSales}`);
  if (contact?.phone) lines.push(`- Phone: ${contact.phone}`);
  if (contact?.whatsapp) lines.push(`- WhatsApp: ${contact.whatsapp}`);
  lines.push(`- Website: ${baseUrl}`);
  lines.push('');

  const body = lines.join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
