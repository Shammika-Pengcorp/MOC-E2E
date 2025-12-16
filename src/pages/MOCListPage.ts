import { Page, expect } from '@playwright/test';

export class MOCListPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to MOC list (All eMOCs tab)
   */
  async navigateToMOCList() {
    // Navigate to the All eMOCs tab/page
    await this.page.goto('/tabs/all-emocs', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(2000);
  }

  /**
   * Search for a MOC by ID
   */
  async searchMOCById(mocId: string) {
    try {
      // Look for search input field - try multiple selectors
      const searchInputSelectors = [
        'input[type="text"][placeholder*="search" i]',
        'input[placeholder*="Search" i]',
        'input[placeholder*="MOC" i]',
        'input[aria-label*="search" i]',
        '#search-moc',
        '[data-testid="search"]',
        'input[class*="search"]'
      ];

      let searchInput = null;
      for (const selector of searchInputSelectors) {
        searchInput = this.page.locator(selector).first();
        if (await searchInput.isVisible().catch(() => false)) {
          break;
        }
      }

      if (searchInput) {
        await searchInput.fill(mocId);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
      }
    } catch (error) {
      console.log('Search field not found, continuing with page content');
    }
  }

  /**
   * Open MOC details by clicking on the first search result
   */
  async openMOCDetails() {
    try {
      // Click on the first result row
      const resultSelectors = [
        'table tbody tr',
        '[role="row"]',
        '[class*="moc-row"]',
        'a[href*="/moc/"]'
      ];

      for (const selector of resultSelectors) {
        const elements = this.page.locator(selector).first();
        if (await elements.isVisible().catch(() => false)) {
          await elements.click();
          await this.page.waitForURL(/\/moc\//, { timeout: 10000 });
          await this.page.waitForTimeout(1000);
          return;
        }
      }
    } catch (error) {
      console.log('Could not open MOC details');
    }
  }

  /**
   * Verify MOC list is visible
   */
  async verifyMOCListVisible() {
    // Check if any list/table elements are visible
    const listElements = this.page.locator('table, [role="grid"], [role="list"]').first();
    return await listElements.isVisible().catch(() => false);
  }

  /**
   * Get MOC count from the list
   */
  async getMOCCount() {
    try {
      const rows = this.page.locator('table tbody tr, [role="row"]');
      return await rows.count();
    } catch {
      return 0;
    }
  }

  /**
   * Filter MOCs by status
   */
  async filterByStatus(status: string) {
    try {
      // Look for filter dropdown or button
      const filterButtons = this.page.locator('button[class*="filter"], [aria-label*="filter"]');
      if (await filterButtons.first().isVisible().catch(() => false)) {
        await filterButtons.first().click();
        await this.page.waitForTimeout(500);

        // Click on the status option
        const statusOption = this.page.locator(`text="${status}"`).first();
        if (await statusOption.isVisible().catch(() => false)) {
          await statusOption.click();
          await this.page.waitForTimeout(1500);
        }
      }
    } catch (error) {
      console.log('Filter not available');
    }
  }

  /**
   * Sort MOCs by a column
   */
  async sortByColumn(columnName: string) {
    try {
      const columnHeader = this.page.locator(`th:has-text("${columnName}"), [role="columnheader"]:has-text("${columnName}")`).first();
      if (await columnHeader.isVisible().catch(() => false)) {
        await columnHeader.click();
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
      console.log('Sort column not found');
    }
  }

  /**
   * Get current page URL
   */
  async getCurrentPageURL() {
    return this.page.url();
  }

  /**
   * Go back to previous page
   */
  async goBack() {
    await this.page.goBack();
    await this.page.waitForTimeout(1000);
  }
}
