# Complete Deployment Guide for SEO Tools Website

## Quick Solution: Two Repository Setup (Recommended)

Your deployment failed because Vercel can't handle the mixed Node.js/Python architecture. Here's the exact solution:

## Step 1: Create Frontend Repository

### 1.1 Create New Repository
```bash
# Create new repo on GitHub: your-app-frontend
git clone https://github.com/YOUR_USERNAME/your-app-frontend.git
cd your-app-frontend
```

### 1.2 Copy Frontend Files
Copy these files from your current repo to the new frontend repo:

**Root files:**
```
client/index.html → index.html
client/package.json → package.json
vite.config.ts → vite.config.ts
tailwind.config.ts → tailwind.config.ts
tsconfig.json → tsconfig.json
postcss.config.js → postcss.config.js
components.json → components.json
```

**Folders:**
```
client/src/ → src/
client/public/ → public/
```

### 1.3 Update Frontend Configuration

**1. Update `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**2. Create `vercel.json`:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**3. Update `src/lib/queryClient.ts`:**
```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: 'include',
  });
  // ... rest of function
};
```

### 1.4 Deploy Frontend to Vercel
```bash
npm install
git add .
git commit -m "Initial frontend setup"
git push origin main

# Deploy to Vercel
# 1. Go to vercel.com
# 2. Import your frontend repository
# 3. Add environment variable: VITE_API_URL (leave empty for now)
# 4. Deploy
```

## Step 2: Create Backend Repository

### 2.1 Create New Repository
```bash
# Create new repo on GitHub: your-app-backend
git clone https://github.com/YOUR_USERNAME/your-app-backend.git
cd your-app-backend
```

### 2.2 Copy Backend Files
Copy these files from your current repo:

**Root files:**
```
package.json → package.json
tsconfig.json → tsconfig.json
drizzle.config.ts → drizzle.config.ts
```

**Folders:**
```
server/ → server/
shared/ → shared/
All .py files → ./
```

### 2.3 Update Backend Configuration

**1. Create `requirements.txt`:**
```
beautifulsoup4==4.12.2
cryptography==41.0.7
fastapi==0.104.1
html2text==2020.1.16
httpx==0.25.2
markdownify==0.11.6
numpy==1.24.4
pdfplumber==0.9.0
pikepdf==8.7.1
pillow==10.1.0
pydantic==2.5.0
pymupdf==1.23.8
pypdf2==3.0.1
pytesseract==0.3.10
python-dotenv==1.0.0
requests==2.31.0
uvicorn==0.24.0
```

**2. Update `package.json` scripts:**
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "dev": "tsx server/index.ts"
  }
}
```

**3. Update CORS in `server/index.ts`:**
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

**4. Create `railway.toml`:**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"

[variables]
NODE_ENV = "production"
```

### 2.4 Deploy Backend to Railway

```bash
npm install
git add .
git commit -m "Initial backend setup"
git push origin main

# Deploy to Railway
# 1. Go to railway.app
# 2. Create new project from GitHub repo
# 3. Add these environment variables:
#    - DATABASE_URL (Railway will provide PostgreSQL)
#    - OPENAI_API_KEY (your key)
#    - CORS_ORIGIN (your Vercel frontend URL)
# 4. Deploy
```

## Step 3: Connect Frontend and Backend

### 3.1 Update Frontend Environment
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add: `VITE_API_URL` = `https://your-railway-backend-url.railway.app`
4. Redeploy frontend

### 3.2 Update Backend CORS
1. Go to your Railway project dashboard
2. Variables tab
3. Update: `CORS_ORIGIN` = `https://your-vercel-frontend-url.vercel.app`
4. Redeploy backend

## Alternative: Single Repository Deployment

If you want to keep one repository, use this `vercel.json`:

```json
{
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "functions": {
    "server/index.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

**But this approach has limitations:**
- Python tools won't work on Vercel
- Complex file processing will fail
- Better to use separate deployments

## Environment Variables Summary

**Frontend (Vercel):**
- `VITE_API_URL`: Your Railway backend URL

**Backend (Railway):**
- `DATABASE_URL`: PostgreSQL connection (Railway provides)
- `OPENAI_API_KEY`: Your OpenAI API key
- `CORS_ORIGIN`: Your Vercel frontend URL
- `NODE_ENV`: production
- `PORT`: 5000 (Railway sets automatically)

## Database Setup
Railway will automatically provide PostgreSQL when you add it to your project. The `DATABASE_URL` environment variable will be set automatically.

## Testing the Setup
1. Frontend should load at your Vercel URL
2. Backend health check at: `your-railway-url/api/health`
3. Test API calls from frontend to backend
4. Verify Python tools work (PDF processing, etc.)

This setup separates concerns cleanly and ensures both parts deploy successfully.