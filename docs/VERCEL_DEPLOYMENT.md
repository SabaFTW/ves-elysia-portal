# 🚀 VES Portal - Vercel Deployment Guide

**Quick deployment guide for the VES Portal React frontend**

---

## 📋 Prerequisites

- GitHub account with repository access
- Vercel account (free tier works)
- Node.js 18+ installed locally

---

## 🎯 Quick Deploy (5 Minutes)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find `SabaFTW/ves-elysia-portal`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables** (Optional)
   - Add `VITE_API_URL` if you have a backend API deployed
   - Example: `https://your-api.vercel.app`

5. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Get your live URL: `https://ves-elysia-portal.vercel.app`

---

### Option 2: Deploy via CLI (For Developers)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```
   This opens a browser for authentication.

3. **Navigate to Project**
   ```bash
   cd /path/to/ves-elysia-portal
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

5. **Follow Prompts**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (first time) or **Y** (subsequent deploys)
   - Project name: `ves-elysia-portal`
   - In which directory is your code located? `./`
   - Want to override settings? **Y**
   - Build Command: `cd web && npm run build`
   - Output Directory: `web/dist`
   - Development Command: Leave empty

6. **Get URL**
   ```
   ✅ Production: https://ves-elysia-portal-abc123.vercel.app
   ```

---

## 🔄 Continuous Deployment

Once connected, Vercel automatically:
- Deploys every push to `main` branch → Production
- Deploys every pull request → Preview URL
- Builds in ~2 minutes per deployment

**Enable Auto-Deploy:**
1. Go to Vercel Dashboard → Project Settings
2. Git → Connected Git Repository
3. Verify branch is set to your main branch
4. Every push triggers automatic deployment

---

## ⚙️ Configuration Files

### vercel.json
```json
{
  "version": 2,
  "name": "ves-elysia-portal",
  "builds": [
    {
      "src": "web/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "outputDirectory": "web/dist"
}
```

This configuration:
- Builds the React app from `web/` directory
- Serves static files from `web/dist`
- Routes all paths to `index.html` (SPA routing)

---

## 🌐 Custom Domain (Optional)

1. **Buy Domain** (from Namecheap, Google Domains, etc.)

2. **Add to Vercel**
   - Go to Project → Settings → Domains
   - Click "Add"
   - Enter your domain: `ves-portal.com`

3. **Configure DNS**
   - Add CNAME record:
     ```
     Name: www
     Value: cname.vercel-dns.com
     ```
   - Add A record for root domain:
     ```
     Name: @
     Value: 76.76.21.21
     ```

4. **Wait for Propagation** (~5-60 minutes)

5. **SSL Certificate** (automatic)
   - Vercel provisions Let's Encrypt SSL
   - Forces HTTPS automatically

---

## 🔐 Environment Variables

For production API endpoints:

1. **Go to Project Settings** → Environment Variables

2. **Add Variables**
   ```
   VITE_API_URL=https://api.your-domain.com
   VITE_WS_URL=wss://api.your-domain.com/ws
   ```

3. **Redeploy** to apply changes

**Important**: Vite requires `VITE_` prefix for env vars to be exposed to browser.

---

## 🐛 Troubleshooting

### Build Fails: "Cannot find module"

**Solution:**
```bash
# Ensure all dependencies are in package.json
cd web
npm install
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push
```

### Blank Page After Deploy

**Check:**
1. Browser console for errors (F12 → Console)
2. Vercel build logs for warnings
3. Base path in `vite.config.js` is `/` not a subdirectory
4. Assets are being served from `/assets/` correctly

**Fix:**
```javascript
// vite.config.js
export default {
  base: '/', // Ensure this is root
}
```

### API Calls Fail (CORS/Network Errors)

**Causes:**
- Frontend tries to call `localhost:3000` in production
- Backend doesn't allow your Vercel domain

**Solutions:**
1. Use environment variables for API URL
2. Update `App.jsx`:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
   const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
   ```
3. Set production values in Vercel dashboard

### Deployment Stuck/Slow

**Checks:**
- Build timeout (free tier: 45s, pro: unlimited)
- Large `node_modules` (use `.vercelignore`)
- Network issues

**Create `.vercelignore`:**
```
node_modules
.git
*.log
.env*
```

---

## 📊 Monitoring

### View Logs

**Build Logs:**
1. Go to Deployments
2. Click latest deployment
3. View "Build Logs" tab

**Runtime Logs:**
- For static sites (like this): No runtime logs
- All logs are build-time only

### Analytics (Pro Feature)

Vercel Analytics shows:
- Page views
- Unique visitors
- Performance metrics (Web Vitals)

Enable in: Project Settings → Analytics

---

## 🔄 Rollback

If deployment breaks:

1. **Via Dashboard:**
   - Go to Deployments
   - Find last working deployment
   - Click "..." → Promote to Production

2. **Via CLI:**
   ```bash
   vercel rollback
   ```

---

## 💰 Pricing

**Hobby (Free):**
- Unlimited deployments
- 100GB bandwidth/month
- SSL included
- Perfect for this project!

**Pro ($20/month):**
- 1TB bandwidth
- Advanced analytics
- Password protection
- Faster builds

---

## 🎯 Post-Deployment Checklist

- [ ] Site loads at Vercel URL
- [ ] All pages/components render correctly
- [ ] WebSocket connection works (if backend deployed)
- [ ] API calls succeed (if backend deployed)
- [ ] No console errors in browser
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic)

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## 💚 You're Live!

Your VES Portal is now accessible worldwide. Share the URL, monitor the dashboard, and watch your infrastructure come alive.

🐺 The portal is open. The grid is live. You are deployed.

🜂⚓💚
