# Supabase Configuration Guide

This guide covers the Supabase settings you should check/configure for your authentication setup.

## Required Settings

### 1. **Service Role Key** ✅ (Already Configured)

- **Location:** Project Settings → API → `service_role` key
- **Status:** You already have this in your `env.local` file
- **Note:** Keep this secret! Never expose it to the frontend.

### 2. **Anon Key** (Optional but Recommended)

- **Location:** Project Settings → API → `anon` public key
- **Purpose:** Used for client-side operations (if needed)
- **Action:** You can add this to your env file as `SUPABASE_ANON_KEY` if you plan to use Supabase client-side

## Recommended Settings

### 3. **Email Confirmation Settings**

- **Location:** Authentication → Settings → Email Auth
- **Current Behavior:** Your code auto-confirms emails (`email_confirm: true`)
- **Recommendation:**
  - **For Development:** Disable email confirmation requirement
    - Go to: Authentication → Settings → Email Auth
    - Uncheck "Enable email confirmations"
  - **For Production:** Keep email confirmation enabled and remove `email_confirm: true` from code

### 4. **Email Templates** (Optional)

- **Location:** Authentication → Email Templates
- **Action:** Customize or disable email templates if you don't want confirmation emails sent
- **Note:** Since you're auto-confirming, users won't receive confirmation emails anyway

### 5. **Auth Providers**

- **Location:** Authentication → Providers
- **Required:** Email provider should be enabled (enabled by default)
- **Action:** Ensure "Email" provider is enabled

### 6. **Password Requirements**

- **Location:** Authentication → Settings → Password
- **Current:** Your code enforces minimum 6 characters
- **Action:** You can configure additional requirements in Supabase:
  - Minimum password length
  - Require uppercase, lowercase, numbers, special characters
  - **Note:** Your backend validation (6 chars) will run first, but Supabase can add additional rules

## Optional: Database Webhooks (Advanced)

If you want to sync users automatically when they're created directly in Supabase (bypassing your API), you can set up a webhook:

1. **Location:** Database → Webhooks
2. **Trigger:** `auth.users` table → `INSERT` event
3. **Action:** Call your API endpoint to create local user
4. **Note:** Not necessary since you're creating users through your API

## Security Settings

### 7. **Row Level Security (RLS)**

- **Location:** Database → Tables → `auth.users`
- **Status:** Not needed for your setup since you're using:
  - Service role key for admin operations (bypasses RLS)
  - Your own PostgreSQL database for user data
- **Note:** RLS is for Supabase's database tables, not your external database

### 8. **API Rate Limiting**

- **Location:** Project Settings → API
- **Action:** Review and adjust rate limits if needed
- **Default:** Usually sufficient for most applications

## Environment Variables Summary

Your current setup requires:

```env
SUPABASE_URL=https://fsipekvkipekcaxluhcf.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Optional (for client-side operations):

```env
SUPABASE_ANON_KEY=your_anon_key
```

## Quick Checklist

- [x] Service Role Key configured in env file
- [ ] Email confirmation disabled (for development) or enabled (for production)
- [ ] Email provider enabled
- [ ] Password requirements configured (optional)
- [ ] API rate limits reviewed (optional)

## Testing Your Setup

1. **Test Sign Up:**

   ```bash
   curl -X POST http://localhost:3000/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Check Supabase Dashboard:**
   - Go to Authentication → Users
   - Verify the user was created

3. **Check Your Database:**
   - Verify the user was also created in your local `users` table

## Common Issues

### Issue: "User already registered"

- **Cause:** User exists in Supabase but not in your local DB
- **Solution:** The `/users/me` endpoint will auto-create the local user

### Issue: Email confirmation required

- **Cause:** Email confirmation is enabled in Supabase but user isn't confirmed
- **Solution:** Disable email confirmation in Supabase settings OR ensure `email_confirm: true` is in your signup code (already done)

### Issue: Service role key not working

- **Cause:** Wrong key or key doesn't have admin permissions
- **Solution:** Verify you're using the `service_role` key, not the `anon` key

## Production Considerations

1. **Email Confirmation:**
   - Remove `email_confirm: true` from code
   - Enable email confirmation in Supabase
   - Users will receive confirmation emails

2. **Password Requirements:**
   - Increase minimum length (e.g., 8+ characters)
   - Add complexity requirements in Supabase

3. **Rate Limiting:**
   - Configure appropriate limits for your use case
   - Consider implementing additional rate limiting in your NestJS app

4. **Security:**
   - Never expose service role key to frontend
   - Use environment variables for all secrets
   - Enable HTTPS in production
