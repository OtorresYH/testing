# 📦 How to Deploy Whitmore PAYMENTS

**Complete, step-by-step guide to get your site live on the internet.**

---

## ⚡ Fast Track (5 Minutes)

If you just want to deploy quickly, run these commands:

```bash
# 1. Install dependencies
npm install

# 2. Test locally (optional but recommended)
npm run dev
# Open http://localhost:5173 in browser, press Ctrl+C to stop

# 3. Build for production
npm run build

# 4. Install Vercel CLI
npm install -g vercel

# 5. Login and deploy
vercel login
vercel --prod
```

**Done!** You'll get a live URL like: `https://whitmore-payments-xyz.vercel.app`

---

## 📋 Detailed Instructions

### Prerequisites

You need:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **Terminal/Command Prompt** open in your project folder
- **Internet connection**

---

### Step 1: Verify Project is Ready

Run the verification script:

```bash
bash verify.sh
```

You should see:
```
✅ All checks passed! Ready to deploy.
```

If not, it will tell you what's missing.

---

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 247 packages in 20s
```

**If you see errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Step 3: Test Locally (Recommended)

Start the development server:

```bash
npm run dev
```

**Expected output:**
```
VITE v5.4.21 ready in 500 ms
➜ Local: http://localhost:5173/
```

Open your browser to `http://localhost:5173`

**Test these things:**
1. Click "Start Free Trial" - Modal should open
2. Fill out form and click submit - Should show success
3. Click "Watch Demo" - Demo modal should open
4. Scroll page - Navigation should be smooth
5. Click FAQ questions - Should expand/collapse

Press `Ctrl+C` to stop the server.

---

### Step 4: Build for Production

```bash
npm run build
```

**Expected output:**
```
✓ 1570 modules transformed.
dist/index.html                   1.34 kB
dist/assets/index-xxx.css        20.92 kB
dist/assets/index-xxx.js        369.68 kB
✓ built in 7.17s
```

**If build fails:**
```bash
npm run typecheck  # Check for TypeScript errors
npm run lint       # Check for code issues
```

---

### Step 5: Preview Production Build (Optional)

Test how it will look when deployed:

```bash
npm run preview
```

Open `http://localhost:4173` and test everything again.

Press `Ctrl+C` to stop.

---

### Step 6: Deploy to Vercel

#### Option A: Using Vercel CLI (Fastest)

**6.1 Install Vercel CLI:**
```bash
npm install -g vercel
```

**6.2 Login to Vercel:**
```bash
vercel login
```

Choose login method:
- Email (easiest)
- GitHub
- GitLab
- Bitbucket

You'll receive a verification email. Click the link.

**6.3 Deploy to preview:**
```bash
vercel
```

**Answer the prompts:**
```
? Set up and deploy "~/whitmore-payments"? [Y/n] Y
? Which scope do you want to deploy to? Your Name
? Link to existing project? [y/N] N
? What's your project's name? whitmore-payments
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

Wait for deployment. You'll get a preview URL.

**6.4 Deploy to production:**
```bash
vercel --prod
```

**You'll get a production URL like:**
```
https://whitmore-payments.vercel.app
```

✅ **Your site is live!**

---

#### Option B: Using Vercel Dashboard + GitHub

**6.1 Create GitHub repository:**

Go to https://github.com/new

- Repository name: `whitmore-payments`
- Public or Private: Your choice
- Don't check "Initialize with README"
- Click "Create repository"

**6.2 Push your code to GitHub:**

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Whitmore PAYMENTS"

# Connect to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/whitmore-payments.git

# Push
git branch -M main
git push -u origin main
```

**6.3 Deploy on Vercel:**

1. Go to https://vercel.com
2. Sign up/Login (can use GitHub account)
3. Click **"Add New..."** → **"Project"**
4. Click **"Import Git Repository"**
5. Click **"Import"** next to your `whitmore-payments` repo
6. Vercel auto-detects settings:
   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Click **"Deploy"**

Wait 2-3 minutes for deployment.

✅ **Your site is live!**

---

### Step 7: Verify Deployment

Open your production URL and test:

**Functionality Tests:**
- [ ] Page loads in < 3 seconds
- [ ] "Start Free Trial" button opens modal
- [ ] Form submission works and shows success
- [ ] "Watch Demo" opens demo modal
- [ ] "Talk to Sales" opens contact form
- [ ] Header navigation scrolls to sections
- [ ] FAQ questions expand/collapse
- [ ] All images and styles load

**Mobile Test:**
- [ ] Open site on phone
- [ ] Layout looks good
- [ ] Buttons work
- [ ] Forms work

**Database Test:**
1. Submit a test form on your live site
2. Go to https://supabase.com and login
3. Open your project
4. Go to Table Editor → `leads` table
5. Verify your test submission appears

---

## 🔧 Configuration Files

Your project has these files configured for deployment:

### `package.json`
```json
{
  "name": "whitmore-payments",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### `.env`
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important:** The `.env` file is NOT in `.gitignore` so it will be deployed with your code. This is intentional for this project.

---

## 🔄 Updating Your Deployed Site

After making changes to your code:

**If using Vercel CLI:**
```bash
vercel --prod
```

**If using GitHub + Vercel:**
```bash
git add .
git commit -m "Updated feature X"
git push
```
Vercel automatically deploys when you push to GitHub.

---

## 🌐 Custom Domain (Optional)

To use your own domain (e.g., `whitmoreapp.com`):

1. Go to Vercel Dashboard
2. Select your project
3. Click **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your domain name
6. Follow DNS configuration instructions
7. Wait for DNS propagation (up to 24 hours)

---

## 📊 Monitoring

**View deployment logs:**
- Vercel Dashboard → Your Project → Deployments → Click deployment → Logs

**View form submissions:**
- Supabase Dashboard → Table Editor → `leads` table

**View analytics (optional):**
- Vercel Dashboard → Your Project → Analytics → Enable

---

## 🐛 Troubleshooting

### "Build failed" error on Vercel

**Check build logs:**
1. Go to Vercel Dashboard
2. Click your project
3. Click the failed deployment
4. Read the build logs

**Common fixes:**
```bash
# Locally, run:
rm -rf node_modules package-lock.json dist
npm install
npm run build

# If that works, try deploying again:
vercel --prod
```

### "Module not found" error

Make sure all imports use relative paths:
```typescript
// ✅ Correct
import { Button } from './components/Button';

// ❌ Wrong
import { Button } from 'components/Button';
```

### Environment variables not working

**Vercel CLI:** Environment variables from `.env` are used automatically.

**Vercel Dashboard:**
1. Go to Settings → Environment Variables
2. Add each variable:
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase URL
   - Environment: Production, Preview, Development
3. Click Save
4. Redeploy

### Port already in use

```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Git push fails

```bash
# Check remote URL
git remote -v

# If wrong, update it
git remote set-url origin https://github.com/YOUR-USERNAME/whitmore-payments.git

# Try again
git push origin main
```

---

## ✅ Success Checklist

Your deployment is complete when:

- [ ] Can access live URL
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] Database receives submissions
- [ ] Mobile view works
- [ ] No console errors
- [ ] SSL certificate is active (https://)

---

## 📞 Getting Help

**Check documentation:**
- `README.md` - Full project documentation
- `QUICKSTART.md` - Quick deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist

**Common resources:**
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev

**Still stuck?**
- Check error message carefully
- Google the error
- Search on Stack Overflow
- Review Vercel deployment logs

---

**Congratulations!** 🎉

Your Whitmore PAYMENTS landing page is now live on the internet!

**Your live URL:** `https://whitmore-payments-[your-id].vercel.app`

Share it with the world! 🚀
