import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Credentials supplied by user — for CI use environment variables instead
const USER = process.env.MOC_USER || 'moc_requester1';
const PASS = process.env.MOC_PASS || 'admin';

test.describe('MOC Login Tests', () => {
  test('TC-001: logs in with valid credentials (moc_requester1)', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(USER, PASS);

    // validate we're back at the app
    await login.expectLoggedIn();
    
    // Verify user is on dashboard/home page
    await expect(page).toHaveTitle(/Host App/);
  });

  test('TC-002: logs in with valid moc_coordinator credentials', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('moc_coordinator1', 'admin');
    await login.expectLoggedIn();
    
    // Verify user is on dashboard/home page
    await expect(page).toHaveTitle(/Host App/);
  });

  test('TC-003: logs in with valid moc_acceptor credentials', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('moc_acceptor1', 'admin');
    await login.expectLoggedIn();
    
    // Verify user is on dashboard/home page
    await expect(page).toHaveTitle(/Host App/);
  });

  test('TC-004: logs in with valid moc_owner credentials', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('moc_owner1', 'admin');
    await login.expectLoggedIn();
    
    // Verify user is on dashboard/home page
    await expect(page).toHaveTitle(/Host App/);
  });

  test('TC-005: login page displays username and password fields', async ({ page }) => {
    const login = new LoginPage(page);
    
    await login.goto();
    
    // Verify login form elements are visible
    const usernameField = login.username(page);
    const passwordField = login.password(page);
    const signInButton = login.signIn(page);
    
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(signInButton).toBeVisible();
  });

  test('TC-006: rejects login with invalid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    
    await login.goto();
    
    // Attempt login with wrong credentials
    await login.username(page).fill('invalid_user');
    await login.password(page).fill('wrong_password');
    await login.signIn(page).click();
    
    // Should not redirect to moc.otdm.ca and stay on login/error page
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).not.toMatch(/https:\/\/moc\.otdm\.ca/);
  });

  test('TC-007: username field accepts text input', async ({ page }) => {
    const login = new LoginPage(page);
    
    await login.goto();
    
    const testUsername = 'moc_requester1';
    const usernameField = login.username(page);
    
    await usernameField.fill(testUsername);
    
    const inputValue = await usernameField.inputValue();
    expect(inputValue).toBe(testUsername);
  });

  test('TC-008: password field accepts text input', async ({ page }) => {
    const login = new LoginPage(page);
    
    await login.goto();
    
    const testPassword = 'admin';
    const passwordField = login.password(page);
    
    await passwordField.fill(testPassword);
    
    // Password field should have value (even though hidden visually)
    const inputValue = await passwordField.inputValue();
    expect(inputValue).toBe(testPassword);
  });

  test('TC-009: login timeout handling - wait for URL redirect', async ({ page }) => {
    const login = new LoginPage(page);
    
    await login.goto();
    await login.login('moc_requester1', 'admin');
    
    // Verify successful redirect after login
    const finalUrl = page.url();
    expect(finalUrl).toMatch(/https:\/\/moc\.otdm\.ca/);
  });

  test('TC-010: user can navigate to dashboard after login', async ({ page }) => {
    const login = new LoginPage(page);
    
    await login.goto();
    await login.login('moc_requester1', 'admin');
    await login.expectLoggedIn();
    
    // Verify page title contains expected text
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Host App');
  });

  test('TC-011: login form submission with empty username shows validation', async ({ page }) => {
    const login = new LoginPage(page);
    
    await login.goto();
    
    // Leave username empty and try to login
    await login.password(page).fill('admin');
    await login.signIn(page).click();
    
    // Should not successfully authenticate
    await page.waitForTimeout(1500);
    const url = page.url();
    expect(url).not.toMatch(/https:\/\/moc\.otdm\.ca/);
  });

  test('TC-012: login form submission with empty password shows validation', async ({ page }) => {
    const login = new LoginPage(page);
    
    await login.goto();
    
    // Leave password empty and try to login
    await login.username(page).fill('moc_requester1');
    await login.signIn(page).click();
    
    // Should not successfully authenticate
    await page.waitForTimeout(1500);
    const url = page.url();
    expect(url).not.toMatch(/https:\/\/moc\.otdm\.ca/);
  });
});
