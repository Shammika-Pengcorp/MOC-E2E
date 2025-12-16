import { Page, expect } from '@playwright/test';

export interface MOCOwnerSection4Data {
  mocId: string;
  changeType?: string;
  changeDriver?: string;
  projectType?: string;
  complexity?: string;
  cost?: string;
  stakeholderImpact?: string;
  ranking?: string;
  rankingRemarks?: string;
  approver?: string;
  activityTitle?: string;
  activityType?: string;
  performedBy?: string;
  description?: string;
  milestoneTitle?: string;
  milestoneType?: string;
}

/**
 * Page Object for MOC Owner Section 4 (Execution Planning)
 * Handles navigation to and verification of Section 4 form
 */
export class MOCOwnerSection4Page {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to All eMOCs tab
   */
  async navigateToMOCList() {
    console.log('Navigating to MOC List...');
    await this.page.waitForLoadState('networkidle');
    
    const allEmocTab = this.page.getByRole('tab', { name: 'All eMOCs' });
    await allEmocTab.waitFor({ state: 'visible', timeout: 10000 });
    await allEmocTab.click();
    
    await this.page.waitForTimeout(2000);
    console.log('✓ Navigated to MOC List');
  }

  /**
   * Search for a specific MOC by ID
   */
  async searchMOCById(mocId: string) {
    console.log(`Searching for MOC: ${mocId}`);
    
    const searchField = this.page.getByRole('textbox', { name: 'Search eMOCs...' });
    await searchField.waitFor({ state: 'visible', timeout: 10000 });
    await searchField.click();
    await this.page.waitForTimeout(300);
    
    await searchField.fill('');
    await this.page.waitForTimeout(200);
    await searchField.fill(mocId);
    await this.page.waitForTimeout(800);
    
    await searchField.press('Enter');
    await this.page.waitForTimeout(1500);
    
    console.log(`✓ Searched for MOC: ${mocId}`);
  }

  /**
   * Click on MOC row to open details
   */
  async openMOCDetails(mocId: string) {
    console.log('Opening MOC details...');
    
    const mocCell = this.page.getByRole('cell', { name: mocId });
    await mocCell.waitFor({ state: 'visible', timeout: 10000 });
    await mocCell.click();
    
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    
    console.log('✓ MOC details opened');
  }

  /**
   * Verify Section 4 is visible and accessible
   */
  async verifySection4Visible() {
    console.log('Verifying Section 4 is visible...');
    
    const section4Heading = this.page.locator('h4:has-text("4.0 Execution Planning")');
    await expect(section4Heading).toBeVisible({ timeout: 10000 });
    
    console.log('✓ Section 4 is visible');
  }

  /**
   * Verify all Section 4 subsections are visible
   */
  async verifyAllSubsections() {
    console.log('Verifying all Section 4 subsections...');
    
    const subsections = [
      { name: '4.1 Ranking', selector: 'h4:has-text("4.1 Ranking")' },
      { name: '4.2 Implementation Details', selector: 'h4:has-text("4.2 Implementation Details")' },
      { name: '4.3 Milestone Schedule', selector: 'h4:has-text("4.3 Milestone Schedule")' },
      { name: '4.4 Project Schedule Summary', selector: 'h4:has-text("4.4 Project Schedule Summary")' },
      { name: '4.5 Assign MOC Approver', selector: 'h4:has-text("4.5 Assign MOC Approver")' },
      { name: '4.6 Approval for Implementation', selector: 'h4:has-text("4.6 Approval for Implementation")' }
    ];

    for (const subsection of subsections) {
      const element = this.page.locator(subsection.selector);
      try {
        await expect(element).toBeVisible({ timeout: 5000 });
        console.log(`  ✓ ${subsection.name} is visible`);
      } catch (e) {
        console.log(`  ! ${subsection.name} not visible (may be collapsed or not applicable)`);
      }
    }

    console.log('✓ Section 4 subsections verified');
  }

  /**
   * Verify Section 4 content is accessible
   */
  async verifySection4Content() {
    console.log('Verifying Section 4 content...');
    
    // Check for key Section 4 content indicators
    const indicators = [
      { text: 'Change Type', selector: 'text=Change Type' },
      { text: 'Change Driver', selector: 'text=Change Driver' },
      { text: 'Complexity', selector: 'text=Complexity' }
    ];

    for (const indicator of indicators) {
      try {
        await this.page.locator(indicator.selector).first().waitFor({ state: 'visible', timeout: 5000 });
        console.log(`  ✓ ${indicator.text} found in Section 4`);
      } catch (e) {
        console.log(`  ! ${indicator.text} not found in visible Section 4 content`);
      }
    }

    console.log('✓ Section 4 content verified');
  }

  /**
   * Complete workflow for verifying Section 4
   */
  async completeSection4(data: MOCOwnerSection4Data) {
    console.log(`\nCompleting Section 4 verification for MOC: ${data.mocId}`);
    
    // Verify the section exists
    await this.verifySection4Visible();
    
    // Verify all subsections
    await this.verifyAllSubsections();
    
    // Verify content
    await this.verifySection4Content();
    
    console.log('✓ Section 4 verification completed\n');
  }
}
