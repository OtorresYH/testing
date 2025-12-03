# Supabase Auth Configuration

This document contains important security configurations for Supabase Auth.

## ⚠️ CRITICAL: Enable Leaked Password Protection

Supabase Auth can check passwords against the HaveIBeenPwned database to prevent users from using compromised passwords.

### How to Enable

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Policies** (or **Settings**)
4. Find **"Leaked Password Protection"** or **"Password Protection"**
5. Toggle it **ON**

### What This Does

- Checks user passwords against HaveIBeenPwned.org database
- Prevents users from registering with known compromised passwords
- Blocks login attempts with compromised passwords
- Forces password change if a breach is detected

### Additional Security Settings

While in the Supabase Auth settings, also verify:

#### Email Settings
- [ ] **Email confirmation required** - Verify users own their email
- [ ] **Double opt-in** - Require email confirmation before activation

#### Password Requirements
- [ ] **Minimum password length**: 8 characters (recommended: 12+)
- [ ] **Password complexity**: Consider requiring mixed case, numbers, symbols

#### Rate Limiting
- [ ] **Login rate limiting** - Prevent brute force attacks
- [ ] **Email rate limiting** - Prevent spam

#### Session Management
- [ ] **Session timeout**: Configure appropriate timeout (default: 1 hour)
- [ ] **Refresh token rotation**: Enabled for security

#### MFA (Multi-Factor Authentication)
- [ ] **Enable MFA** - Allow users to add 2FA for extra security

## Environment-Specific Settings

### Development
- Email confirmation: Optional (for easier testing)
- Rate limiting: Relaxed

### Production
- Email confirmation: **REQUIRED**
- Leaked password protection: **ENABLED**
- Rate limiting: **STRICT**
- MFA: **AVAILABLE**

## Current Configuration Status

### ✅ Already Configured
- Email/password authentication enabled
- Row Level Security on all tables
- Secure session management
- Auth state persistence

### ⚠️ Action Required
- [ ] Enable leaked password protection (dashboard setting)
- [ ] Configure email confirmation (optional)
- [ ] Set up rate limiting (optional)
- [ ] Enable MFA (optional)

## Testing Auth Security

After enabling these settings, test:

1. **Leaked Password Protection**
   ```
   Try signing up with password: "password123"
   Expected: Should be rejected as compromised
   ```

2. **Email Confirmation**
   ```
   Sign up with new email
   Expected: Requires email verification before login
   ```

3. **Rate Limiting**
   ```
   Try 10 failed login attempts rapidly
   Expected: Should be temporarily blocked
   ```

## Monitoring

Monitor your auth security in Supabase Dashboard:
- Authentication → Users (user activity)
- Authentication → Logs (auth events)
- Authentication → Rate Limits (blocked attempts)

## Documentation

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Password Protection](https://supabase.com/docs/guides/auth/auth-password-protection)
- [Rate Limiting](https://supabase.com/docs/guides/auth/auth-rate-limits)
- [MFA Setup](https://supabase.com/docs/guides/auth/auth-mfa)

---

**Important**: These settings are configured in the Supabase Dashboard, not via code or migrations. Make sure to apply them before going to production!
