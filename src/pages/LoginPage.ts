import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username = (page: Page) => page.locator('#username');
  readonly password = (page: Page) => page.locator('#password');
  readonly signIn = (page: Page) => page.locator('#kc-login');

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    // navigate to the dashboard which triggers auth redirect to the Keycloak login
    await this.page.goto('/tabs/dashboard', { waitUntil: 'domcontentloaded' });
  }

  async login(username: string, password: string) {
    await this.username(this.page).fill(username);
    await this.password(this.page).fill(password);
    // Click sign in and wait for the app to redirect back to the MOC host.
    await this.signIn(this.page).click();
    // The redirect may involve query params and long-running microfrontends; wait for a URL that starts with base domain
    await this.page.waitForURL(/https:\/\/moc\.otdm\.ca.*/, { timeout: 60000 });
    // Wait for basic load of the MOC host and a recognizable title
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoggedIn() {
    // After login the app should redirect back to the Host App
    await expect(this.page).toHaveURL(/https:\/\/moc\.otdm\.ca/);
    await expect(this.page).toHaveTitle(/Host App/);
  }
}
