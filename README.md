# Hidden Mandate

An elegant web application for traditional Chinese divination, featuring Meihua Yishu (Plum Blossom Divination) and Xiao Liu Ren divination methods.

## Features

- Meihua Yishu: Time-based hexagram generation following traditional I Ching rules
- Xiao Liu Ren: Traditional six-deity divination based on time calculations
- Rule Engine: All interpretations generated locally, no external API calls
- Admin Dashboard: Statistics and records management
- SEO Optimized: Full sitemap, robots.txt, Open Graph, Schema.org
- Rate Limited: Built-in anti-abuse protection
- Dark Theme: Black and gold oriental aesthetic with smooth animations

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript (Strict Mode)
- Styling: TailwindCSS + Shadcn/UI
- Animation: Framer Motion
- Database: PostgreSQL (Prisma ORM)
- Analytics: Vercel Analytics
- Deployment: Vercel (production)

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or remote)

### Installation

`ash
# Clone the repository
git clone <repo-url>
cd hidden-mandate

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
`

Visit http://localhost:3000

## Database Configuration

### Local PostgreSQL

`env
DATABASE_URL="postgresql://postgres:password@localhost:5432/divination_db"
`

### Supabase

1. Create a project at https://supabase.com
2. Go to Project Settings > Database > Connection string
3. Copy the URI connection string:

`env
DATABASE_URL="postgresql://postgres:password@xxx.supabase.co:5432/postgres"
`

### Neon

1. Create a project at https://neon.tech
2. Copy the connection string from your project dashboard:

`env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
`

## Vercel Deployment

### Step 1: Push to GitHub

`ash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
`

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:

### Step 3: Set Environment Variables

In Vercel project settings, add:

| Variable | Description |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| DIRECT_URL | Direct connection URL (for connection pooling bypass) |
| NEXT_PUBLIC_SITE_URL | Your production URL |
| ADMIN_SECRET | Secret key for admin dashboard |

### Step 4: Deploy

Click "Deploy" - Vercel will automatically:
1. Install dependencies
2. Generate Prisma client
3. Run database migrations
4. Build the Next.js application

### Custom Domain

1. Go to Vercel project > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update NEXT_PUBLIC_SITE_URL to your domain

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| DIRECT_URL | No | - | Direct DB connection (for Neon pooled) |
| NEXT_PUBLIC_SITE_URL | Yes | - | Site URL for SEO |
| ADMIN_SECRET | No | - | Admin dashboard password |
| RATE_LIMIT_MAX | No | 10 | Max requests per window |
| RATE_LIMIT_WINDOW_MS | No | 60000 | Rate limit window (ms) |

## Project Structure

`
app/                    # Next.js 15 App Router pages
  api/                  # REST API routes (divination, admin, history)
  admin/                # Admin dashboard + records management
  divination/           # Divination method selection
  history/              # User history page
  meihua/               # Meihua Yishu (input + result)
  xiaoliuren/           # Xiao Liu Ren (input + result)
  sitemap.ts            # SEO sitemap
  robots.ts             # SEO robots.txt
components/             # UI and layout components
knowledge/              # Knowledge base (hexagrams, deities)
lib/                    # Engine, interpreter, rate limiter, prisma
prisma/                 # Database schema and migrations
`

## API Routes

- POST /api/divination/meihua - Meihua divination
- POST /api/divination/xiaoliuren - Xiao Liu Ren divination
- GET /api/divination/record/[id] - Get divination record
- DELETE /api/divination/record/[id] - Delete record
- GET /api/history - List all history
- GET /api/admin/stats - Dashboard statistics
- GET /api/admin/records - Records management (paginated)
- DELETE /api/admin/records - Delete records (admin)

## Important Notes

- Not random: All divination results use traditional rules based on current time
- No external API calls: All interpretations are local rule-engine generated
- Rate limited: 10 requests per minute per IP
- Disclaimer: For traditional cultural research and entertainment reference only
