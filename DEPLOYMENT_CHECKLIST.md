# 📋 Deployment Checklist

Use this checklist before deploying to ensure everything works correctly.

## Pre-Deployment Checks

### 1. Install Dependencies
```bash
npm install
```
- [ ] No errors during installation
- [ ] `node_modules` folder created

### 2. Run Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Opens at http://localhost:5173
- [ ] Page loads correctly in browser

### 3. Test Functionality Locally
- [ ] "Start Free Trial" button opens modal
- [ ] Signup form accepts and validates input
- [ ] Form submission shows success message
- [ ] "Watch Demo" button opens demo modal
- [ ] "Talk to Sales" button opens contact form
- [ ] Header navigation links scroll to sections
- [ ] FAQ questions expand/collapse
- [ ] Page is responsive on mobile (resize browser)

### 4. Run Production Build
```bash
npm run build
```
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] `dist` folder is created
- [ ] Files in `dist/` folder:
  - [ ] `index.html`
  - [ ] `assets/` folder with CSS and JS files

### 5. Preview Production Build
```bash
npm run preview
```
- [ ] Preview server starts
- [ ] Opens at http://localhost:4173
- [ ] All functionality works in preview mode

### 6. Check Environment Variables
```bash
cat .env
```
- [ ] `.env` file exists
- [ ] Contains `VITE_SUPABASE_URL`
- [ ] Contains `VITE_SUPABASE_ANON_KEY`
- [ ] Both values are not empty

### 7. Verify Git Status
```bash
git status
```
- [ ] `.env` file is tracked (NOT in .gitignore)
- [ ] All source files are ready to commit
- [ ] `node_modules` is ignored
- [ ] `dist` folder is ignored

---

## Deployment via Vercel CLI

### 8. Install Vercel CLI
```bash
npm install -g vercel
```
- [ ] Vercel CLI installed successfully
- [ ] Can run `vercel --version`

### 9. Login to Vercel
```bash
vercel login
```
- [ ] Successfully logged in
- [ ] Received confirmation email (if first time)

### 10. Deploy to Preview
```bash
vercel
```
- [ ] Deployment starts
- [ ] Build succeeds
- [ ] Receives preview URL
- [ ] Can open preview URL in browser

### 11. Test Preview Deployment
Open the preview URL and test:
- [ ] Page loads correctly
- [ ] "Start Free Trial" works
- [ ] Form submission saves to database
- [ ] All interactive elements work
- [ ] Mobile view works correctly

### 12. Deploy to Production
```bash
vercel --prod
```
- [ ] Deployment succeeds
- [ ] Receives production URL
- [ ] Production URL works

---

## Deployment via Vercel Dashboard

### 8. Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
```
- [ ] Git initialized
- [ ] All files committed

### 9. Push to GitHub
```bash
git remote add origin https://github.com/YOUR-USERNAME/whitmore-payments.git
git branch -M main
git push -u origin main
```
- [ ] Successfully pushed to GitHub
- [ ] Can view repo at github.com

### 10. Connect to Vercel
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Select your GitHub repository

- [ ] Repository connected to Vercel
- [ ] Vercel detects framework as "Vite"

### 11. Configure Deployment
Verify settings:
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Root Directory: `./`

### 12. Deploy
Click "Deploy"
- [ ] Build starts
- [ ] Build succeeds
- [ ] Deployment completes
- [ ] Receives production URL

---

## Post-Deployment Verification

### 13. Test Live Site
Visit your production URL and verify:

**Functionality**
- [ ] Page loads fast (< 3 seconds)
- [ ] All images and styles load
- [ ] "Start Free Trial" button works
- [ ] Form submission works
- [ ] Success message displays
- [ ] "Watch Demo" modal opens
- [ ] "Talk to Sales" form works
- [ ] Navigation scrolls smoothly
- [ ] FAQ accordion works

**Mobile Testing**
- [ ] Open site on mobile phone
- [ ] Layout is responsive
- [ ] Buttons are tappable
- [ ] Forms work on mobile
- [ ] Modals display correctly

**Database**
- [ ] Go to Supabase dashboard
- [ ] Check `leads` table
- [ ] Confirm test submission appears

**Performance**
- [ ] Page loads in < 3 seconds
- [ ] No console errors (F12 → Console)
- [ ] Images load correctly
- [ ] Animations are smooth

---

## Common Issues & Fixes

### Build Fails
```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Environment Variables Not Working
1. Check `.env` file exists in root
2. Verify variable names start with `VITE_`
3. Restart dev server after changes
4. For Vercel: Add vars in Dashboard → Settings → Environment Variables

### Database Connection Fails
1. Check Supabase URL is correct in `.env`
2. Verify Supabase anon key is valid
3. Check Supabase project is active
4. Review RLS policies in Supabase dashboard

### Git Push Fails
```bash
git remote -v  # Check remote URL
git pull origin main --rebase  # Sync with remote
git push origin main  # Try again
```

---

## Success Criteria

Your deployment is successful when:

✅ Production URL is accessible
✅ All buttons and forms work
✅ Form submissions save to database
✅ Mobile layout looks good
✅ No console errors
✅ Page loads fast

---

## Next Steps After Successful Deployment

1. **Share your URL** with friends/colleagues for feedback
2. **Monitor form submissions** in Supabase dashboard
3. **Set up custom domain** (Optional - Vercel Dashboard → Domains)
4. **Enable analytics** (Optional - Vercel Dashboard → Analytics)
5. **Add more features** - edit code, commit, and push to auto-deploy

---

**Congratulations!** 🎉 Your Whitmore PAYMENTS site is live on the internet!
