# 🚀 Push MOC E2E to GitHub - Complete Guide

## ✅ Prerequisites Completed

- ✅ Git installed and configured
- ✅ Local repository initialized
- ✅ All changes committed
- ✅ GitHub Actions workflows created

## 📋 Step-by-Step Instructions

### Option 1: Using GitHub CLI (Recommended - Faster)

#### Install GitHub CLI
```powershell
winget install GitHub.cli
```

#### Authenticate with GitHub
```powershell
gh auth login
# Choose: GitHub.com
# Choose: HTTPS
# Authenticate your account
```

#### Create and Push Repository
```powershell
cd "c:\Users\ShammikaDahanayaka\OneDrive - Pengcorp LTD\MOC-E2E"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Create repository (public or private)
gh repo create MOC-E2E --public --source=. --remote=origin --push

# Or use private:
# gh repo create MOC-E2E --private --source=. --remote=origin --push
```

---

### Option 2: Manual GitHub Setup (Without GitHub CLI)

#### Step 1: Create Repository on GitHub
1. Go to: https://github.com/new
2. Enter Repository name: `MOC-E2E`
3. Description: `End-to-End Automation Testing for MOC System using Playwright with POM and Ortoni Reports`
4. Choose: **Public** (for GitHub Actions workflow visibility)
5. **DO NOT** check:
   - ✅ Initialize this repository with a README
   - ✅ Add .gitignore
   - ✅ Choose a license
6. Click **"Create repository"**

#### Step 2: Push Local Repository
```powershell
cd "c:\Users\ShammikaDahanayaka\OneDrive - Pengcorp LTD\MOC-E2E"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Rename branch to main (if needed)
git branch -M main

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/MOC-E2E.git

# Push to GitHub
git push -u origin main

# Verify
git remote -v
```

---

## 🔐 Authentication Options

### Option A: HTTPS with Personal Access Token (Recommended)
```powershell
# When prompted for password during git push, use:
# Username: YOUR_GITHUB_USERNAME
# Password: YOUR_PERSONAL_ACCESS_TOKEN

# Create token: https://github.com/settings/tokens
# Scopes needed: repo, workflow
```

### Option B: SSH (Advanced)
```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "shammika@pengcorp.com"

# Add to GitHub: https://github.com/settings/keys

# Use SSH URL instead:
git remote set-url origin git@github.com:YOUR_USERNAME/MOC-E2E.git
```

---

## 📊 After Pushing to GitHub

### 1. Enable GitHub Actions
1. Go to: `https://github.com/YOUR_USERNAME/MOC-E2E/settings/actions`
2. Ensure "Actions permissions" is enabled
3. Allow all actions and reusable workflows

### 2. Monitor Workflows (Optional)
1. Go to Actions tab: `https://github.com/YOUR_USERNAME/MOC-E2E/actions`
2. Click on the workflow run to see real-time progress
3. View logs for each test step

### 3. Enable GitHub Pages (Optional - for Report Hosting)
1. Go to: Settings → Pages
2. Source: Deploy from branch
3. Branch: `gh-pages`
4. Folder: `/ (root)`
5. Save
6. Reports will be available at: `https://YOUR_USERNAME.github.io/MOC-E2E/`

---

## 🔄 Triggering Workflows

### Automatic Triggers
Workflows will run automatically when:
- ✅ Push to `main` or `develop` branch
- ✅ Pull request to `main` or `develop`
- ✅ Daily at 2 AM UTC (scheduled)

### Manual Trigger
1. Go to **Actions** tab
2. Select workflow: **"MOC E2E Test Suite"**
3. Click **"Run workflow"**
4. Select branch
5. Click **"Run workflow"**

---

## 📈 Monitoring Workflow Execution

### Real-Time Monitoring
1. Go to Actions tab
2. Click on the running workflow
3. Watch progress in real-time
4. Expand each test step to see logs

### After Completion
1. **Artifacts Section**: Download reports
   - `ortoni-report-18.x`
   - `ortoni-report-20.x`
   - `playwright-report-18.x`
   - `playwright-report-20.x`

2. **View Ortoni Report**:
   - Download artifact
   - Extract ZIP file
   - Open `ortoni-report.html` in browser

3. **GitHub Pages**:
   - If enabled, visit: `https://YOUR_USERNAME.github.io/MOC-E2E/`
   - Reports auto-updated after each run

---

## 🚨 Troubleshooting

### Problem: Authentication Failed
**Solution:**
```powershell
# Clear cached credentials
git credential-manager-core erase

# Try push again (will prompt for credentials)
git push -u origin main
```

### Problem: "Permission denied (publickey)"
**Solution:**
- You're using SSH URL but SSH key not configured
- Either: Switch to HTTPS or setup SSH key

### Problem: Workflows Not Running
**Solution:**
1. Check Actions are enabled in Settings
2. Ensure branch is `main` or `develop`
3. Check `.github/workflows/` files exist
4. Manually trigger workflow from Actions tab

### Problem: Tests Timeout
**Solution:**
1. Increase timeout in workflow (currently 120 min)
2. Check MOC application is accessible
3. Review test logs in Ortoni Report

---

## 📝 Commands Quick Reference

```powershell
# Setup
git config --global user.name "Shammika Dahanayaka"
git config --global user.email "shammika@pengcorp.com"

# Navigate to project
cd "c:\Users\ShammikaDahanayaka\OneDrive - Pengcorp LTD\MOC-E2E"

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Git operations
git status                          # Check status
git add .                          # Stage changes
git commit -m "message"            # Commit
git push -u origin main            # Push to GitHub
git pull origin main               # Pull from GitHub
git log --oneline -10              # View commits
git remote -v                      # View remotes
```

---

## ✨ What Happens Next

1. **Push to GitHub** → GitHub detects `.github/workflows/` files
2. **Workflows Activate** → Automatically run on triggers
3. **Tests Execute** → All 5 tests run sequentially
4. **Reports Generate** → Ortoni + Playwright reports created
5. **Artifacts Available** → Download from Actions tab
6. **GitHub Pages** → Reports published (if enabled)

---

## 🎯 Success Criteria

After pushing, you should see:
- ✅ Repository on GitHub.com
- ✅ Files visible in repository
- ✅ `.github/workflows/` folder visible
- ✅ Actions tab shows workflows
- ✅ Workflow runs on push/schedule

---

## 📞 Support

- **Playwright Docs**: https://playwright.dev
- **GitHub Actions**: https://docs.github.com/en/actions
- **Ortoni Report**: https://github.com/ortoniKC/ortoni-report
- **GitHub Pages**: https://docs.github.com/en/pages

---

**Ready? Follow Option 1 or Option 2 above to push your code! 🚀**
