# GitHub Actions - MOC E2E Test Suite

This directory contains GitHub Actions workflows for automating the MOC E2E test suite.

## Workflows

### 1. `moc-e2e-tests.yml` - Main Test Suite
Runs all MOC E2E tests sequentially with Ortoni Report generation.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Daily schedule (2 AM UTC)
- Manual workflow dispatch

**Tests Executed (Sequential):**
1. MOC Requester (01-moc-requester.spec.ts)
2. MOC Coordinator (02-moc-coordinator.spec.ts)
3. MOC Acceptor (03-moc-acceptor.spec.ts)
4. MOC Owner Section 3 (04-moc-owner-section3.spec.ts)
5. MOC Owner Section 4 (05-moc-owner-section4.spec.ts)

**Features:**
- Runs on Windows Latest (compatible with MOC application)
- Tests on Node.js 18.x and 20.x
- Generates Ortoni Report for each test run
- Merges reports for consolidated view
- Uploads artifacts (reports, screenshots, videos, traces)
- Publishes to GitHub Pages
- Comments on PRs with report links
- Timeout: 120 minutes

### 2. `moc-e2e-report.yml` - Extended Reporting
Triggered after main test suite completes. Generates comprehensive report summary.

**Features:**
- Downloads all artifacts from test run
- Generates detailed report summary
- Captures execution metadata
- Timestamps all runs

## Artifacts Generated

Each test run produces:
- **Ortoni Report** - Comprehensive test analytics dashboard
  - Test summary with pass/fail metrics
  - Individual test details with logs
  - Screenshots on failure
  - Videos on failure
  - Test traces
  - Performance analytics

- **Playwright HTML Report** - Standard Playwright reporter
- **Screenshots & Videos** - Captured on test failure
- **Test Traces** - For debugging via Playwright Inspector

## Accessing Reports

### Option 1: Artifacts in GitHub Actions
1. Go to workflow run in Actions tab
2. Scroll down to "Artifacts"
3. Download `ortoni-report-*` or `playwright-report-*`

### Option 2: GitHub Pages (if configured)
Reports are published to: `https://username.github.io/MOC-E2E/reports/`

### Option 3: PR Comments
For pull requests, a comment is automatically added with direct links to reports.

## Configuration

### Environment Setup
All required dependencies are installed in the workflow:
- Node.js (18.x and 20.x)
- Playwright browsers
- Ortoni Report
- npm packages from package-lock.json

### Test Configuration
Tests use the following settings:
- Timeout: 90 seconds per test
- Browser: Chromium
- Headless: true (CI environment)
- Screenshots: On failure
- Videos: On failure
- Traces: On failure
- Workers: 1 (sequential execution)

### Report Configuration
Ortoni Report is configured with:
- **Project**: MOC System Automation
- **Test Type**: E2E - MOC Workflow
- **Metadata**:
  - Test Cycle: December 2025
  - Version: 1.0
  - Platform: Windows/Linux
  - Environment: QA

## Running Workflows

### Automatic Triggers
- Workflows run automatically on push/PR to main/develop
- Daily scheduled run at 2 AM UTC

### Manual Trigger
1. Go to GitHub Actions tab
2. Select workflow
3. Click "Run workflow"
4. Choose branch
5. Click "Run workflow"

## Secrets Required

The workflows use the following secrets (if needed):
- `GITHUB_TOKEN` - Automatically available
- Custom secrets can be added in repository settings

## Report Interpretation

### Ortoni Report Dashboard
- **Summary**: Total tests, pass rate, duration
- **Tests Tab**: Individual test execution details
- **Analytics**: Trends over time, flaky tests, slowest tests
- **Glance**: Tabular view of all tests

### Key Metrics
- ✅ Pass Rate: Percentage of passing tests
- ⏱️ Duration: Average test execution time
- 📊 Trends: Performance over last 30 runs
- ⚠️ Flaky Tests: Tests with inconsistent results
- 🐢 Slowest Tests: Tests taking longest

## Troubleshooting

### Workflow Fails to Start
- Check branch is `main` or `develop`
- Verify `.github/workflows/` directory exists
- Ensure YAML syntax is correct

### Tests Timeout
- Increase timeout in workflow (currently 120 minutes)
- Check MOC application is accessible
- Review test logs in Ortoni Report

### Report Not Generated
- Check if at least one test passed
- Verify Ortoni Report installed correctly
- Check workflow logs for errors

### GitHub Pages Not Showing
- Enable GitHub Pages in repository settings
- Set source to `gh-pages` branch
- Verify workflow has push permissions

## Next Steps

1. **Commit and Push** these workflow files to GitHub
2. **Enable GitHub Pages** (optional, for report hosting)
3. **Monitor first run** in Actions tab
4. **Review Ortoni Report** to verify setup
5. **Integrate with team** - share report links

## Support

For issues:
- Check GitHub Actions logs
- Review Ortoni Report documentation: https://github.com/ortoniKC/ortoni-report
- Check Playwright documentation: https://playwright.dev
- Review test implementations in `src/tests/`

---

**Last Updated**: December 16, 2025
**Test Suite Version**: 1.0.0
