import { defineConfig } from '@playwright/test';
import { OrtoniReportConfig } from 'ortoni-report';
import * as os from 'os';

const reportConfig: OrtoniReportConfig = {
  open: process.env.CI ? 'never' : 'always',
  folderPath: 'ortoni-report',
  filename: 'ortoni-report.html',
  title: 'MOC E2E Test Report',
  showProject: false,
  projectName: 'MOC System Automation',
  testType: 'E2E - MOC Workflow',
  authorName: os.userInfo().username,
  base64Image: false,
  stdIO: false,
  meta: {
    'Test Cycle': 'December 2025',
    version: '1.0',
    description: 'End-to-end automation testing for MOC Workflow (Requester → Coordinator → Acceptor → Owner → Approver)',
    release: '1.0.0',
    platform: os.type(),
    environment: 'QA',
  },
};

export default defineConfig({
  testDir: 'src/tests',
  timeout: 90_000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'https://moc.otdm.ca',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ],
  reporter: [
    ['list'],
    ['html'],
    ['ortoni-report', reportConfig],
  ],
});