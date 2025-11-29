# HR Management System

A modern, full-featured HR Management System built with Next.js 14, PostgreSQL, and Drizzle ORM. Manage applicants, clients, contacts, missions, callbacks, and more with a clean, responsive interface.

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [PostgreSQL 16](https://www.postgresql.org/) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Containerization** | [Docker](https://www.docker.com/) & Docker Compose |

## Features

### Core Modules
- **Applicants Management** - Track job applicants with CV uploads, contact info, and status
- **Clients Management** - Manage client companies with contact details and related missions
- **Contacts Management** - Store and organize business contacts linked to clients
- **Missions Management** - Create and manage missions/projects with applicant assignments
- **Callbacks Management** - Track callbacks with scheduling and status updates
- **Global Search** - Search across all entities from a single interface

### Key Features
- **Authentication** - Secure login with NextAuth.js
- **Notes System** - Add multiple notes to any entity (polymorphic notes)
- **File Uploads** - Upload CVs and extra documents for applicants
- **Responsive Design** - Works on desktop and mobile devices
- **Docker Support** - Easy deployment with Docker Compose

---

## Local Development

### Prerequisites
- Node.js 20+ 
- Docker and Docker Compose (for PostgreSQL)
- npm or yarn

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hr-management
   ```

2. **Start the services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - App: http://localhost:3000
   - Default login: `admin` / `admin123`

### Option 2: Local Development with Hot Reload

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hr-management
   ```

2. **Start PostgreSQL only**
   ```bash
   docker-compose up -d db
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   DATABASE_URL=postgresql://hruser:hrpassword@localhost:5432/hrdb
   NEXTAUTH_SECRET=your-secret-key-change-in-production
   NEXTAUTH_URL=http://localhost:3000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

5. **Push database schema and seed data**
   ```bash
   npm run db:push
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - App: http://localhost:3000
   - Default login: `admin` / `admin123`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with admin user |
| `npm run db:studio` | Open Drizzle Studio (DB GUI) |

---

## Deploying to a VPS (DigitalOcean)

This guide walks you through deploying the HR Management System to a DigitalOcean Droplet (or any VPS).

### Step 1: Create a Droplet

1. Log in to [DigitalOcean](https://www.digitalocean.com/)
2. Click **Create** > **Droplets**
3. Choose an image: **Ubuntu 24.04 LTS**
4. Choose a plan: **Basic** > **Regular** > **$6/mo** (1GB RAM, 1 CPU) minimum
   - Recommended: **$12/mo** (2GB RAM) for better performance
5. Choose a datacenter region close to your users
6. Authentication: **SSH keys** (recommended) or Password
7. Click **Create Droplet**

### Step 2: Initial Server Setup

SSH into your server:
```bash
ssh root@your_server_ip
```

Update the system and install Docker:
```bash
# Update packages
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

Create a non-root user (optional but recommended):
```bash
adduser hrapp
usermod -aG docker hrapp
usermod -aG sudo hrapp
su - hrapp
```

### Step 3: Deploy the Application

1. **Clone your repository**
   ```bash
   cd ~
   git clone <your-repo-url> hr-management
   cd hr-management
   ```

2. **Create production docker-compose file**
   ```bash
   nano docker-compose.prod.yml
   ```

   ```yaml
   version: '3.8'

   services:
     db:
       image: postgres:16-alpine
       container_name: hr-postgres
       restart: always
       environment:
         POSTGRES_USER: hruser
         POSTGRES_PASSWORD: ${DB_PASSWORD}
         POSTGRES_DB: hrdb
       volumes:
         - postgres_data:/var/lib/postgresql/data
       healthcheck:
         test: ["CMD-SHELL", "pg_isready -U hruser -d hrdb"]
         interval: 5s
         timeout: 5s
         retries: 5

     app:
       build:
         context: .
         dockerfile: Dockerfile
       container_name: hr-nextjs
       restart: always
       environment:
         DATABASE_URL: postgresql://hruser:${DB_PASSWORD}@db:5432/hrdb
         NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
         NEXTAUTH_URL: ${NEXTAUTH_URL}
         ADMIN_USERNAME: ${ADMIN_USERNAME}
         ADMIN_PASSWORD: ${ADMIN_PASSWORD}
       ports:
         - "3000:3000"
       volumes:
         - uploads_data:/app/public/uploads
       depends_on:
         db:
           condition: service_healthy

   volumes:
     postgres_data:
     uploads_data:
   ```

3. **Create environment file**
   ```bash
   nano .env.prod
   ```

   ```env
   DB_PASSWORD=your_strong_database_password_here
   NEXTAUTH_SECRET=your_very_long_random_secret_key_here
   NEXTAUTH_URL=https://yourdomain.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_strong_admin_password_here
   ```

   Generate a secure NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

4. **Build and start the application**
   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
   ```

5. **Verify it's running**
   ```bash
   docker compose -f docker-compose.prod.yml ps
   docker compose -f docker-compose.prod.yml logs -f app
   ```

6. **Test the application**
   ```bash
   curl http://localhost:3000
   ```

### Step 4: Set Up Nginx Reverse Proxy

Install Nginx:
```bash
sudo apt install nginx -y
```

Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/hr-management
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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
        
        # Increase timeouts for file uploads
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Increase max body size for file uploads
        client_max_body_size 10M;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/hr-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Set Up SSL with Let's Encrypt

Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

Obtain SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
- Enter your email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

Certbot will automatically:
- Obtain the certificate
- Configure Nginx for HTTPS
- Set up auto-renewal

Verify auto-renewal is set up:
```bash
sudo certbot renew --dry-run
```

---

## Pointing a Domain or Subdomain

### Using a Domain (e.g., hrapp.com)

1. **Get your server's IP address**
   ```bash
   curl ifconfig.me
   ```

2. **Configure DNS records** in your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | A | @ | your_server_ip | 3600 |
   | A | www | your_server_ip | 3600 |

3. **Wait for DNS propagation** (can take up to 48 hours, usually faster)

4. **Verify DNS**
   ```bash
   dig yourdomain.com +short
   ```

### Using a Subdomain (e.g., hr.yourcompany.com)

1. **Configure DNS record** in your domain registrar:

   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | A | hr | your_server_ip | 3600 |

2. **Update Nginx configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/hr-management
   ```
   
   Change `server_name` to:
   ```nginx
   server_name hr.yourcompany.com;
   ```

3. **Update environment file**
   ```bash
   nano .env.prod
   ```
   
   Update NEXTAUTH_URL:
   ```env
   NEXTAUTH_URL=https://hr.yourcompany.com
   ```

4. **Restart services**
   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
   sudo systemctl restart nginx
   ```

5. **Get SSL certificate**
   ```bash
   sudo certbot --nginx -d hr.yourcompany.com
   ```

---

## Maintenance

### View Logs
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Just the app
docker compose -f docker-compose.prod.yml logs -f app

# Just the database
docker compose -f docker-compose.prod.yml logs -f db
```

### Update the Application
```bash
cd ~/hr-management
git pull origin main
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### Backup Database
```bash
docker exec hr-postgres pg_dump -U hruser hrdb > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
cat backup_file.sql | docker exec -i hr-postgres psql -U hruser hrdb
```

### Restart Services
```bash
docker compose -f docker-compose.prod.yml restart
```

### Stop Services
```bash
docker compose -f docker-compose.prod.yml down
```

---

## Security Recommendations

1. **Change default credentials** - Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in production
2. **Use strong passwords** - Generate secure passwords for database and admin
3. **Enable firewall**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```
4. **Keep system updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
5. **Set up automatic security updates**
   ```bash
   sudo apt install unattended-upgrades -y
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

---

## Troubleshooting

### Application not starting
```bash
docker compose -f docker-compose.prod.yml logs app
```

### Database connection issues
```bash
docker compose -f docker-compose.prod.yml logs db
docker exec -it hr-postgres psql -U hruser -d hrdb
```

### Port already in use
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### SSL certificate issues
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
```

---

## License

MIT License - feel free to use this project for your own purposes.
