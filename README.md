# MOC E2E Playwright Tests ✅

This repository contains end-to-end automation tests for MOC (Management of Change) system using Playwright + TypeScript with Page Object Model (POM) pattern.

**🔗 Quick Links:**
- **📊 [View Latest Test Report](https://github.com/Shammika-Pengcorp/MOC-E2E/actions?query=workflow%3A%22MOC+E2E+Test+Suite%22)** ⭐
- [GitHub Repository](https://github.com/Shammika-Pengcorp/MOC-E2E)
- [GitHub Actions](https://github.com/Shammika-Pengcorp/MOC-E2E/actions)

## Setup

### Install Dependencies
```powershell
npm install
npx playwright install
```

### Run Tests
```powershell
npm test                    # Run all tests
npm run test:headed         # Run in headed mode
```

### Set Credentials (Optional)
```powershell
$env:MOC_USER = 'moc_requester1'
$env:MOC_PASS = 'admin'
```

---

## 📊 View Test Reports

### From GitHub Actions
👉 **[Click Here to View Latest Test Report](https://github.com/Shammika-Pengcorp/MOC-E2E/actions?query=workflow%3A%22MOC+E2E+Test+Suite%22)**

**Steps:**
1. Click link above
2. Select the latest workflow run
3. Scroll down to **"Artifacts"** section
4. Download **`ortoni-report.zip`**
5. Extract and open **`ortoni-report.html`**

### Locally
```powershell
.\ortoni-report\ortoni-report.html
```

---

## 📁 Project Structure

```
src/
├── pages/           # Page Object Models
├── test-data/       # Test data (MOC numbers)
└── tests/           # Test specs (25+ test cases)

.github/workflows/   # GitHub Actions CI/CD
```

---

## 🧪 Test Cases (25+)

- **12 Login Tests** (TC-001 to TC-012)
- **6 Navigation Tests** (TC-013 to TC-018)
- **7 Workflow Tests** (TC-019 to TC-025)
- **5 MOC Lifecycle Tests** (01-05)

---

## ⚙️ Features

✅ Page Object Model (POM)  
✅ Keycloak SSO Login  
✅ Ortoni Report Analytics  
✅ GitHub Actions CI/CD  
✅ Screenshots & Video on Failure  
✅ Trace Logs  

---

## 🔗 Links

- [GitHub Repo](https://github.com/Shammika-Pengcorp/MOC-E2E)
- [Actions](https://github.com/Shammika-Pengcorp/MOC-E2E/actions)
- [Latest Run](https://github.com/Shammika-Pengcorp/MOC-E2E/actions?query=workflow%3A%22MOC+E2E+Test+Suite%22)