# Quick Fix: 500 Error - Token Not Found

## The Problem
You're getting a 500 error because the GitHub token isn't being read from `.env.local`.

## The Solution (3 Steps)

### ✅ Step 1: Add Token to .env.local

1. **Open the file:** `portfolio-1/.env.local`
2. **Add these exact lines** (replace with YOUR actual token):
   ```bash
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_actual_token_here
   GITHUB_USERNAME=Kaifkazi000
   ```
3. **Save the file** (Ctrl+S)

**Important:**
- Replace `ghp_your_actual_token_here` with your real token
- No quotes, no spaces around `=`
- Token must start with `ghp_`

### ✅ Step 2: RESTART THE SERVER

**This is CRITICAL!** Environment variables only load when the server starts.

1. **Stop the server:**
   - Go to your terminal
   - Press `Ctrl + C`

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Wait for:**
   ```
   ✓ Ready in X seconds
   ```

### ✅ Step 3: Test

1. **Visit:** `http://localhost:3000/api/github-contributions`
2. **You should see:**
   ```json
   {
     "success": true,
     "data": { ... }
   }
   ```

---

## Verify It's Working

After restarting, check your **terminal** (where `npm run dev` is running). You should see:

```
[GitHub API] Token exists: true
[GitHub API] Token length: 40
[GitHub API] Username: Kaifkazi000
```

If you see `Token exists: false`, the token isn't being read - check Step 1 again.

---

## Still Not Working?

### Check 1: File Location
- File must be: `portfolio-1/.env.local`
- Same folder as `package.json`

### Check 2: File Name
- Must be exactly `.env.local`
- Not `.env` or `env.local`

### Check 3: File Format
```bash
# ✅ CORRECT:
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_abc123...

# ❌ WRONG:
GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_abc123..."  # No spaces, no quotes
GITHUB_PERSONAL_ACCESS_TOKEN='ghp_abc123...'     # No quotes
```

### Check 4: Server Restart
- Did you restart after adding the token?
- Check terminal for the "Ready" message

---

## Get Your Token

If you don't have a token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Portfolio API")
4. Select expiration (30 days, 90 days, or no expiration)
5. **No scopes needed** for public data
6. Click "Generate token"
7. **Copy the token immediately** (starts with `ghp_`)
8. Paste into `.env.local`

---

## Test Checklist

- [ ] `.env.local` file exists in `portfolio-1/` folder
- [ ] Token is added (starts with `ghp_`)
- [ ] No quotes around token
- [ ] No spaces around `=`
- [ ] File is saved
- [ ] Server was stopped and restarted
- [ ] Terminal shows "Ready"
- [ ] API route returns `success: true`

Once all checked, it should work! 🎉

