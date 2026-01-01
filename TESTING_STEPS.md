# Testing Steps - After Adding GitHub Token

## ✅ Step 1: Verify Your .env.local File

Make sure your `.env.local` file is in the **root** of your project (`portfolio-1/.env.local`) and looks like this:

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_actual_token_here
GITHUB_USERNAME=Kaifkazi000
```

**Important:**
- ✅ File must be named `.env.local` (not `.env`)
- ✅ No quotes around the token value
- ✅ No spaces around the `=` sign
- ✅ File should be in `portfolio-1/` folder (same level as `package.json`)

---

## ✅ Step 2: Restart Your Development Server

**CRITICAL:** Environment variables only load when the server starts. You MUST restart:

1. **Stop the current server** (if running):
   - Press `Ctrl + C` in your terminal

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Wait for it to compile** - you should see:
   ```
   ✓ Ready in X seconds
   ○ Local: http://localhost:3000
   ```

---

## ✅ Step 3: Test the API Route Directly

Open your browser and visit:

```
http://localhost:3000/api/github-contributions
```

**Expected Result:**
You should see JSON data like:
```json
{
  "success": true,
  "data": {
    "totalContributions": 1234,
    "weeks": [...],
    "contributionDays": [...]
  }
}
```

**If you see an error:**
- ❌ `"Missing GITHUB_PERSONAL_ACCESS_TOKEN"` → Check Step 1, restart server
- ❌ `"Invalid GitHub token"` → Token might be wrong, regenerate it
- ❌ `"Rate limit exceeded"` → Wait 1 hour or check token permissions

---

## ✅ Step 4: Test the Frontend Component

1. **Open your portfolio website:**
   ```
   http://localhost:3000
   ```

2. **Scroll down to the GitHub Activity section** (it's between Projects and Certifications)

3. **What to look for:**
   - ✅ "Live GitHub Data" badge (green) should appear
   - ✅ Total contributions number should show
   - ✅ Contribution calendar grid should render
   - ✅ Calendar should show colored squares (green = contributions)

**If you see:**
- ❌ "Demo Data" badge → API call failed, check browser console
- ❌ Loading forever → Check network tab in browser DevTools
- ❌ Empty calendar → Check API route (Step 3)

---

## ✅ Step 5: Check Browser Console (If Issues)

1. **Open DevTools:**
   - Press `F12` or `Right-click → Inspect`
   - Go to **Console** tab

2. **Look for errors:**
   - Red errors = problems to fix
   - Check Network tab → look for `/api/github-contributions` request

3. **Common issues:**
   - `404` on API route → File might be in wrong location
   - `500` error → Check server terminal for error messages
   - `CORS` error → Shouldn't happen with Next.js API routes

---

## ✅ Step 6: Verify Everything Works

**Success Checklist:**
- [ ] API route returns JSON with `success: true`
- [ ] Frontend shows "Live GitHub Data" badge
- [ ] Total contributions number displays correctly
- [ ] Calendar grid renders with colored squares
- [ ] No errors in browser console
- [ ] No errors in terminal

---

## 🚀 Step 7: Deploy to Vercel (When Ready)

Once everything works locally:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add GitHub contributions API"
   git push
   ```

2. **Add Environment Variables in Vercel:**
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Go to **Settings → Environment Variables**
   - Add:
     - `GITHUB_PERSONAL_ACCESS_TOKEN` = your token
     - `GITHUB_USERNAME` = Kaifkazi000
   - Click **Save**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click **Redeploy** on latest deployment
   - Or push a new commit (auto-deploys)

4. **Test Production:**
   - Visit your Vercel URL
   - Test the API: `https://your-domain.vercel.app/api/github-contributions`
   - Check the frontend component

---

## 🐛 Troubleshooting

### Issue: "Token not found" even after adding to .env.local

**Solution:**
1. Make sure file is named `.env.local` (not `.env`)
2. Restart the dev server completely
3. Check file is in root directory (`portfolio-1/.env.local`)
4. Verify no typos in variable name

### Issue: API returns 401 "Invalid token"

**Solution:**
1. Regenerate token in GitHub
2. Make sure token starts with `ghp_`
3. Check token hasn't expired
4. Verify token has correct scopes (or none for public data)

### Issue: Calendar shows but all squares are dark (no contributions)

**Solution:**
- This is normal if you haven't made contributions this year
- Check API response - `totalContributions` should match what you see
- Contributions only count for current year (2025)

### Issue: Component doesn't appear on page

**Solution:**
1. Check `src/App.tsx` includes `<GitHubActivity />`
2. Scroll down past Projects section
3. Check browser console for React errors

---

## 📞 Need Help?

Check these files for more details:
- `GITHUB_CONTRIBUTIONS_GUIDE.md` - Full documentation
- `IMPLEMENTATION_SUMMARY.md` - Quick reference

