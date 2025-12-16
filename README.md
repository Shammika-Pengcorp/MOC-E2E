# MOC E2E Playwright Tests ✅

This repository contains end-to-end automation tests for MOC (Management of Change) system using Playwright + TypeScript with Page Object Model (POM) pattern.

**🔗 Quick Links:**
- [View Latest Test Report](#-view-reports-now) 
- [GitHub Repository](https://github.com/Shammika-Pengcorp/MOC-E2E)
- [GitHub Actions](https://github.com/Shammika-Pengcorp/MOC-E2E/actions)

## Setup

1. Install dependencies:

```powershell
npm install
npx playwright install
```

2. (Optional) Set credentials via environment variables (recommended for CI):

```powershell
$env:MOC_USER = 'moc_requester1'
$env:MOC_PASS = 'admin'
```

3. Run tests:

```powershell
npm test
# or for headed mode
npm run test:headed
```

## Structure

- `src/pages/LoginPage.ts` — Page Object Model for the Keycloak login flow
- `src/tests/login.spec.ts` — Test using the POM
- `playwright.config.ts` — Playwright configuration (baseURL set to `https://moc.otdm.ca`)

## 📊 View Reports Now

### 🚀 View Latest Ortoni Report
After GitHub Actions completes, **click the link below** to view the report:

👉 **[View Ortoni Report - Latest Run](https://github.com/Shammika-Pengcorp/MOC-E2E/actions/runs/latest)**

**Steps:**
1. Click link above → Go to Actions
2. Click the **latest workflow run** at the top
3. Scroll to **"Artifacts"** section
4. Download **`ortoni-report.zip`** (single file)
5. Extract and open **`ortoni-report.html`** in browser

### Direct Links

- **[GitHub Actions](https://github.com/Shammika-Pengcorp/MOC-E2E/actions)** - View all workflow runs
- **[Latest Test Run](https://github.com/Shammika-Pengcorp/MOC-E2E/actions?query=workflow%3A%22MOC+E2E+Test+Suite%22)** - Direct link to test workflow

### Local Test Reports

Run tests locally to view reports immediately:

```powershell
npm test

# Open Ortoni Report
.\ortoni-report\ortoni-report.html
```

## 📊 Old Report Format

### GitHub Actions Workflow Reports

After running tests via GitHub Actions, access reports:

1. **Go to GitHub Actions**
   - Navigate to: `https://github.com/Shammika-Pengcorp/MOC-E2E/actions`
   - Click on the latest workflow run

2. **View Ortoni Report**
   - Scroll down to **"Artifacts"** section
   - Download **`ortoni-report.zip`** (single combined artifact)
   - Extract the ZIP file
   - Open `ortoni-report.html` in your browser

3. **View PR Comments** (if run on Pull Request)
   - Reports are automatically linked in PR comments
   - Click the report link to view directly

4. **View on GitHub Pages** (Optional - requires Pages setup)
   - After Pages is enabled, reports publish to: `https://Shammika-Pengcorp.github.io/MOC-E2E/`

### Local Test Reports

Run tests locally to view reports immediately:

```powershell
npm test

# Open Ortoni Report
npx playwright show-report

# Open in ortoni-report folder
.\ortoni-report\ortoni-report.html
```

## Workflow Triggers

Tests run automatically on:
- ✅ Push to `main` or `develop` branches
- ✅ Pull requests to `main` or `develop`
- ✅ Daily schedule (2 AM UTC)
- ✅ Manual dispatch via Actions tab

## Notes

- The test expects the app to redirect to Keycloak when visiting `/tabs/dashboard` and then redirect back on successful login.
- For sensitive credentials use CI secrets or environment variables, do not commit them.
- Ortoni Report provides comprehensive test analytics, screenshots, videos, and trace logs.