# Vercel Deployment Guide for arkana.chat

## Current Status
- ✅ Website builds successfully locally
- ✅ Code pushed to GitHub: https://github.com/Avopenka/arkana-website-landing
- ❌ Vercel CLI has TLS errors (SSL_ERROR_SYSCALL)
- ❌ Auto-deployment appears to be disabled

## Manual Deployment Options

### Option 1: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Click "New Project" or "Import Project"
3. Connect your GitHub account if not already connected
4. Select the repository: `Avopenka/arkana-website-landing`
5. Configure build settings:
   - Framework Preset: Next.js (should auto-detect)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
6. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   JWT_SECRET=your_jwt_secret_32_chars
   NEXT_PUBLIC_SITE_URL=https://arkana.chat
   ```
7. Click "Deploy"

### Option 2: Fix Vercel CLI TLS Issues
Try these solutions in order:

1. **Update Node.js and npm**:
   ```bash
   brew update
   brew upgrade node
   npm install -g npm@latest
   ```

2. **Reinstall Vercel CLI**:
   ```bash
   npm uninstall -g vercel
   npm install -g vercel@latest
   ```

3. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

4. **Use different network**:
   - Try a different WiFi network or mobile hotspot
   - Disable VPN if using one
   - Check firewall settings

5. **Use Vercel CLI with proxy**:
   ```bash
   export HTTPS_PROXY=""
   export HTTP_PROXY=""
   export NODE_TLS_REJECT_UNAUTHORIZED=0
   vercel --prod
   ```

### Option 3: Deploy via GitHub Integration
1. Ensure your repository is public or Vercel has access
2. In Vercel Dashboard:
   - Go to Project Settings → Git
   - Enable "Production Branch" deployments for `main`
   - Save changes
3. Future pushes to `main` will auto-deploy

### Option 4: Manual Build Upload
1. Build locally:
   ```bash
   cd /Users/av/Documents/Arkana/Websites/ArkanaWebsiteLanding/Websites/arkana-website-clean
   npm run build
   ```

2. Create deployment package:
   ```bash
   zip -r deployment.zip .next package.json next.config.js public
   ```

3. Use Vercel Dashboard to upload the zip file manually

## Custom Domain Setup
Once deployed:
1. Go to Project Settings → Domains
2. Add `arkana.chat`
3. Update DNS records:
   - A Record: Point to Vercel's IP (76.76.21.21)
   - CNAME: www subdomain to cname.vercel-dns.com

## Verification Steps
1. Check deployment at: https://[your-project-name].vercel.app
2. Monitor build logs in Vercel Dashboard
3. Test all routes and functionality
4. Verify environment variables are working

## Troubleshooting
- If builds fail: Check build logs for missing dependencies
- If domain doesn't work: Verify DNS propagation (can take 24-48 hours)
- If SSL errors persist: Contact Vercel support with error details

## Next Steps
1. Complete deployment via Vercel Dashboard (Option 1)
2. Configure custom domain
3. Set up production environment variables
4. Enable automatic deployments for future updates