# Whitmore PAYMENTS - SaaS Landing Page

A fully functional, production-ready SaaS landing page with real database integration, form submissions, and interactive elements.

## 🚀 Quick Start - Run Locally

### Prerequisites

You need to have these installed on your computer:
- **Node.js** version 18 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)

To check if you have them installed, open your terminal and run:
```bash
node --version
npm --version
```

### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will download all the necessary packages. It takes about 1-2 minutes.

### Step 2: Start the Development Server

Run this command:

```bash
npm run dev
```

You should see output like this:
```
  VITE v5.4.21  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open in Browser

Open your web browser and go to:

```
http://localhost:5173
```

The website should now be running! You can click buttons, submit forms, and see everything working.

To stop the server, press `Ctrl+C` in your terminal.

---

## 📦 Deploy to Vercel (Recommended)

Vercel is a free hosting platform perfect for this project. Follow these exact steps:

### Prerequisites for Deployment

1. **GitHub Account** - Create one at [github.com](https://github.com) if you don't have one
2. **Vercel Account** - Create one at [vercel.com](https://vercel.com) (you can sign up with your GitHub account)

### Step 1: Push Your Project to GitHub

If you haven't already, initialize git and push to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - Whitmore PAYMENTS"

# Create a new repository on GitHub at github.com/new
# Then connect it (replace YOUR-USERNAME and YOUR-REPO-NAME):
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click the **"Add New..."** button, then **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository from the list
5. Vercel will auto-detect the settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **"Deploy"**

That's it! Vercel will build and deploy your site. You'll get a URL like:
```
https://whitmore-payments.vercel.app
```

#### Option B: Using Vercel CLI

If you prefer the command line:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - **Set up and deploy?** Press `Y`
   - **Which scope?** Select your account
   - **Link to existing project?** Press `N`
   - **Project name?** Press Enter (or type a custom name)
   - **Directory?** Press Enter (uses current directory)
   - **Override settings?** Press `N`

5. Deploy to production:
```bash
vercel --prod
```

Your site is now live!

---

## 🔧 Environment Variables

The project has environment variables set up in the `.env` file:

```bash
# Supabase (already configured)
VITE_SUPABASE_URL=https://obeuygeumdymphyxorzv.supabase.co
VITE_SUPABASE_ANON_KEY=[configured]

# OpenAI API Key (required for AI Invoice Generator)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 🤖 Enable AI Invoice Generator (Optional)

To use the AI-powered invoice generation feature:

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Open `.env` file
3. Replace `your_openai_api_key_here` with your actual key
4. Restart the dev server

**See `AI_INVOICE_SETUP.md` for detailed setup instructions.**

Without the OpenAI key, the site works perfectly - just the AI invoice feature won't be available.

**For Vercel Deployment:**
Environment variables are automatically read from the `.env` file.

To update in Vercel:
1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add `VITE_OPENAI_API_KEY` with your key
4. Redeploy

---

## 🧪 Test Production Build Locally

Before deploying, you can test the production build on your computer:

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

Open your browser to the URL shown (usually `http://localhost:4173`).

---

## 📁 Project Structure

```
whitmore-payments/
├── dist/                  # Production build output (created by npm run build)
├── src/
│   ├── components/        # All React components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Hero.tsx      # Hero section
│   │   ├── Pricing.tsx   # Pricing cards
│   │   ├── FAQ.tsx       # FAQ accordion
│   │   └── ...           # Other components
│   ├── lib/
│   │   └── supabase.ts   # Database connection
│   ├── App.tsx           # Main application
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── .env                   # Environment variables
├── package.json           # Project configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── index.html             # HTML entry point
```

---

## ✨ What's Included

### Interactive Features
- ✅ **AI Invoice Generator** (NEW!) - Generate invoices from natural language using OpenAI
- ✅ **Invoice Dashboard** - View, manage, and track all invoices
- ✅ **Trial signup forms** - Collects leads with validation
- ✅ **Contact sales forms** - Team plan inquiries
- ✅ **Demo modal** - Product demonstration
- ✅ **Smooth scroll navigation** - Header links scroll to sections
- ✅ **FAQ accordion** - Expandable questions
- ✅ **Database integration** - All forms and invoices save to Supabase

### Technical Features
- ✅ **React 18** with TypeScript
- ✅ **OpenAI GPT-4** integration for AI features
- ✅ **Tailwind CSS** for styling
- ✅ **Supabase** database backend with RLS
- ✅ **Form validation** with error handling
- ✅ **Responsive design** - Works on mobile, tablet, desktop
- ✅ **Accessible** - Keyboard navigation, ARIA labels

---

## 🔍 Verification Checklist

After deploying, verify everything works:

1. **Open your deployed URL** (e.g., `https://whitmore-payments.vercel.app`)
2. **Test "Start Free Trial" button** - Should open modal with form
3. **Submit the form** - Should show success message
4. **Click "Watch Demo"** - Should open demo modal
5. **Click "Talk to Sales"** - Should open contact form
6. **Test navigation links** - Should scroll to sections smoothly
7. **Test FAQ** - Questions should expand/collapse
8. **Test on mobile** - Open site on your phone, everything should work

---

## 🛠️ Troubleshooting

### Build fails with "Cannot find module"
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port 5173 is already in use
```bash
# Kill the process using that port
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9
# On Windows:
netstat -ano | findstr :5173
# Then: taskkill /PID [process_id] /F

# Or use a different port:
npm run dev -- --port 3000
```

### Changes not showing in browser
- Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
- Clear browser cache
- Restart the dev server

### Vercel build fails
1. Check build logs in Vercel dashboard
2. Ensure `.env` file is committed to your repository
3. Verify build command is `npm run build`
4. Verify output directory is `dist`

---

## 📚 Additional Documentation

- **DEPLOYMENT.md** - Detailed deployment guide with advanced options
- **FUNCTIONALITY_SUMMARY.md** - Complete technical documentation of all features

---

## 🎯 Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Check TypeScript types |
| `npm run lint` | Run ESLint |

---

## 🚀 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain and follow DNS setup instructions

2. **Monitor Form Submissions**
   - Log into your Supabase dashboard
   - View the `leads` table to see all form submissions

3. **Analytics** (Optional)
   - Add Vercel Analytics: Project Settings → Analytics → Enable
   - Or add Google Analytics to `index.html`

---

## 📞 Support

If you run into issues:

1. Check the troubleshooting section above
2. Review the error message carefully
3. Search the error on Google or Stack Overflow
4. Check Vercel documentation at [vercel.com/docs](https://vercel.com/docs)

---

## 📝 License

All rights reserved - Whitmore PAYMENTS

---

**Your site is ready to deploy!** Just follow the steps above. 🎉
