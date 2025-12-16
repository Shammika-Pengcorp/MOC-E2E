import { Page, expect } from '@playwright/test';

export interface MOCApprovalData {
  mocId: string;
  decision: 'Pass' | 'Reject';
  justification: string;
  confirmDecision: boolean;
}

export class MOCCoordinatorPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to MOC List - All eMOCs tab
   */
  async navigateToMOCList() {
    // Wait for the page to load
    await this.page.waitForLoadState('networkidle');
    
    // Click on "All eMOCs" tab
    const allEmocTab = this.page.getByRole('tab', { name: 'All eMOCs' });
    await allEmocTab.waitFor({ state: 'visible', timeout: 10000 });
    await allEmocTab.click();
    
    // Wait for MOC List to be visible
    await expect(this.page.getByText('MOC List')).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Search for a specific MOC by ID
   */
  async searchMOCById(mocId: string) {
    console.log(`Searching for MOC: ${mocId}`);
    
    // Click on search field
    const searchField = this.page.getByRole('textbox', { name: 'Search eMOCs...' });
    await searchField.waitFor({ state: 'visible', timeout: 10000 });
    await searchField.click();
    await this.page.waitForTimeout(500);
    
    // Clear and type MOC ID
    await searchField.fill('');
    await this.page.waitForTimeout(300);
    await searchField.fill(mocId);
    await this.page.waitForTimeout(1000);
    
    console.log(`✓ Searched for MOC: ${mocId}`);
  }

  /**
   * Click the search/filter button to execute search
   */
  async executeSearch() {
    console.log('Executing search...');
    
    // Find and click the search button (usually the third "Button" element)
    const searchButton = this.page.getByRole('button', { name: 'Button' }).nth(2);
    await searchButton.waitFor({ state: 'visible', timeout: 5000 });
    await searchButton.click();
    await this.page.waitForTimeout(1500);
    
    console.log('✓ Search executed');
  }

  /**
   * Verify MOC is found in the list
   */
  async verifyMOCInList(mocId: string) {
    console.log(`Verifying MOC ${mocId} is in the list...`);
    
    const tbody = this.page.locator('tbody');
    await expect(tbody).toContainText(mocId, { timeout: 10000 });
    
    console.log(`✓ MOC ${mocId} found in list`);
  }

  /**
   * Open MOC details by clicking action button in the drawer
   */
  async openMOCDetails() {
    console.log('Opening MOC details...');
    
    // Wait for the drawer to appear
    const drawer = this.page.locator('[id="_r_r_"]');
    await drawer.waitFor({ state: 'visible', timeout: 10000 });
    
    // Click the action button inside the drawer to open MOC details
    const actionButton = drawer.getByRole('button', { name: 'Button' });
    await actionButton.waitFor({ state: 'visible', timeout: 10000 });
    await actionButton.click();
    
    // Wait for the details panel to fully open
    await this.page.waitForTimeout(2000);
    
    console.log('✓ MOC details opened');
  }

  /**
   * Select a decision (Pass or Reject)
   */
  async selectDecision(decision: 'Pass' | 'Reject') {
    console.log(`Selecting decision: ${decision}`);
    
    // Wait for the decision buttons to be available
    await this.page.waitForTimeout(2000);
    
    // Find the Pass/Reject button
    const decisionButton = this.page.getByRole('button', { name: decision });
    
    // Wait and click with force if needed
    try {
      await decisionButton.click({ timeout: 10000, force: true });
      await this.page.waitForTimeout(1000);
      console.log(`✓ Decision '${decision}' selected`);
    } catch (e) {
      console.warn(`Could not click ${decision} button: ${e.message}`);
      // Try scrolling within the drawer
      await this.page.keyboard.press('PageDown');
      await this.page.waitForTimeout(500);
      await decisionButton.click({ timeout: 5000, force: true });
      await this.page.waitForTimeout(1000);
      console.log(`✓ Decision '${decision}' selected (after scroll)`);
    }
  }

  /**
   * Check the agreement/confirmation checkbox
   */
  async acceptAgreement() {
    console.log('Accepting agreement...');
    
    const checkbox = this.page.getByRole('checkbox', { name: 'I have read and agree to the' });
    await checkbox.waitFor({ state: 'visible', timeout: 5000 });
    await checkbox.check();
    await this.page.waitForTimeout(500);
    
    console.log('✓ Agreement accepted');
  }

  /**
   * Fill in the justification/reasoning for the decision
   */
  async fillJustification(justification: string) {
    console.log(`Filling justification: ${justification}`);
    
    const justField = this.page.getByRole('textbox', { name: 'Justification of decision' });
    await justField.waitFor({ state: 'visible', timeout: 5000 });
    await justField.click();
    await this.page.waitForTimeout(300);
    await justField.fill(justification);
    await this.page.waitForTimeout(500);
    
    console.log('✓ Justification filled');
  }

  /**
   * Submit the decision (Pass/Reject) eMOC button
   */
  async submitDecision(decision: 'Pass' | 'Reject') {
    console.log(`Submitting decision: ${decision}...`);
    
    const submitButton = this.page.getByRole('button', { name: `${decision} eMOC` });
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.click();
    await this.page.waitForTimeout(1500);
    
    console.log(`✓ Decision submitted`);
  }

  /**
   * Confirm the final decision (Yes/No prompt)
   */
  async confirmDecision() {
    console.log('Confirming decision...');
    
    const confirmButton = this.page.getByRole('button', { name: 'Yes' });
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();
    await this.page.waitForTimeout(1500);
    
    console.log('✓ Decision confirmed');
  }

  /**
   * Verify success message after decision submission
   */
  async verifyDecisionSaved(): Promise<boolean> {
    try {
      console.log('Verifying decision saved...');
      
      const alert = this.page.getByRole('alert');
      await alert.waitFor({ state: 'visible', timeout: 10000 });
      
      const message = await alert.textContent();
      console.log(`Alert message: ${message}`);
      
      if (message && message.includes('successfully')) {
        console.log('✓✓ Decision saved successfully!');
        return true;
      }
      
      console.warn('✗ Decision save message not found');
      return false;
    } catch (e) {
      console.warn(`Error verifying decision: ${e.message}`);
      return false;
    }
  }

  /**
   * Complete the approval workflow for a MOC
   */
  async approveMOC(data: MOCApprovalData) {
    console.log(`\n=== Starting MOC Approval Workflow for ${data.mocId} ===`);
    
    // Navigate to MOC List
    await this.navigateToMOCList();
    
    // Search for the MOC
    await this.searchMOCById(data.mocId);
    
    // Execute search
    await this.executeSearch();
    
    // Verify MOC is found
    await this.verifyMOCInList(data.mocId);
    
    // Open MOC details
    await this.openMOCDetails();
    
    // Select decision
    await this.selectDecision(data.decision);
    
    // Accept agreement
    await this.acceptAgreement();
    
    // Fill justification
    await this.fillJustification(data.justification);
    
    // Submit decision
    await this.submitDecision(data.decision);
    
    // Confirm decision
    await this.confirmDecision();
    
    // Verify success
    const saved = await this.verifyDecisionSaved();
    
    console.log(`\n=== MOC Approval Workflow Completed ===\n`);
    
    return saved;
  }
}
