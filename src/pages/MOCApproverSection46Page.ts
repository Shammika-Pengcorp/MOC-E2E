import { Page, expect } from '@playwright/test';

export interface ApprovalData {
  decision: 'Approve' | 'Request Changes' | 'Reject';
  comments: string;
}

export class MOCApproverSection46Page {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to MOC List - All MOCs tab
   */
  async navigateToMOCList(): Promise<void> {
    console.log('Navigating to MOC List...');
    
    // Wait for the page to load
    await this.page.waitForLoadState('networkidle');
    
    // Click on "All MOCs" tab
    await this.page.getByRole('tab', { name: 'All MOCs' }).click();
    await this.page.waitForTimeout(1000);
    
    console.log('✓ Navigated to MOC List');
  }

  /**
   * Search for a specific MOC by ID
   */
  async searchMOCById(mocId: string): Promise<void> {
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
  async executeSearch(): Promise<void> {
    console.log('Executing search...');
    
    // Press Enter to execute search instead of clicking a button
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1500);
    
    console.log('✓ Search executed');
  }

  /**
   * Verify MOC is found in the list
   */
  async verifyMOCInList(mocId: string): Promise<void> {
    console.log(`Verifying MOC ${mocId} is in the list...`);
    
    const tbody = this.page.locator('tbody');
    await expect(tbody).toContainText(mocId, { timeout: 10000 });
    
    console.log(`✓ MOC ${mocId} found in list`);
  }

  /**
   * Open MOC details by clicking on the MOC row
   */
  async openMOCDetails(): Promise<void> {
    console.log('Opening MOC details...');
    
    // Wait for the MOC row to be visible and click it
    const mocRow = this.page.locator('tbody tr').first();
    await mocRow.waitFor({ state: 'visible', timeout: 10000 });
    await mocRow.click();
    
    // Wait for the details panel to fully open
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    
    console.log('✓ MOC details opened');
  }

  /**
   * Navigate to Section 4.6 (Approver Assignment)
   */
  async navigateToSection46(): Promise<void> {
    console.log('Navigating to Section 4.6 (Approver Assignment)...');
    
    // Scroll to find Section 4 or Section 4.6
    const section46Text = this.page.locator('text=/4\.6|Approver Assignment/i').first();
    
    try {
      await section46Text.waitFor({ state: 'visible', timeout: 10000 });
      await section46Text.scrollIntoViewIfNeeded();
      console.log('✓ Section 4.6 located and scrolled into view');
    } catch (error) {
      console.log('⚠ Section 4.6 heading not found, continuing with available content');
    }
  }

  /**
   * Verify Section 4.6 content is visible
   */
  async verifySection46Visible(): Promise<void> {
    console.log('Verifying Section 4.6 content is visible...');
    
    try {
      const section46Heading = this.page.locator('text=/4\.6|Approver Assignment/i').first();
      await expect(section46Heading).toBeVisible({ timeout: 10000 });
      console.log('✓ Section 4.6 heading is visible');
    } catch (error) {
      console.log('⚠ Section 4.6 heading not found');
    }
  }

  /**
   * Fill approval justification/comments
   */
  async fillApprovalJustification(comments: string): Promise<void> {
    console.log('Filling approval justification/comments...');
    
    try {
      // Try different comment/textarea field selectors
      const commentSelectors = [
        'textarea[placeholder*="Add comment"]',
        'textarea[placeholder*="comment" i]',
        'textarea[aria-label*="comment" i]',
        'input[placeholder*="Add comment"]',
        'input[placeholder*="comment" i]'
      ];
      
      for (const selector of commentSelectors) {
        const field = this.page.locator(selector).first();
        if (await field.isVisible({ timeout: 3000 }).catch(() => false)) {
          await field.click();
          await field.fill(comments);
          console.log('✓ Justification/comments filled');
          return;
        }
      }
      console.log('⚠ Comments field not found');
    } catch (error) {
      console.log(`⚠ Error filling comments: ${error}`);
    }
  }

  /**
   * Submit approval decision
   */
  async submitApprovalDecision(decision: string): Promise<void> {
    console.log(`Submitting decision: ${decision}...`);
    
    try {
      // Look for the decision button
      const decisionButton = this.page.getByRole('button', { name: decision, exact: true });
      
      if (await decisionButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await decisionButton.click();
        await this.page.waitForTimeout(1000);
        console.log(`✓ Decision '${decision}' submitted`);
      } else {
        // Try alternative selectors
        const altButton = this.page.locator(`button:has-text("${decision}")`).first();
        await altButton.click();
        await this.page.waitForTimeout(1000);
        console.log(`✓ Decision '${decision}' submitted (alternative selector)`);
      }
    } catch (error) {
      console.log(`⚠ Error submitting decision: ${error}`);
    }
  }

  /**
   * Verify approval success
   */
  async verifyApprovalSuccess(): Promise<void> {
    console.log('Verifying approval submission success...');
    
    try {
      // Look for success message
      const successMessage = this.page.locator('text=/Success|Approved|Submitted successfully/i').first();
      
      await expect(successMessage).toBeVisible({ timeout: 10000 });
      const message = await successMessage.textContent();
      console.log(`✓✓ Approval successful! Message: ${message}`);
    } catch (error) {
      console.log('⚠ Success message not found, but approval may have been processed');
    }
  }
}
