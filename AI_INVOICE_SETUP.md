# 🤖 AI Invoice Generator - Setup Guide

## Overview

The AI Invoice Generator uses OpenAI's GPT-4 to create professional invoices from natural language descriptions. Simply describe what you want to invoice, and AI handles the rest!

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or login
3. Click **"Create new secret key"**
4. Give it a name (e.g., "Whitmore Payments")
5. Copy the key (starts with `sk-...`)

**Important:** Copy the key immediately - you won't be able to see it again!

### Step 2: Add API Key to .env File

Open your `.env` file and replace the placeholder:

```bash
# Before:
VITE_OPENAI_API_KEY=your_openai_api_key_here

# After:
VITE_OPENAI_API_KEY=sk-proj-abcd1234...your-actual-key
```

### Step 3: Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

**That's it!** The AI Invoice Generator is now ready to use.

---

## 💡 How to Use

### 1. Access the Generator

On the landing page, look for the **"AI Invoice Generator"** feature card (marked with "NEW" badge).

Click the **"Try AI Generator"** button.

### 2. Describe Your Invoice

Enter a natural language description like:

```
Create an invoice for ABC Company for 20 hours of consulting at $150/hour
```

```
Bill Sarah Johnson for logo design $500 and business card design $200
```

```
Invoice Tech Startup Inc for monthly retainer $2500 due in 15 days
```

### 3. Generate Invoice

Click **"Generate Invoice with AI"** and wait 2-3 seconds.

The AI will:
- Extract client information
- Parse services and amounts
- Calculate totals
- Create line items
- Set due dates
- Save to your database

### 4. Manage Invoices

Your generated invoices appear in the dashboard below, where you can:
- View all invoice details
- Change invoice status (Draft → Sent → Paid → Overdue)
- Delete invoices
- Track total amounts

---

## 🎯 What the AI Can Do

The AI Invoice Generator can:

✅ **Extract client names** from descriptions
✅ **Parse multiple line items** with quantities and rates
✅ **Calculate totals automatically**
✅ **Set reasonable due dates** (defaults to 30 days)
✅ **Handle different currencies** (specify in prompt)
✅ **Generate professional descriptions**
✅ **Create detailed line item breakdowns**

### Example Prompts

**Simple invoice:**
```
Invoice John Smith for web design services $1,500
```

**Multiple items:**
```
Bill ABC Corp for:
- Logo design: $500
- Business cards: $200
- Website mockup: $800
```

**With details:**
```
Create an invoice for Sarah at Tech Solutions for 40 hours of consulting
at $125/hour, due in 15 days
```

**Recurring service:**
```
Monthly retainer invoice for BigCo: $3,000 for ongoing support
```

---

## 💰 OpenAI Pricing

The AI Invoice Generator uses **GPT-4o-mini**, which is extremely affordable:

- **Cost:** ~$0.15 per 1,000 requests
- **Per invoice:** Less than $0.001 (fraction of a cent)

For example:
- 1,000 invoices = $0.15
- 10,000 invoices = $1.50

You can monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage).

---

## 🗄️ Database Schema

Invoices are stored in Supabase with this structure:

```sql
Table: invoices
- id (uuid) - Unique identifier
- invoice_number (text) - Auto-generated (e.g., INV-202512-0001)
- user_email (text) - Your email
- client_name (text) - Client/customer name
- client_email (text) - Client email (optional)
- description (text) - Service description
- amount (numeric) - Total amount
- currency (text) - Currency code (USD, EUR, etc.)
- due_date (date) - Payment due date
- status (text) - draft | sent | paid | overdue
- ai_prompt (text) - Your original prompt
- line_items (jsonb) - Array of line items
- notes (text) - Additional notes
- created_at (timestamp) - Creation date
- updated_at (timestamp) - Last update
```

---

## 🔒 Security Notes

### Important Security Considerations

**Current Setup (Development):**
- OpenAI API calls are made from the browser
- API key is exposed in client-side code
- Suitable for demos and testing only

**For Production:**
You should move API calls to a backend to keep your API key secure:

1. Create a Supabase Edge Function
2. Call OpenAI from the function (server-side)
3. Frontend calls your Edge Function instead

This prevents exposing your API key to users.

### Supabase Row Level Security

All invoice data is protected with RLS policies:
- Users can only see their own invoices
- Public cannot access invoice data
- Database is secure by default

---

## 🛠️ Troubleshooting

### "OpenAI API key not configured" error

**Solution:**
1. Check `.env` file has `VITE_OPENAI_API_KEY=sk-...`
2. Make sure the key starts with `sk-proj-` or `sk-`
3. Restart dev server: `npm run dev`

### "Failed to generate invoice" error

**Possible causes:**
1. **Invalid API key** - Generate a new key from OpenAI
2. **No credits** - Add payment method at [OpenAI Billing](https://platform.openai.com/account/billing)
3. **Rate limit** - Wait a few seconds and try again
4. **Network error** - Check your internet connection

### AI generates wrong information

**Tips for better prompts:**
- Be specific about amounts and rates
- Include client name explicitly
- Specify currency if not USD
- Mention due date if important
- List each service separately

**Example of good prompt:**
```
Create an invoice for:
Client: ABC Corporation
Services:
- Web design: 20 hours at $100/hour
- Logo design: $500 flat rate
Due date: January 15, 2025
Currency: USD
```

### Invoice doesn't save to database

**Check:**
1. Supabase environment variables are correct in `.env`
2. Database table `invoices` exists (run migrations)
3. Check browser console for errors
4. Verify internet connection to Supabase

---

## 📊 Features Overview

| Feature | Status |
|---------|--------|
| Natural language invoice generation | ✅ Working |
| Multiple line items | ✅ Working |
| Automatic calculations | ✅ Working |
| Invoice dashboard | ✅ Working |
| Status management | ✅ Working |
| Database storage | ✅ Working |
| PDF export | ❌ Not implemented |
| Email sending | ❌ Not implemented |

---

## 🚀 Next Steps (Optional Enhancements)

Want to extend the AI Invoice Generator? Consider adding:

1. **PDF Generation**
   - Use `jsPDF` or `pdfmake`
   - Generate downloadable invoices

2. **Email Sending**
   - Use Supabase Edge Functions
   - Send invoices via email automatically

3. **Payment Integration**
   - Add Stripe payment links
   - Track payment status

4. **Templates**
   - Custom invoice templates
   - Company branding

5. **Multi-currency**
   - Automatic currency conversion
   - Exchange rate lookup

---

## 💻 Code Structure

```
src/
├── lib/
│   ├── openai.ts              # OpenAI integration
│   ├── invoices.ts            # Database operations
│   └── supabase.ts            # Supabase client
├── components/
│   ├── AIInvoiceGenerator.tsx # Main AI form
│   ├── InvoiceDashboard.tsx   # Invoice list/management
│   └── InvoiceGeneratorModal.tsx # Modal wrapper
```

---

## 📝 Environment Variables Summary

```bash
# Supabase (already configured)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (you need to add this)
VITE_OPENAI_API_KEY=sk-proj-your-key-here
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] API key added to `.env`
- [ ] Dev server restarted
- [ ] "Try AI Generator" button appears on features section
- [ ] Modal opens when clicked
- [ ] Can enter a prompt
- [ ] Invoice generates successfully
- [ ] Invoice appears in dashboard
- [ ] Can change invoice status
- [ ] Can delete invoices

---

## 📞 Getting Help

**OpenAI Issues:**
- [OpenAI Platform Status](https://status.openai.com/)
- [OpenAI Documentation](https://platform.openai.com/docs)
- [OpenAI Community](https://community.openai.com/)

**Supabase Issues:**
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com/)

**This Project:**
- Check browser console for errors (F12)
- Review `AI_INVOICE_SETUP.md` (this file)
- Check the troubleshooting section above

---

**Congratulations!** 🎉

You now have a fully functional AI-powered invoice generator!

Start creating invoices with natural language and let AI do the heavy lifting.
