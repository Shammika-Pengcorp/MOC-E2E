import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Credentials supplied by user — for CI use environment variables instead
const USER = process.env.MOC_USER || 'moc_requester1';
const PASS = process.env.MOC_PASS || 'admin';

test.describe('MOC Login', () => {
  test('logs in with valid credentials (POM)', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(USER, PASS);

    // validate we're back at the app
    await login.expectLoggedIn();

    // optional: check for a dashboard element (increase resilience if desired)
    // await expect(page.locator('text=Dashboard')).toBeVisible();
  });
});
