# Whitmore PAYMENTS - Invoice & Payment SaaS

A fully functional, production-ready invoice and payment management system with Supabase authentication, database integration, Stripe payments, and email notifications.

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

### Step 2: Configure Environment Variables

The project requires several environment variables. These are already configured in the `.env` file:

```bash
# Supabase (already configured)
VITE_SUPABASE_URL=https://obeuygeumdymphyxorzv.supabase.co
VITE_SUPABASE_ANON_KEY=[configured]

# OpenAI API Key (optional - for AI Invoice Generator)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

The Supabase database is already set up with:
- User authentication
- Invoice management
- Payment tracking
- Row Level Security policies

### Step 3: Start the Development Server

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

### Step 4: Open in Browser

Open your web browser and go to:

```
http://localhost:5173
```

The website should now be running! You can:
- Create an account
- Sign in
- Create invoices
- View your invoice dashboard

To stop the server, press `Ctrl+C` in your terminal.

---

## 📦 Deploy to Netlify

Netlify is the recommended hosting platform for this project because it supports:
- Static site hosting
- Serverless Functions (for Stripe and email)
- Automatic HTTPS
- Free tier with generous limits

### Prerequisites for Deployment

1. **GitHub Account** - Create one at [github.com](https://github.com) if you don't have one
2. **Netlify Account** - Create one at [netlify.com](https://netlify.com) (you can sign up with your GitHub account)

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

### Step 2: Deploy to Netlify

#### Option A: Using Netlify Dashboard (Recommended)

1. Go to [app.netlify.com](https://app.netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select your repository from the list
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Add environment variables (click "Advanced" → "New variable"):
   - `VITE_SUPABASE_URL`: `https://obeuygeumdymphyxorzv.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: (copy from your `.env` file)
   - `VITE_OPENAI_API_KEY`: (optional - your OpenAI key)
8. Click **"Deploy site"**

That's it! Netlify will build and deploy your site. You'll get a URL like:
```
https://whitmore-payments.netlify.app
```

#### Option B: Using Netlify CLI

If you prefer the command line:

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize and deploy:
```bash
netlify init
```

4. Follow the prompts:
   - **Create a new site?** Press `Y`
   - **Team?** Select your account
   - **Site name?** Press Enter (or type a custom name)
   - **Build command:** `npm run build`
   - **Directory to deploy:** `dist`

5. Deploy:
```bash
netlify deploy --prod
```

Your site is now live!

---

## 🔧 Configure Stripe Payments

To enable payment processing, you need to configure Stripe:

### Step 1: Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete account verification

### Step 2: Get Your API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

### Step 3: Configure Netlify Function

Open `netlify/functions/create-checkout.ts` and add Stripe integration:

```typescript
import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

// TODO: Add your Stripe secret key here
// Get it from: https://dashboard.stripe.com/apikeys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { invoiceId, amount, invoiceNumber } = JSON.parse(event.body || '{}');

    if (!invoiceId || !amount || !invoiceNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const amountInCents = Math.round(parseFloat(amount) * 100);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Invoice ${invoiceNumber}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL}/invoice/${invoiceId}?payment=success`,
      cancel_url: `${process.env.URL}/invoice/${invoiceId}?payment=cancelled`,
      metadata: {
        invoiceId,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

### Step 4: Add Stripe Secret Key to Netlify

1. Go to Netlify Dashboard → Your Site → **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add:
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** Your Stripe secret key (from Step 2)
4. Click **Save**
5. Redeploy your site

### Step 5: Configure Stripe Webhook

Open `netlify/functions/stripe-webhook.ts` and add webhook handling:

```typescript
import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// TODO: Add your Stripe secret key and webhook secret
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const sig = event.headers['stripe-signature'];

    if (!sig) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing stripe-signature header' }),
      };
    }

    // Verify webhook signature
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      sig,
      webhookSecret
    );

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        const invoiceId = session.metadata?.invoiceId;

        if (invoiceId) {
          // Update invoice status to paid
          await supabase
            .from('invoices')
            .update({ status: 'paid' })
            .eq('id', invoiceId);

          // Record payment
          await supabase
            .from('payments')
            .insert({
              invoice_id: invoiceId,
              amount: (session.amount_total || 0) / 100,
              payment_method: 'card',
              stripe_payment_id: session.payment_intent as string,
              status: 'completed',
              paid_at: new Date().toISOString(),
            });
        }
        break;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' }),
    };
  }
};
```

### Step 6: Set Up Webhook Endpoint in Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
4. Select events to listen to: `checkout.session.completed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to Netlify environment variables:
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** Your webhook signing secret

---

## 🤖 Configure AI Features (OpenAI Integration)

Whitmore PAYMENTS includes powerful AI features powered by OpenAI GPT-4o-mini:

### AI Features

1. **AI Email Drafting** - Automatically generate professional emails for:
   - New invoice notifications
   - Payment reminders
   - Overdue notices
   - Welcome/onboarding messages
   - Plan upgrade offers

2. **AI Support Chat** - An intelligent chat widget that:
   - Answers questions about plans and pricing
   - Helps potential customers choose the right plan
   - Provides information about features
   - Works for both anonymous visitors and logged-in users

### Setup Instructions

#### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or sign in to your account
3. Navigate to **API keys** section
4. Click **Create new secret key**
5. Copy the key (starts with `sk-`)

**Important:** OpenAI API usage is billed based on tokens. The app uses GPT-4o-mini which is cost-effective (~$0.15 per 1M input tokens).

#### Step 2: Add to Environment Variables

For local development, add to your `.env` file:
```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

For Netlify deployment:
1. Go to Netlify Dashboard → Your Site → **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key
4. Click **Save**
5. Redeploy your site

#### Step 3: How the AI Features Work

**AI Email Generation (`/.netlify/functions/ai-generate-email`)**

This function:
- Takes invoice details and email type as input
- Generates a professional, contextual email using GPT-4o-mini
- Returns subject line, plain text, and HTML formatted body
- Logs all generated emails to the database for review
- Never exposes the API key to the frontend (server-side only)

Example usage from the invoice detail page:
```typescript
const response = await fetch('/.netlify/functions/ai-generate-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'invoice_created',
    invoiceId: 'uuid',
    extraNotes: 'Custom message here',
    userId: 'uuid',
  }),
});
```

**AI Support Chat (`/.netlify/functions/ai-support-chat`)**

This function:
- Maintains conversation context (last 10 messages)
- Understands Whitmore Payments plans and features
- Provides accurate information about pricing
- Gracefully handles questions outside its scope
- Logs all conversations to database
- Implements rate limiting and message length limits

The chat widget appears as a floating button on all pages and can be used by:
- Anonymous visitors researching plans
- Logged-in users needing help

#### Step 4: Customize AI Behavior

**Email Generation Prompts**

Edit the system prompt in `netlify/functions/ai-generate-email.ts` to change:
- Tone (formal, casual, friendly)
- Email structure
- Company branding
- Default messaging

**Support Chat Knowledge Base**

Edit the system prompt in `netlify/functions/ai-support-chat.ts` to:
- Update plan information
- Add new features
- Change pricing details
- Modify the assistant's personality

#### AI Activity Logging

The app automatically logs AI activity to Supabase:

**`ai_email_logs` table:**
- Tracks all generated emails
- Stores subject, body, invoice ID
- Links to user who generated it
- Timestamp for auditing

**`ai_support_sessions` table:**
- Tracks chat sessions
- Links to user (if logged in)
- Stores message count and duration

**`ai_support_messages` table:**
- Stores individual chat messages
- Links to session
- Includes role (user/assistant)
- Full message content

View logs in your Supabase dashboard to:
- Monitor AI usage
- Review generated content
- Analyze common support questions
- Improve AI responses

#### Important Security Notes

✅ **API key is server-side only** - Never exposed to frontend
✅ **Rate limiting** - Max message length and history limits
✅ **User data protection** - RLS policies control log access
✅ **Error handling** - Graceful fallbacks if OpenAI fails
✅ **Cost control** - Uses efficient GPT-4o-mini model

#### Limitations and Best Practices

**AI-Generated Emails:**
- Always review before sending
- Customize as needed for your brand
- Add personal touches for important clients
- Monitor logs to improve prompts

**AI Support Chat:**
- Only knows information in its system prompt
- Directs complex questions to human support
- May require prompt updates as plans change
- Not a replacement for human support

**Cost Management:**
- Monitor usage in OpenAI dashboard
- Set up billing alerts
- Consider caching common responses
- Adjust max_tokens if needed

### Testing AI Features

After configuration:

1. **Test Email Generation:**
   - Create an invoice
   - Click "Generate with AI"
   - Review the generated email
   - Verify it includes invoice details

2. **Test Support Chat:**
   - Click the chat button
   - Ask about plans and pricing
   - Verify accurate responses
   - Test as both logged-in and anonymous user

3. **Check Logs:**
   - View `ai_email_logs` in Supabase
   - View `ai_support_sessions` and `ai_support_messages`
   - Verify data is being logged correctly

---

## 📧 Configure Email Notifications

To send invoice emails, configure an email provider:

### Option A: Using Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Update `netlify/functions/send-invoice.ts`:

```typescript
import { Handler } from '@netlify/functions';
import { Resend } from 'resend';

// TODO: Add your Resend API key here
// Get it from: https://resend.com/api-keys
const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { invoiceId, recipientEmail, invoiceUrl } = JSON.parse(event.body || '{}');

    if (!invoiceId || !recipientEmail || !invoiceUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Send email using Resend
    await resend.emails.send({
      from: 'invoices@yourdomain.com',
      to: recipientEmail,
      subject: 'New Invoice from Whitmore PAYMENTS',
      html: `
        <h2>You have received a new invoice</h2>
        <p>Please click the link below to view and pay your invoice:</p>
        <a href="${invoiceUrl}">${invoiceUrl}</a>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

4. Add your Resend API key to Netlify environment variables:
   - **Key:** `RESEND_API_KEY`
   - **Value:** Your Resend API key

### Option B: Using SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Update the send-invoice function with SendGrid integration
4. Add `SENDGRID_API_KEY` to Netlify environment variables

---

## 🗄️ Supabase Configuration

The database is already set up with the following tables:

### Tables

1. **profiles** - User profile information
   - Linked to auth.users
   - Stores user details

2. **invoices** - Invoice records
   - Belongs to user
   - Contains invoice details and status
   - Has secure access token for public viewing

3. **invoice_items** - Line items for invoices
   - Belongs to invoice
   - Contains item details and pricing

4. **payments** - Payment records
   - Belongs to invoice
   - Tracks payment status and Stripe IDs

### Row Level Security

All tables have RLS enabled:
- Users can only access their own data
- Public can view invoices via secure token
- Proper authentication required for all operations

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
├── dist/                     # Production build output
├── netlify/
│   └── functions/            # Serverless functions
│       ├── create-checkout.ts    # Stripe checkout
│       ├── stripe-webhook.ts     # Payment webhooks
│       └── send-invoice.ts       # Email sending
├── src/
│   ├── components/           # React components
│   │   ├── Auth/            # Authentication components
│   │   ├── Header.tsx       # Navigation
│   │   └── ...              # Other components
│   ├── contexts/
│   │   └── AuthContext.tsx  # Auth state management
│   ├── lib/
│   │   ├── supabase.ts      # Database connection
│   │   ├── invoiceApi.ts    # Invoice API functions
│   │   └── openai.ts        # OpenAI integration
│   ├── pages/
│   │   ├── Dashboard.tsx    # User dashboard
│   │   ├── InvoiceDetail.tsx # Invoice details
│   │   └── PublicInvoice.tsx # Public invoice view
│   ├── App.tsx              # Main application
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── supabase/
│   └── migrations/          # Database migrations
├── .env                     # Environment variables
├── package.json             # Project configuration
└── README.md                # This file
```

---

## ✨ What's Included

### Core Features
- ✅ **User Authentication** - Supabase email/password auth
- ✅ **Invoice Dashboard** - View and manage all invoices
- ✅ **Invoice Creation** - Create detailed invoices with line items
- ✅ **Public Invoice Links** - Secure shareable links for clients
- ✅ **Payment Processing** - Stripe integration (stub ready)
- ✅ **Email Notifications** - Send invoices via email (stub ready)
- ✅ **AI Email Drafting** - Generate professional emails with AI
- ✅ **AI Support Chat** - Intelligent customer support assistant

### Technical Features
- ✅ **React 18** with TypeScript
- ✅ **Supabase** for auth and database
- ✅ **Netlify Functions** for serverless backend
- ✅ **Stripe** payment integration (ready to configure)
- ✅ **Email** notifications (ready to configure)
- ✅ **OpenAI GPT-4o-mini** for AI features
- ✅ **Tailwind CSS** for styling
- ✅ **Row Level Security** for data protection
- ✅ **Responsive design** - Works on all devices

---

## 🔍 Verification Checklist

After deploying, verify everything works:

1. **Authentication**
   - [ ] Sign up creates new account
   - [ ] Sign in works with correct credentials
   - [ ] Sign out works properly
   - [ ] Password reset sends email

2. **Dashboard**
   - [ ] Dashboard shows user's invoices
   - [ ] Stats are calculated correctly
   - [ ] Can navigate to invoice details

3. **Invoice Management**
   - [ ] Can create new invoices
   - [ ] Can view invoice details
   - [ ] Can copy public invoice link
   - [ ] Public link opens invoice without login

4. **Payments** (after Stripe configuration)
   - [ ] "Pay Now" button works
   - [ ] Redirects to Stripe checkout
   - [ ] Payment success updates invoice status

5. **Emails** (after email configuration)
   - [ ] "Send Invoice" button works
   - [ ] Email is delivered to recipient
   - [ ] Email contains correct invoice link

---

## 🛠️ Troubleshooting

### Build fails with "Cannot find module"
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Authentication not working
- Check Supabase URL and anon key in `.env`
- Verify environment variables are set in Netlify
- Check browser console for errors

### Invoices not saving
- Check Supabase connection
- Verify RLS policies are set up correctly
- Check network tab for API errors

### Stripe payments not working
- Verify Stripe secret key is set in Netlify
- Check webhook endpoint is configured in Stripe
- Review Netlify function logs

### Emails not sending
- Verify email provider API key is set
- Check function logs for errors
- Test with a different email address

---

## 🎯 Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Check TypeScript types |
| `npm run lint` | Run ESLint |

---

## 🚀 Next Steps

1. **Configure Stripe** - Follow the Stripe setup instructions above
2. **Configure Email** - Set up Resend or SendGrid
3. **Custom Domain** - Add your domain in Netlify settings
4. **Monitor Usage** - Check Supabase and Netlify dashboards
5. **Add Features** - Customize the app for your needs

---

## 📞 Support

If you run into issues:

1. Check the troubleshooting section above
2. Review Netlify function logs
3. Check Supabase dashboard for database errors
4. Review browser console for client-side errors

---

## 📝 License

All rights reserved - Whitmore PAYMENTS

---

**Your invoice management system is ready to deploy!** Follow the setup instructions above to get started. 🎉
