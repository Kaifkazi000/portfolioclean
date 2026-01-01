# Fix: GitHub Token Not Found

## Problem
Your `.env.local` file exists but is **empty** or the token isn't being read.

## Solution: Add Token to .env.local

### Step 1: Open the file
Open `portfolio-1/.env.local` in a text editor (VS Code, Notepad++, etc.)

### Step 2: Add these lines
```bash
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_actual_token_here
GITHUB_USERNAME=Kaifkazi000
```

**Important:**
- Replace `ghp_your_actual_token_here` with your **actual token** from GitHub
- No quotes around the token
- No spaces around the `=` sign
- Token should start with `ghp_`

### Step 3: Save the file
Save the file (Ctrl+S)

### Step 4: Restart the dev server
**CRITICAL:** Environment variables only load when the server starts!

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

### Step 5: Test again
Visit: `http://localhost:3000/api/github-contributions`

You should now see:
```json
{
  "success": true,
  "data": {
    "totalContributions": 1234,
    ...
  }
}
```

---

## Example .env.local file

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
GITHUB_USERNAME=Kaifkazi000
```

---

## Still not working?

1. **Check file location:** Must be `portfolio-1/.env.local` (same folder as `package.json`)
2. **Check file name:** Must be exactly `.env.local` (not `.env`, not `env.local`)
3. **Check format:** No quotes, no spaces around `=`
4. **Restart server:** Always restart after changing `.env.local`
5. **Check token:** Make sure token is valid and starts with `ghp_`

---

## Quick Test

After adding the token and restarting, check your terminal. You should see:
```
[GitHub API] Token exists: true
[GitHub API] Token length: 40
[GitHub API] Username: Kaifkazi000
```

If you see `Token exists: false`, the token isn't being read - check the file format and location.

