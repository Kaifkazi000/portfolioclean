# Debugging 500 Error - Step by Step

## Step 1: Check Server Terminal

Look at your terminal where `npm run dev` is running. You should see error messages like:

```
[GitHub API] Unexpected error: ...
[GitHub API] Error message: ...
```

**Copy the full error message** - this will tell us what's wrong.

---

## Step 2: Common Issues & Fixes

### Issue 1: Token Not Loaded

**Symptoms:**
- Error: "Missing GITHUB_PERSONAL_ACCESS_TOKEN"
- Status: 500

**Fix:**
1. Make sure `.env.local` is in the **root** folder (`portfolio-1/.env.local`)
2. Restart the dev server completely:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```
3. Check `.env.local` format:
   ```bash
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   GITHUB_USERNAME=Kaifkazi000
   ```
   - No quotes around values
   - No spaces around `=`
   - Token starts with `ghp_`

### Issue 2: Invalid Token Format

**Symptoms:**
- Error: "Invalid GitHub token"
- Status: 401

**Fix:**
1. Regenerate token at: https://github.com/settings/tokens
2. Make sure token starts with `ghp_`
3. Update `.env.local` and restart server

### Issue 3: GraphQL Query Error

**Symptoms:**
- Error in server logs about GraphQL
- Status: 500

**Fix:**
- Check if username is correct
- Verify token has correct permissions

### Issue 4: Network/Connection Error

**Symptoms:**
- Error: "fetch failed" or network error
- Status: 500

**Fix:**
- Check internet connection
- GitHub API might be down (rare)

---

## Step 3: Test API Directly

Open browser and visit:
```
http://localhost:3000/api/github-contributions
```

**What you should see:**

✅ **Success:**
```json
{
  "success": true,
  "data": {
    "totalContributions": 1234,
    ...
  }
}
```

❌ **Error:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

**Copy the error message** from the JSON response.

---

## Step 4: Check Environment Variables

Run this in your terminal (PowerShell):

```powershell
cd portfolio-1
Get-Content .env.local
```

**Expected output:**
```
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_USERNAME=Kaifkazi000
```

**If you see:**
- Empty file → Token not saved
- Wrong format → Fix the format
- File not found → Create `.env.local` in root folder

---

## Step 5: Verify Token

1. Go to: https://github.com/settings/tokens
2. Find your token (or generate new one)
3. Make sure it's **not expired**
4. Copy the full token (starts with `ghp_`)
5. Paste into `.env.local` (no quotes, no spaces)

---

## Step 6: Restart Everything

1. **Stop server:** Press `Ctrl+C` in terminal
2. **Wait 2 seconds**
3. **Start server:** `npm run dev`
4. **Wait for:** `✓ Ready in X seconds`
5. **Test again:** Visit `http://localhost:3000/api/github-contributions`

---

## Still Not Working?

**Share these details:**

1. **Error message from server terminal** (the red text)
2. **Error message from browser** (visit `/api/github-contributions`)
3. **Contents of `.env.local`** (hide the actual token, just show format)
4. **Next.js version:** Check `package.json`

This will help identify the exact issue!

