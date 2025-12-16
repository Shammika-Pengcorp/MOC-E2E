# ✅ MOC E2E - GitHub Push Checklist

## Current Status
- ✅ Local Git repository initialized
- ✅ All files committed locally
- ✅ GitHub Actions workflows created
- ✅ Ortoni Report integrated
- ⏳ Ready to push to GitHub

## What You Need to Do

### 1. Create GitHub Repository
Go to: **https://github.com/new**

**Fill in:**
- Repository name: `MOC-E2E`
- Description: `End-to-End Automation Testing for MOC System - Playwright, POM, Ortoni Reports`
- Visibility: **Public** (recommended for GitHub Actions)
- ❌ **DO NOT** initialize with README, .gitignore, or license

**Click:** Create repository

### 2. Get Your GitHub Username
- Your username is visible at: **https://github.com/settings/profile**
- Example: `your-username`

### 3. Push Code to GitHub

**Run these commands in PowerShell:**

```powershell
# Set PATH for Git
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Navigate to project
cd "c:\Users\ShammikaDahanayaka\OneDrive - Pengcorp LTD\MOC-E2E"

# Setup remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/MOC-E2E.git

# Ensure main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**When prompted:**
- Username: `YOUR_GITHUB_USERNAME`
- Password: Use a **Personal Access Token** (see below)

### 4. Create Personal Access Token (if needed)

If you get authentication errors, create a token:

1. Go to: https://github.com/settings/tokens
2. Click: **"Generate new token (classic)"**
3. Give it a name: `MOC-E2E-Push`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click: **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Use token as password during git push

### 5. Verify Push Was Successful

```powershell
# Check remote
git remote -v

# You should see:
# origin  https://github.com/YOUR_USERNAME/MOC-E2E.git (fetch)
# origin  https://github.com/YOUR_USERNAME/MOC-E2E.git (push)
```

Then visit: **https://github.com/YOUR_USERNAME/MOC-E2E**

You should see all your files and folders!

---

## 🔄 Monitoring GitHub Actions Workflow

### Step 1: Go to Actions Tab
- URL: `https://github.com/YOUR_USERNAME/MOC-E2E/actions`

### Step 2: Trigger Workflow (Manual)
1. Click **"MOC E2E Test Suite"** workflow
2. Click **"Run workflow"** button
3. Select branch: **main**
4. Click **"Run workflow"**

### Step 3: Watch Execution
- Workflows run in real-time
- See each test status
- Watch logs as they generate

### Step 4: Check Reports
After completion (takes ~5-10 minutes):
1. Scroll down to **"Artifacts"** section
2. Download `ortoni-report-18.x` or `ortoni-report-20.x`
3. Extract ZIP file
4. Open `ortoni-report.html` in browser

---

## 📊 Expected Workflow Output

### Test Execution Order
```
✅ Test 1: MOC Requester (01-moc-requester.spec.ts)
✅ Test 2: MOC Coordinator (02-moc-coordinator.spec.ts)
✅ Test 3: MOC Acceptor (03-moc-acceptor.spec.ts)
⚠️  Test 4: MOC Owner Section 3 (04-moc-owner-section3.spec.ts) - Known issue
✅ Test 5: MOC Owner Section 4 (05-moc-owner-section4.spec.ts)
```

### Artifacts Generated
- Ortoni Report (comprehensive dashboard)
- Playwright HTML Report
- Screenshots (on failure)
- Videos (on failure)
- Test Traces

---

## 🆘 Troubleshooting

### Error: "fatal: remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/MOC-E2E.git
git push -u origin main
```

### Error: "Authentication failed"
1. Generate Personal Access Token (steps above)
2. Use token as password when prompted
3. Save credentials for future use

### Error: "fatal: No commits yet"
```powershell
git log --oneline
```
Should show at least 1 commit. If not, run:
```powershell
git add .
git commit -m "Initial commit"
```

### Workflow Not Running
1. Check: `.github/workflows/` files exist in repository
2. Check: Branch is `main`
3. Check: Actions are enabled in Settings
4. Manual trigger: Use "Run workflow" button

---

## ✨ Quick Commands Reference

```powershell
# Setup PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Navigate
cd "c:\Users\ShammikaDahanayaka\OneDrive - Pengcorp LTD\MOC-E2E"

# Check status
git status
git log --oneline -1

# Push (after setup)
git push origin main

# Pull latest
git pull origin main
```

---

## 🎯 Success Indicators

✅ Repository exists at `https://github.com/YOUR_USERNAME/MOC-E2E`
✅ Files are visible in repository
✅ `.github/workflows/` folder is visible
✅ Actions tab shows workflows
✅ Can manually trigger workflow
✅ Tests run and generate reports

---

**Ready to push? Start with: Create Repository → Get Username → Push Code → Monitor Actions! 🚀**
