#!/bin/bash

# Al-Rehab Group - Server Deployment Script
# Run this script on the server to deploy or update the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Al-Rehab Group Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Configuration
APP_DIR="/var/www/al-rehab-nextjs"
APP_NAME="al-rehab"

# Check if this is a fresh install or update
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Updating existing installation...${NC}"
    cd $APP_DIR
    
    # Pull latest changes
    echo -e "${GREEN}Pulling latest changes...${NC}"
    git pull origin main
    
    # Install dependencies
    echo -e "${GREEN}Installing dependencies...${NC}"
    npm ci --production=false
    
    # Generate Prisma client
    echo -e "${GREEN}Generating Prisma client...${NC}"
    npx prisma generate
    
    # Build application
    echo -e "${GREEN}Building application...${NC}"
    npm run build
    
    # Restart PM2
    echo -e "${GREEN}Restarting application...${NC}"
    pm2 restart $APP_NAME
    
else
    echo -e "${YELLOW}Fresh installation...${NC}"
    
    # Create directory
    sudo mkdir -p /var/www
    cd /var/www
    
    # Clone repository
    echo -e "${GREEN}Cloning repository...${NC}"
    git clone https://github.com/YOUR_USERNAME/al-rehab-nextjs.git
    cd al-rehab-nextjs
    
    # Check for .env file
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}Creating .env file from template...${NC}"
        cp .env.production .env
        echo -e "${RED}IMPORTANT: Edit .env file with your production values!${NC}"
        echo -e "${RED}Run: nano .env${NC}"
        exit 1
    fi
    
    # Install dependencies
    echo -e "${GREEN}Installing dependencies...${NC}"
    npm ci --production=false
    
    # Generate Prisma client
    echo -e "${GREEN}Generating Prisma client...${NC}"
    npx prisma generate
    
    # Push database schema
    echo -e "${GREEN}Pushing database schema...${NC}"
    npx prisma db push
    
    # Seed database (optional)
    read -p "Do you want to seed the database? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}Seeding database...${NC}"
        npm run db:seed
    fi
    
    # Build application
    echo -e "${GREEN}Building application...${NC}"
    npm run build
    
    # Start with PM2
    echo -e "${GREEN}Starting application with PM2...${NC}"
    pm2 start npm --name "$APP_NAME" -- start
    pm2 save
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "1. Configure Nginx (see README.md)"
    echo -e "2. Setup SSL certificate"
    echo -e "3. Run: pm2 startup"
fi

echo -e "${GREEN}Done!${NC}"
