import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Create PostgreSQL connection pool with extended timeout
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ 
  connectionString,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  ssl: false, // Adjust based on your server config
});
const adapter = new PrismaPg(pool, { schema: 'alrehab' });

// Initialize Prisma with adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // // Create initial admin user
  // const hashedPassword = await bcrypt.hash('Admin@2024!Secure', 12);
  
  // const adminUser = await prisma.user.upsert({
  //   where: { email: 'admin@alrehabgroup.com' },
  //   update: {},
  //   create: {
  //     email: 'admin@alrehabgroup.com',
  //     password: hashedPassword,
  //     name: 'Admin',
  //     role: UserRole.SUPER_ADMIN,
  //     isActive: true,
  //   },
  // });
  // console.log(`✅ Created admin user: ${adminUser.email}`);

  // Create default contact info
  const contactInfo = await prisma.contactInfo.upsert({
    where: { key: 'main' },
    update: {
      companyName: 'Al-Rehab Group for Export',
      address: 'Faiyum',
      city: 'Faiyum',
      country: 'Egypt',
      phone: '+201055558189',
      phoneAlt: '+20 987 654 321',
      email: 'info@al-rehabgroup.com',
      emailSales: 'export@al-rehabgroup.com',
      website: 'https://al-rehabgroup.com',
      whatsapp: '+201055558189',
      customerServiceNote: 'Available 24/7',
      workingHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '10:00', close: '15:00', closed: false },
        sunday: { open: '', close: '', closed: true },
      },
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110315.87693054387!2d30.74437!3d29.30869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14585a8329fc92c5%3A0x4d0f2f8c8e965f2e!2sFaiyum%2C%20Egypt!5e0!3m2!1sen!2s!4v1234567890',
      isActive: true,
    },
    create: {
      key: 'main',
      companyName: 'Al-Rehab Group for Export',
      address: 'Faiyum',
      city: 'Faiyum',
      country: 'Egypt',
      phone: '+201055558189',
      phoneAlt: '+20 987 654 321',
      email: 'info@al-rehabgroup.com',
      emailSales: 'export@al-rehabgroup.com',
      website: 'https://herbsegypt.com',
      whatsapp: '+201055558189',
      customerServiceNote: 'Available 24/7',
      workingHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '10:00', close: '15:00', closed: false },
        sunday: { open: '', close: '', closed: true },
      },
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110315.87693054387!2d30.74437!3d29.30869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14585a8329fc92c5%3A0x4d0f2f8c8e965f2e!2sFaiyum%2C%20Egypt!5e0!3m2!1sen!2s!4v1234567890',
      isActive: true,
    },
  });
  console.log(`✅ Created contact info: ${contactInfo.key}`);

  // // Create certificates
  // const certificates = [
  //   {
  //     name: 'EU Organic',
  //     fullName: 'European Union Organic Certification',
  //     slug: 'eu-organic',
  //     description: "Our products are certified under the EU Organic Regulation, ensuring they are grown and processed in accordance with strict European organic standards. This certification guarantees that our herbs and spices are produced without synthetic pesticides, chemical fertilizers, or GMOs, and that every step—from farming to processing—is carefully controlled and fully traceable.\n\nBy meeting these rigorous requirements, we provide our partners with clean, safe, and authentically organic products that meet the European Union's highest quality standards.",
  //     image: '/cert/WhatsApp Image 2025-11-15 at 23.38.56_2a321686.jpg',
  //     issuer: 'European Union',
  //     isFeatured: true,
  //     displayOrder: 1,
  //   },
  //   {
  //     name: 'USDA Organic',
  //     fullName: 'United States Department of Agriculture Organic',
  //     slug: 'usda-organic',
  //     description: 'This certification confirms that our products are cultivated and processed in full compliance with the rigorous organic farming standards of the U.S. Department of Agriculture. It ensures that our herbs and spices are produced without synthetic chemicals, artificial pesticides, or GMOs, delivering naturally pure, safe, and environmentally responsible products to global markets.',
  //     image: '/cert/WhatsApp Image 2025-11-15 at 23.39.09_6aad7abc.jpg',
  //     issuer: 'United States Department of Agriculture',
  //     isFeatured: true,
  //     displayOrder: 2,
  //   },
  //   {
  //     name: 'FSSC 22000',
  //     fullName: 'Food Safety System Certification 22000',
  //     slug: 'fssc-22000',
  //     description: 'A globally recognized food safety certification that demonstrates our commitment to producing safe, high-quality products. FSSC 22000 ensures full control over every step of the production process, from raw materials to final shipping, meeting the requirements of international markets.',
  //     image: '/cert/WhatsApp Image 2025-11-15 at 23.39.25_a97d4320.jpg',
  //     issuer: 'Foundation FSSC',
  //     isFeatured: true,
  //     displayOrder: 3,
  //   },
  //   {
  //     name: 'HACCP',
  //     fullName: 'Hazard Analysis and Critical Control Points',
  //     slug: 'haccp',
  //     description: 'HACCP (Hazard Analysis and Critical Control Points) is a systematic preventive approach to food safety. Our HACCP certification ensures that we identify, evaluate, and control food safety hazards throughout our production process, from receiving raw materials to final product distribution.',
  //     issuer: 'Food Safety Authority',
  //     isFeatured: true,
  //     displayOrder: 4,
  //   },
  //   {
  //     name: 'FDA Registered',
  //     fullName: 'U.S. Food and Drug Administration Registration',
  //     slug: 'fda-registered',
  //     description: "Being FDA registered confirms that our facilities comply with the U.S. Food and Drug Administration's safety and hygiene requirements. This provides confidence to importers that our products meet U.S. regulatory standards for food quality.",
  //     issuer: 'U.S. Food and Drug Administration',
  //     isFeatured: false,
  //     displayOrder: 5,
  //   },
  //   {
  //     name: 'ISO 9001',
  //     fullName: 'Quality Management System Standard',
  //     slug: 'iso-9001',
  //     description: 'An international standard for quality management systems. ISO 9001 ensures that our operations are well-structured, consistent, and continuously improving — providing customers with reliable products and a professional service experience.',
  //     issuer: 'International Organization for Standardization',
  //     isFeatured: false,
  //     displayOrder: 6,
  //   },
  //   {
  //     name: 'ISO 22000',
  //     fullName: 'Food Safety Management System',
  //     slug: 'iso-22000',
  //     description: 'A leading standard for food safety management. ISO 22000 ensures that our herbs and spices are produced, processed, and handled under the highest food safety conditions, reducing risks and ensuring safe consumption worldwide.',
  //     issuer: 'International Organization for Standardization',
  //     isFeatured: false,
  //     displayOrder: 7,
  //   },
  //   {
  //     name: 'Kosher',
  //     fullName: 'Kosher Certification',
  //     slug: 'kosher',
  //     description: 'Kosher certification verifies that our products meet Jewish dietary laws and strict purity standards. It assures customers that our herbs and spices are produced with full cleanliness, separation, and strict quality control.',
  //     issuer: 'Orthodox Union',
  //     isFeatured: false,
  //     displayOrder: 8,
  //   },
  //   {
  //     name: 'HALAL',
  //     fullName: 'Halal Certification',
  //     slug: 'halal',
  //     description: 'Halal certification ensures that our products comply with Islamic dietary rules. It guarantees that all ingredients, processing steps, and handling methods meet Halal requirements — making our products suitable for global Muslim markets.',
  //     issuer: 'Islamic Services of America',
  //     isFeatured: false,
  //     displayOrder: 9,
  //   },
  // ];

  // for (const cert of certificates) {
  //   await prisma.certificate.upsert({
  //     where: { slug: cert.slug },
  //     update: cert,
  //     create: cert,
  //   });
  //   console.log(`✅ Created certificate: ${cert.name}`);
  // }

  // // Create sample categories
  // const categories = [
  //   {
  //     name: 'Fresh Fruits',
  //     slug: 'fresh-fruits',
  //     description: 'Premium quality fresh fruits directly from Egyptian farms',
  //     icon: 'Apple',
  //     color: 'red-500',
  //     displayOrder: 1,
  //   },
  //   {
  //     name: 'Fresh Vegetables',
  //     slug: 'fresh-vegetables',
  //     description: 'Farm-fresh vegetables harvested at peak ripeness',
  //     icon: 'Carrot',
  //     color: 'green-500',
  //     displayOrder: 2,
  //   },
  //   {
  //     name: 'Herbs & Spices',
  //     slug: 'herbs-spices',
  //     description: 'Aromatic herbs and premium spices from Egypt',
  //     icon: 'Leaf',
  //     color: 'emerald-500',
  //     displayOrder: 3,
  //   },
  //   {
  //     name: 'Grains & Legumes',
  //     slug: 'grains-legumes',
  //     description: 'High-quality grains and legumes for global markets',
  //     icon: 'Wheat',
  //     color: 'amber-500',
  //     displayOrder: 4,
  //   },
  // ];

  // for (const category of categories) {
  //   await prisma.category.upsert({
  //     where: { slug: category.slug },
  //     update: {},
  //     create: category,
  //   });
  //   console.log(`✅ Created category: ${category.name}`);
  // }

  // Create site settings
  const settings = [
    { key: 'site_name', value: 'Al-Rehab Group for Export', type: 'string', group: 'general' },
    { key: 'site_name_ar', value: 'مجموعة الرحاب للتصدير', type: 'string', group: 'general' },
    { key: 'site_description', value: 'Premium Egyptian Agricultural Exports', type: 'string', group: 'seo' },
    { key: 'meta_keywords', value: 'egypt, export, agriculture, fruits, vegetables, herbs', type: 'string', group: 'seo' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
    console.log(`✅ Created setting: ${setting.key}`);
  }

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📝 Admin Login Credentials:');
  console.log('   Email: admin@alrehabgroup.com');
  console.log('   Password: Admin@2024!Secure');
  console.log('\n⚠️  Please change the password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
