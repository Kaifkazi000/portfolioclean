# Verify Your Setup - Step by Step

## Current Error
```
GitHub token not configured. Please set GITHUB_PERSONAL_ACCESS_TOKEN in environment variables.
```

This means the token is **not being read** by Next.js.

---

## ✅ Step-by-Step Fix

### Step 1: Check Your .env.local File

**Location:** `portfolio-1/.env.local` (same folder as `package.json`)

**Open the file** and verify it contains:

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_actual_token_here
GITHUB_USERNAME=Kaifkazi000
```

**Common Issues:**
- ❌ File is empty
- ❌ Token line is missing
- ❌ Token has quotes: `GITHUB_PERSONAL_ACCESS_TOKEN="ghp_..."`
- ❌ Token has spaces: `GITHUB_PERSONAL_ACCESS_TOKEN = ghp_...`
- ❌ Wrong file name: `.env` instead of `.env.local`

**Correct Format:**
```bash
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
GITHUB_USERNAME=Kaifkazi000
```

---

### Step 2: Verify Server Was Restarted

**CRITICAL:** Environment variables only load when the server **starts**.

1. **Check your terminal** where `npm run dev` is running
2. **Look for these logs:**
   ```
   [GitHub API] Token exists: true
   [GitHub API] Token length: 40
   [GitHub API] Username: Kaifkazi000
   ```

**If you see:**
- `Token exists: false` → Token not in file or wrong format
- No logs at all → Server wasn't restarted after adding token

**To Restart:**
1. Press `Ctrl + C` in terminal
2. Wait 2 seconds
3. Run `npm run dev`
4. Wait for "Ready" message
5. Check logs again

---

### Step 3: Test the API Route

Visit in browser:
```
http://localhost:3000/api/github-contributions
```

**Expected Success:**
```json
{
  "success": true,
  "data": {
    "totalContributions": 1234,
    ...
  }
}
```

**If Still Error:**
- Check terminal logs (Step 2)
- Verify file format (Step 1)
- Make sure file is saved

---

## 🔍 Debugging Checklist

Check each item:

- [ ] `.env.local` file exists in `portfolio-1/` folder
- [ ] File contains `GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...`
- [ ] Token starts with `ghp_`
- [ ] No quotes around token value
- [ ] No spaces around `=` sign
- [ ] File is saved (Ctrl+S)
- [ ] Server was stopped (Ctrl+C)
- [ ] Server was restarted (`npm run dev`)
- [ ] Terminal shows "Ready"
- [ ] Terminal shows `Token exists: true`

---

## 🚨 Still Not Working?

### Option 1: Check Terminal Logs

Look at your terminal output. You should see:
```
[GitHub API] Token exists: true/false
```

**If `false`:**
- Token not in file
- Wrong file format
- File not saved

**If you don't see these logs:**
- Server wasn't restarted
- API route not being called

### Option 2: Verify File Location

The file **must** be here:
```
portfolio-1/
  ├── .env.local          ← HERE
  ├── package.json
  ├── app/
  └── src/
```

**Not here:**
- ❌ `portfolio-1/src/.env.local`
- ❌ `portfolio-1/app/.env.local`
- ❌ Root folder (outside portfolio-1)

### Option 3: Regenerate Token

If token might be invalid:

1. Go to: https://github.com/settings/tokens
2. Generate new token
3. Copy it (starts with `ghp_`)
4. Paste into `.env.local`
5. Save file
6. **Restart server**

---

## ✅ Success Indicators

When it's working, you'll see:

1. **Terminal:**
   ```
   [GitHub API] Token exists: true
   [GitHub API] Token length: 40
   ```

2. **Browser (API route):**
   ```json
   { "success": true, "data": {...} }
   ```

3. **Frontend:**
   - "Live GitHub Data" badge (green)
   - Contribution calendar displays
   - Total contributions number shows

---

## Quick Test

After fixing, run this in your terminal:

```powershell
cd portfolio-1
Get-Content .env.local | Select-String "GITHUB"
```

You should see:
```
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
GITHUB_USERNAME=Kaifkazi000
```

If you see nothing or wrong format, fix the file and restart server.

