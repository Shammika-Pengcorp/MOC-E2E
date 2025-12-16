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

    // Execute search
    await section4Page.executeSearch();

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

    await page.getByRole('button', { name: 'Submit', exact: true }).click();
await expect(page.getByRole('alert')).toContainText('Submit for Planning successfully.');


await page.locator('#mocExecutionPlanningChangeType').getByRole('button', { name: 'Select an option' }).click();
await page.locator('#mocExecutionPlanningChangeType').getByRole('button', { name: 'Select an option' }).click();
await page.locator('#mocExecutionPlanningChangeType').getByRole('button', { name: 'Select an option' }).click();
await page.getByText('Equipment replacement').click();
await page.locator('#mocExecutionPlanningChangeDriver').getByRole('button', { name: 'Select an option' }).click();
await page.getByRole('option', { name: 'Economical' }).click();
await page.locator('#mocExecutionPlanningProjectType').getByRole('button', { name: 'Select an option' }).click();
await page.getByText('Facility infrastructure').click();
await page.locator('#mocExecutionPlanningComplexity').getByRole('button', { name: 'Select an option' }).click();
await page.getByRole('option', { name: 'Low' }).click();
await page.locator('#mocExecutionPlanningCost').click();
await page.locator('#mocExecutionPlanningCost').fill('44');
await page.locator('#mocExecutionPlanningStakeholderImpact').getByRole('button', { name: 'Select an option' }).click();
await page.getByLabel('Low').click();
await page.locator('#mocExecutionPlanningRanking').getByRole('button', { name: 'Select an option' }).click();
await page.getByRole('option', { name: 'Ranking 1' }).click();
await page.locator('#mocRankingRemarks').click();
await page.locator('#mocRankingRemarks').fill('execution plan - phase 1');
await page.getByRole('button', { name: 'Add Activity' }).click();
await page.locator('#title').click();
await page.locator('#title').fill('Actiity 2027-phase 1');






await page.locator('#activityType > .p-dropdown-trigger').click();
await page.getByRole('option', { name: 'Field activities' }).click();
await page.locator('#performedBy > .p-dropdown-trigger').click();
await page.getByRole('option', { name: 'Plant operators' }).click();
await page.getByRole('button', { name: '0d 0h' }).click();
await page.locator('.pengcorp-duration-overlay-days > button').first().dblclick();
await page.locator('.pengcorp-duration-overlay-days > button').first().click();
await page.getByRole('spinbutton', { name: 'Month' }).first().click();
await page.getByRole('spinbutton', { name: 'Month' }).first().fill('11');
await page.getByRole('group').filter({ hasText: '11/DD/YYYY' }).getByLabel('Day').fill('11');
await page.getByRole('group').filter({ hasText: '/11/YYYY' }).getByLabel('Year').fill('2028');
await page.getByText('MM', { exact: true }).click();
await page.getByText('MM', { exact: true }).fill('11');
await page.getByText('DD', { exact: true }).fill('11');
await page.getByText('YYYY', { exact: true }).fill('2029');
await page.locator('#description').click();
await page.locator('#description').fill('activity 2027 description');
await page.getByRole('button', { name: 'Add to Summary' }).click();
await page.getByRole('button', { name: 'Save' }).click();




await page.getByRole('radio', { name: 'No', exact: true }).check();
await page.getByRole('button', { name: 'Add Milestone' }).click();
await page.locator('#title').click();
await page.locator('#title').fill('Milestone 1');
await page.locator('#milestonetype > .p-dropdown-trigger').click();
await page.getByRole('option', { name: 'Engineering' }).click();
await page.getByRole('spinbutton', { name: 'Month' }).click();
await page.getByRole('spinbutton', { name: 'Month' }).fill('1');
await page.getByRole('spinbutton', { name: 'Day' }).fill('1');
await page.getByRole('spinbutton', { name: 'Year' }).fill('2029');
await page.locator('#eventPredecessor > .p-dropdown-trigger').click();
await page.getByRole('option', { name: 'Actiity 2027-phase' }).click();


await page.locator('#description').click();
await page.locator('#description').fill('Milestone 1 description');


await page.getByRole('button', { name: 'Add to Summary' }).click();
await page.getByRole('button', { name: 'Save' }).click();


await page.locator('#mocExecutionPlanningMocApprover > .p-dropdown-trigger').click();
await page.locator('.p-dropdown-filter').click();
await page.locator('.p-dropdown-filter').fill('approve');
await page.getByRole('option', { name: 'MOC Approver1' }).click();
await page.locator('#btnSubmitForApprovalSection4').click();
await page.waitForTimeout(1000);
await expect(page.getByRole('alert')).toContainText('Submit for Approval successfully.');
  });

});
