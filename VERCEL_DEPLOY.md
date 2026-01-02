# Deploy GitHub Contributions to Vercel - Quick Guide

## Step 1: Add Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your portfolio project
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

   ```
   GITHUB_PERSONAL_ACCESS_TOKEN = ghp_your_token_here
   GITHUB_USERNAME = Kaifkazi000
   ```

5. Click **Save** for each variable

## Step 2: Deploy

### Option A: Auto-deploy (if connected to GitHub)
- Just push your changes to GitHub:
  ```bash
  git add .
  git commit -m "Add GitHub contributions feature"
  git push
  ```
- Vercel will auto-deploy

### Option B: Manual deploy
- In Vercel dashboard, click **Deployments** → **Redeploy** (latest)

## Step 3: Verify

1. Wait for deployment to finish (2-3 minutes)
2. Visit your live site
3. Check the GitHub Activity section
4. Should show:
   - 2025: 14 contributions
   - 2026: 4 contributions

## Troubleshooting

If it doesn't work:
1. Check Vercel logs: **Deployments** → Click latest → **Functions** tab
2. Verify environment variables are set correctly
3. Make sure token has `public_repo` scope
4. Redeploy after adding env variables

## Done! 🚀

Your GitHub contributions are now live!


