# MOC E2E Playwright Tests ✅

This repository contains a small Playwright + TypeScript test scaffold using Page Object Model (POM) and a login test for https://moc.otdm.ca.

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

## Notes

- The test expects the app to redirect to Keycloak when visiting `/tabs/dashboard` and then redirect back on successful login.
- For sensitive credentials use CI secrets or environment variables, do not commit them.

If you'd like, I can add more page objects, add visual regression, or wire this into your CI pipeline (GitHub Actions/Azure Pipelines).