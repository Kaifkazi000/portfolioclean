# Quick Fix: Clear Cache to See 2025 Contributions

## The Problem
You have 14 contributions in 2025 but it's showing 0. This is likely due to cached empty data.

## Quick Fix: Clear Browser Cache

### Option 1: Clear localStorage (Easiest)

1. **Open your browser console:**
   - Press `F12` or `Right-click → Inspect`
   - Go to **Console** tab

2. **Run this command:**
   ```javascript
   localStorage.clear()
   ```

3. **Refresh the page** (F5)

### Option 2: Clear Specific Cache

In browser console, run:
```javascript
// Clear only GitHub contribution cache
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  if (key && key.startsWith('github_contributions_')) {
    localStorage.removeItem(key)
    console.log('Removed:', key)
  }
}
```

Then refresh the page.

---

## Check the Logs

After clearing cache and refreshing, check:

1. **Browser Console** (F12 → Console):
   - Look for `[GitHubActivity]` logs
   - Should show: `Total contributions: 14` (or your actual number)

2. **Server Terminal** (where `npm run dev` is running):
   - Look for `[GitHub API]` logs
   - Should show: `Year 2025 - Total contributions: 14`

---

## If Still Showing 0

### Check 1: API Response
Visit in browser:
```
http://localhost:3000/api/github-contributions?year=2025
```

You should see JSON with:
```json
{
  "success": true,
  "data": {
    "totalContributions": 14,
    ...
  }
}
```

### Check 2: Date Range
The API might be using wrong dates. Check server logs for:
```
[GitHub API] Year range for 2025: { from: "2025-01-01T00:00:00.000Z", to: "2025-12-31T23:59:59.000Z" }
```

### Check 3: GitHub Username
Make sure `GITHUB_USERNAME` in `.env.local` matches your GitHub username.

---

## Force Fresh Fetch

If cache clearing doesn't work, the API might not be fetching correctly. Check:
1. Server terminal for API logs
2. Browser Network tab → look for `/api/github-contributions?year=2025`
3. Check the response in Network tab

