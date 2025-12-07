# Al-Rehab Group - Export Company Website

A modern, full-stack website for Al-Rehab Group, an Egyptian agricultural export company specializing in herbs, spices, and agricultural products.

## 🌟 Features

- **Public Website**: Product catalog, company information, certificates, quality control
- **Admin Dashboard**: Product management, analytics, export requests, certificates
- **Real-time Analytics**: Page views, geo-location tracking, device statistics
- **Responsive Design**: Mobile-first design with Egyptian-themed aesthetics
- **Multi-language Ready**: RTL support for Arabic

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + Radix UI
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **Testing**: Vitest

## 📁 Project Structure

```
├── prisma/             # Database schema and seed data
├── public/             # Static assets (images, certificates)
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── (admin)/    # Admin dashboard routes
│   │   ├── (public)/   # Public website routes
│   │   └── api/        # API routes
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── types/          # TypeScript type definitions
└── ...config files
```

## 🚀 Deployment Guide

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL database
- PM2 (for process management)
- Nginx (for reverse proxy)

### Server Setup (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Deployment Steps

#### 1. Clone the Repository

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/al-rehab-nextjs.git
cd al-rehab-nextjs
```

#### 2. Configure Environment

```bash
# Copy and edit the production environment file
cp .env.production .env

# Edit with your production values
nano .env
```

**Important**: Update these values in `.env`:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_URL`: Your production domain (e.g., https://alrehabgroup.com)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

#### 3. Install Dependencies & Build

```bash
# Install dependencies
npm ci --production=false

# Generate Prisma client
npx prisma generate

# Push database schema (first time only)
npx prisma db push

# Seed database (optional, first time only)
npm run db:seed

# Build the application
npm run build
```

#### 4. Start with PM2

```bash
# Start the application
pm2 start npm --name "al-rehab" -- start

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 5. Configure Nginx

Create `/etc/nginx/sites-available/al-rehab`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    location /public {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/al-rehab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### PM2 Commands Reference

```bash
pm2 status              # Check status
pm2 logs al-rehab       # View logs
pm2 restart al-rehab    # Restart app
pm2 stop al-rehab       # Stop app
pm2 delete al-rehab     # Remove from PM2
```

### Updating the Application

```bash
cd /var/www/al-rehab-nextjs
git pull origin main
npm ci
npm run build
pm2 restart al-rehab
```

## 🔧 Development

### Local Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/al-rehab-nextjs.git
cd al-rehab-nextjs

# Install dependencies
npm install

# Setup environment
cp .env.production .env
# Edit .env with your local/dev values

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

## 📊 Admin Dashboard

Access the admin dashboard at `/admin`

**Default Admin Credentials** (change after first login):
- Email: admin@alrehabgroup.com
- Password: (set during seed or via database)

### Admin Features

- **Dashboard**: Overview statistics
- **Products**: CRUD operations for products
- **Categories**: Manage product categories
- **Certificates**: Upload and manage certificates
- **Export Requests**: Handle customer inquiries
- **Analytics**: Real-time visitor analytics
- **Contact Info**: Update company contact details

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `NEXTAUTH_SECRET` | Auth encryption secret | ✅ |
| `NODE_ENV` | Environment (development/production) | ✅ |

## 🔒 Security Notes

1. **Never commit `.env`** to version control
2. Use strong passwords for database and admin
3. Keep dependencies updated
4. Enable HTTPS in production
5. Configure firewall rules
6. Regular database backups

## 📄 License

Private - Al-Rehab Group © 2024

## 🤝 Support

For technical support, contact the development team.
