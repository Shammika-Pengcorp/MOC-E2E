import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MOCOwnerSection4Page, MOCOwnerSection4Data } from '../pages/MOCOwnerSection4Page';
import * as fs from 'fs';
import * as path from 'path';

test.describe('MOC - Owner Section 4 Workflow', () => {
  let loginPage: LoginPage;
  let section4Page: MOCOwnerSection4Page;
  let mocId: string;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    section4Page = new MOCOwnerSection4Page(page);

    // Read MOC ID from JSON file
    const mocFilePath = path.join(__dirname, '../test-data/moc-numbers.json');
    try {
      const fileContent = fs.readFileSync(mocFilePath, 'utf-8');
      const mocData = JSON.parse(fileContent);
      mocId = mocData['latest'];
      console.log(`✓ Retrieved MOC number from file: ${mocId}`);
    } catch (error) {
      throw new Error(`Failed to read MOC number from ${mocFilePath}: ${error}`);
    }
    
    if (!mocId) {
      throw new Error('No MOC number found in test data. Please run the Section 1 creation test first.');
    }

    // Login as MOC Owner
    console.log('Logging in as owner with user: moc_owner1');
    await loginPage.goto();
    await loginPage.login('moc_owner1', 'admin');
    await loginPage.expectLoggedIn();
    console.log('✓ Logged in successfully as owner');
  });

  test('should verify Section 4 - MOC Owner Execution Planning', async ({ page }) => {
    console.log(`\nVerifying Section 4 for MOC: ${mocId}`);

    // Navigate to MOC List
    await section4Page.navigateToMOCList();

    // Search for MOC
    await section4Page.searchMOCById(mocId);

    // Open MOC Details
    await section4Page.openMOCDetails(mocId);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify Section 4 is visible and contains expected subsections
    const section4Heading = page.locator('h4:has-text("4.0 Execution Planning")');
    await expect(section4Heading).toBeVisible();
    console.log('✓ Section 4 heading is visible');

    // Verify the key subsections of Section 4
    const rankingSection = page.locator('h4:has-text("4.1 Ranking")');
    await expect(rankingSection).toBeVisible();
    console.log('✓ Section 4.1 Ranking subsection is visible');

    const implementationSection = page.locator('h4:has-text("4.2 Implementation Details")');
    await expect(implementationSection).toBeVisible();
    console.log('✓ Section 4.2 Implementation Details subsection is visible');

    const milestoneSection = page.locator('h4:has-text("4.3 Milestone Schedule")');
    await expect(milestoneSection).toBeVisible();
    console.log('✓ Section 4.3 Milestone Schedule subsection is visible');

    const approverSection = page.locator('h4:has-text("4.5 Assign MOC Approver")');
    await expect(approverSection).toBeVisible();
    console.log('✓ Section 4.5 Assign MOC Approver subsection is visible');

    // Verify we can see the content of Section 4
    const section4Content = page.locator('text=Change Type');
    await expect(section4Content).toBeVisible();
    console.log('✓ Section 4 content is accessible and visible');

    console.log('✓ Section 4 verification completed successfully');
  });
});
