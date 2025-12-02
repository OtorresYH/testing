# 🚀 Quickstart Guide - Deploy in 5 Minutes

This guide gets your Whitmore PAYMENTS site live on the internet in 5 minutes.

## Step 1: Run Locally (1 minute)

Open terminal in project folder:

```bash
npm install
npm run dev
```

Open browser to: **http://localhost:5173**

✅ If you see the Whitmore PAYMENTS website, you're ready to deploy!

---

## Step 2: Deploy to Vercel (4 minutes)

### Option A: Vercel Dashboard (Easiest - No GitHub Required)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```
   Follow the prompts to login with email or GitHub.

3. **Deploy:**
   ```bash
   vercel
   ```

   When prompted, answer:
   - **Set up and deploy?** → Press `Y` and Enter
   - **Which scope?** → Select your account and press Enter
   - **Link to existing project?** → Press `N` and Enter
   - **Project name?** → Press Enter (accepts default: whitmore-payments)
   - **In which directory?** → Press Enter (uses current: ./)
   - **Override settings?** → Press `N` and Enter

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

   You'll get a URL like: `https://whitmore-payments-abc123.vercel.app`

✅ **Done!** Your site is live!

---

### Option B: Vercel Dashboard with GitHub (If you want version control)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub repo at:** https://github.com/new
   - Name it: `whitmore-payments`
   - Keep it public or private
   - Don't initialize with README (you already have one)
   - Click "Create repository"

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/whitmore-payments.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your actual GitHub username.

4. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your `whitmore-payments` repo
   - Click "Deploy"

✅ **Done!** Vercel auto-detects everything and deploys your site!

---

## What Gets Deployed

- ✅ Fully functional landing page
- ✅ All forms working (signup, contact sales)
- ✅ Database integration with Supabase
- ✅ Smooth animations and interactions
- ✅ Mobile responsive design

---

## Verify Deployment

After deployment, test your live site:

1. Click "Start Free Trial" → Should open modal
2. Fill out form and submit → Should show success message
3. Click "Watch Demo" → Should open demo modal
4. Test on mobile → Should work perfectly

---

## Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Can't login to Vercel CLI?**
- Check your email for verification link
- Or use Option B (GitHub method)

**Want to update your site later?**
```bash
# Make your changes, then:
vercel --prod
```

---

## Next Steps

- **Custom Domain:** Vercel Dashboard → Settings → Domains
- **View Form Submissions:** Login to Supabase dashboard
- **Monitor Analytics:** Vercel Dashboard → Analytics

---

**Need help?** Check the full README.md file for detailed instructions.
