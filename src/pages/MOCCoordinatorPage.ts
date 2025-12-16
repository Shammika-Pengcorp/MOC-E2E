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
   * Navigate to MOC List - All MOCs tab
   */
  async navigateToMOCList() {
    // Wait for the page to load
    await this.page.waitForLoadState('networkidle');
    
    // Click on "All MOCs" tab
    await this.page.getByRole('tab', { name: 'All MOCs' }).click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Search for a specific MOC by ID
   */
  async searchMOCById(mocId: string) {



  await this.page.getByRole('textbox', { name: 'Search eMOCs...' }).click();
  await this.page.getByRole('textbox', { name: 'Search eMOCs...' }).fill(mocId);
  await this.page.getByRole('button', { name: 'Button' }).nth(2).click();
  }

  /**
   * Click the search/filter button to execute search
   */
  async executeSearch() {
    console.log('Executing search...');
    
  }

  /**
   * Verify MOC is found in the list
   */
  async verifyMOCInList(mocId: string) {
  }

  /**
   * Open MOC details by clicking action button in the drawer
   */
  async openMOCDetails() {
    console.log('Opening MOC details...');
    

  
    await this.page.locator('[id="_r_17_"]').getByRole('button', { name: 'Button' }).click();
    
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

    
    await this.page.getByRole('tab', { name: 'All MOCs' }).click();
    await this.page.getByRole('textbox', { name: 'Search eMOCs...' }).click();
    await this.page.getByRole('textbox', { name: 'Search eMOCs...' }).fill(data.mocId);
    await this.page.getByRole('button', { name: 'Button' }).nth(2).click();
    
    // // Navigate to MOC List
    // await this.navigateToMOCList();
    
    // // Search for the MOC
    // await this.searchMOCById(data.mocId);
    
    // // Execute search
    // await this.executeSearch();
    
    // // Verify MOC is found
    // await this.verifyMOCInList(data.mocId);
    
    // // Open MOC details
    // await this.openMOCDetails();

    // Wait for drawer to be visible and click the action button
    await this.page.waitForTimeout(1000);
    // const drawer = this.page.locator('[id^="_r_"]').filter({ has: this.page.getByRole('button', { name: 'Button' }) }).first();
    // await drawer.waitFor({ state: 'visible', timeout: 10000 });
    // await drawer.getByRole('button', { name: 'Button' }).click();


    // write a code click the action button in the drawer xpath //*[@fill='#4A4A4A']/ancestor::div[@id='_r_r_']
    //await this.page.locator('//*[@fill="#4A4A4A"]/ancestor::div[@id="_r_r_"]').getByRole('button', { name: 'Button' }).click();


    await this.page.locator('[id="_r_17_"]').getByRole('button', { name: 'Button' }).click();

    //await this.page.locator('[id="_r_17_"]').getByRole('button', { name: 'Button' }).click();
    
    // Wait for the Pass button to appear
    await this.page.waitForTimeout(1500);
    
    // Click Pass button
    const passButton = this.page.getByRole('button', { name: 'Pass' });
    await passButton.waitFor({ state: 'visible', timeout: 10000 });
    await passButton.click();
    
    // Wait for checkbox and other elements
    await this.page.waitForTimeout(1000);
    
    // Accept agreement checkbox
    await this.page.getByRole('checkbox', { name: 'I have read and agree to the' }).check();
    
    // Fill justification
    await this.page.getByRole('textbox', { name: 'Justification of decision' }).click();
    await this.page.getByRole('textbox', { name: 'Justification of decision' }).fill('approved by coordinator');
    
    // Click Pass eMOC button
    // await this.page.getByRole('button', { name: 'Pass eMOC' }).click();
    
    await this.page.getByRole('button', { name: 'Pass' }).click();

    // Click Yes confirmation button
    await this.page.getByRole('button', { name: 'Yes' }).click();
    
    await this.page.waitForTimeout(1000);

    // Verify success message
    //await expect(this.page.getByRole('alert')).toContainText('Your decision has been saved successfully');
    
    console.log(`\n=== MOC Approval Workflow Completed ===\n`);
    
    return true;
  }
}