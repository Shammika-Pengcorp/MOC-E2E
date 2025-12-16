import { Page, expect } from '@playwright/test';

export interface MOCOwnerSection3Data {
  mocId: string;
  stakeholderName: string;
  stakeholderRole: string;
  planDocumentName: string;
  phase: string;
  completionState: string;
  planDate: string;
  endorsers: string;
  description: string;
  riskJustification: string;
}

export class MOCOwnerSection3Page {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate directly to the MOC form using URL
   */
  async navigateDirectlyToMOC(mocId: string) {
    console.log(`Navigating directly to MOC: ${mocId}`);
    
    const mocUrl = `https://moc.otdm.ca/moc-builder/type/moc_facility_full/id/${mocId}`;
    await this.page.goto(mocUrl, { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(2000);
    
    console.log('✓ Navigated to MOC');
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
    
    // Press Enter to search
    await searchField.press('Enter');
    await this.page.waitForTimeout(1500);
    
    console.log(`✓ Searched for MOC: ${mocId}`);
  }

  /**
   * Open MOC details by clicking on the MOC ID in the table
   */
  async openMOCDetails(mocId: string) {
    console.log('Opening MOC details...');
    
    // Click on the MOC ID cell to open details
    const mocCell = this.page.getByRole('cell', { name: mocId });
    await mocCell.waitFor({ state: 'visible', timeout: 10000 });
    await mocCell.click();
    
    // Wait for the page to load
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    
    console.log('✓ MOC details opened');
  }

  /**
   * Add a stakeholder
   */
  async addStakeholder(stakeholderName: string, role: string) {
    console.log(`Adding stakeholder: ${stakeholderName} with role: ${role}`);
    
    // Wait for the form to fully load
    await this.page.waitForTimeout(2000);
    
    // Click the "Add Stakeholder" button
    const addStakeholderBtn = this.page.getByRole('button', { name: 'Add Stakeholder' });
    await addStakeholderBtn.waitFor({ state: 'visible', timeout: 5000 });
    await addStakeholderBtn.click();
    await this.page.waitForTimeout(1500);
    
    // Search for stakeholder
    const searchField = this.page.getByRole('textbox', { name: 'Search' }).first();
    await searchField.waitFor({ state: 'visible', timeout: 5000 });
    await searchField.fill('asset owner');
    await searchField.press('Enter');
    await this.page.waitForTimeout(1500);
    
    // Find the MOC Asset Owners1 row and click its checkbox
    console.log('Selecting MOC Asset Owners1 checkbox...');
    const checkboxCell = this.page.getByRole('cell', { name: /Row Selected/ }).first();
    const checkbox = checkboxCell.locator('input[type="checkbox"]').first();
    await checkbox.waitFor({ state: 'visible', timeout: 5000 });
    await checkbox.check();
    await this.page.waitForTimeout(800);
    
    // Click the role dropdown in the bulk field
    console.log('Setting role to Endorse...');
    const roleDropdown = this.page.locator('.stakeholderModal-bulkField > .pengcorp-dropdown-content-wrapper > .pengcorp-modal-custom-dropdown > .p-dropdown-label');
    await roleDropdown.waitFor({ state: 'visible', timeout: 5000 });
    await roleDropdown.click();
    await this.page.waitForTimeout(500);
    
    // Select Endorse role
    const roleOption = this.page.getByRole('option', { name: 'Endorse' });
    await roleOption.waitFor({ state: 'visible', timeout: 5000 });
    await roleOption.click();
    await this.page.waitForTimeout(800);
    
    // Click Apply button
    const applyBtn = this.page.getByRole('button', { name: 'Apply' });
    await applyBtn.waitFor({ state: 'visible', timeout: 5000 });
    await applyBtn.click();
    await this.page.waitForTimeout(1000);
    
    // Click Save button to close modal
    const saveBtn = this.page.getByRole('button', { name: 'Save' });
    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await saveBtn.click();
    await this.page.waitForTimeout(1500);
    
    console.log(`✓ Stakeholder added: ${stakeholderName} as ${role}`);
  }

  /**
   * Fill in Plan Document details
   */
  async fillPlanDocument(data: {
    planDocumentName: string;
    phase: string;
    completionState: string;
    planDate: string;
    endorsers: string;
    description: string;
  }) {
    console.log('Filling Plan Document section...');
    
    // Click "Plan Document" button
    const planDocBtn = this.page.getByRole('button', { name: 'Plan Document' });
    await planDocBtn.waitFor({ state: 'visible', timeout: 10000 });
    await planDocBtn.click();
    await this.page.waitForTimeout(2000);
    
    // Fill Plan Document Name
    console.log('Filling Plan Document Name...');
    const nameField = this.page.locator('#planDocumentName');
    await nameField.waitFor({ state: 'visible', timeout: 5000 });
    await nameField.click();
    await nameField.fill(data.planDocumentName);
    await this.page.waitForTimeout(500);
    
    // Select Phase
    console.log('Selecting Phase...');
    await this.page.locator('#mocPhase > .p-dropdown-label').click();
    await this.page.waitForTimeout(500);
    const phaseOption = this.page.getByRole('option', { name: data.phase });
    await phaseOption.waitFor({ state: 'visible', timeout: 5000 });
    await phaseOption.click();
    await this.page.waitForTimeout(500);
    
    // Select Document Type
    
    await this.page.locator('#documentType > .p-dropdown-label').click();
    await this.page.getByRole('option', { name: 'Drawing' }).click(); 
    // Select Department
   
    await this.page.locator('span').filter({ hasText: 'Select Department(s)' }).click();
    await this.page.locator('span').filter({ hasText: 'Select Department(s)' }).click();
    await this.page.getByRole('option', { name: 'Engineering' }).click();
    await this.page.locator('span').filter({ hasText: 'Select Discipline' }).click();
    await this.page.getByText('Drilling Engineering', { exact: true }).click();


    await this.page.getByRole('button', { name: 'Select Sub-Discipline' }).click();
    await this.page.getByRole('option', { name: 'Directional Drilling' }).click();
    await this.page.locator('#completionState > .p-dropdown-label').click();
    await this.page.getByRole('option', { name: 'Draft' }).click();
    await this.page.getByRole('spinbutton', { name: 'Year' }).click();
    await this.page.getByRole('spinbutton', { name: 'Year' }).fill('7');
    await this.page.getByRole('spinbutton', { name: 'Day' }).click();
    await this.page.getByRole('spinbutton', { name: 'Day' }).fill('5');
    await this.page.getByRole('spinbutton', { name: 'Month' }).click();
    await this.page.getByRole('spinbutton', { name: 'Month' }).fill('4');
    await this.page.locator('#endorsers > .p-dropdown-label').click();
    await this.page.locator('.p-dropdown-filter').click();
    await this.page.locator('.p-dropdown-filter').fill('ass');
    await this.page.getByLabel('Option List').getByText('MOC Asset Owners1').click();

    
    // Fill Description
    console.log('Filling Description...');
    const descField = this.page.locator('#description');
    await descField.click();
    await descField.fill(data.description);
    await this.page.waitForTimeout(500);
    
    // Click "Add to Summary"
    console.log('Adding Plan Document to Summary...');
    const addToSummaryBtn = this.page.getByRole('button', { name: 'Add to Summary' });
    await addToSummaryBtn.waitFor({ state: 'visible', timeout: 5000 });
    await addToSummaryBtn.click();
    await this.page.waitForTimeout(1000);
    
    // Click "Save"
    const saveBtn = this.page.getByRole('button', { name: 'Save' });
    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await saveBtn.click();
    await this.page.waitForTimeout(1500);
    
    console.log('✓ Plan Document section filled');
  }

  /**
   * Suggest Assessment Methods
   */
  async suggestAssessmentMethods() {
    console.log('Suggesting Assessment Methods...');
    
    // Click "Suggest Assessment Method(s)" button
    const suggestBtn = this.page.getByRole('button', { name: 'Suggest Assessment Method(s)' });
    await suggestBtn.waitFor({ state: 'visible', timeout: 10000 });
    await suggestBtn.click();
    await this.page.waitForTimeout(1500);
    
    // Select various assessment options (based on test-3 recording)
    // Check specific radio buttons for assessment criteria
    const radioButtons = await this.page.locator('#radio-moc_ynn_yes').all();
    
 
    await this.page.locator('#radio-moc_ynn_yes').nth(2).check();
    await this.page.locator('#radio-moc_ynn_yes').nth(3).check();
    await this.page.locator('#radio-moc_ynn_yes').nth(4).check();
    await this.page.locator('#radio-moc_ynn_yes').nth(5).check();
    await this.page.locator('div:nth-child(6) > .pengcorp-query-option > .pengcorp-radiogroup-content > div > div > div > #radio-moc_ynn_yes').check();
    await this.page.locator('div:nth-child(7) > .pengcorp-query-option > .pengcorp-radiogroup-content > div > div > div > #radio-moc_ynn_yes').check();
    await this.page.getByRole('button', { name: 'Apply' }).click();
    
    // Click Save button
    const saveBtn = this.page.getByRole('button', { name: 'Save' }).first();
    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await saveBtn.click();
    await this.page.waitForTimeout(1500);
    
    console.log('✓ Assessment Methods suggested and saved');
  }

  /**
   * Add Risk Assessment Methods
   */
  async addRiskAssessmentMethods() {
    console.log('Adding Risk Assessment Methods...');
    
    // Select RA Matrix
    const methodDropdown = this.page.getByText('Select an optionSelect an').first();
    await methodDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await methodDropdown.click();
    await this.page.waitForTimeout(500);
    
    const raMatrixOption = this.page.getByRole('option', { name: 'RA Matrix' });
    //await raMatrixOption.waitFor({ state: 'visible', timeout: 5000 });
    
    await this.page.getByRole('button', { name: 'action', exact: true }).click();
    await this.page.getByRole('cell', { name: 'Low' }).first().click();
    await this.page.getByRole('button', { name: 'Save' }).click();
    
    
    // Click "Yes" for additional method
    const yesDiv = this.page.locator('div').filter({ hasText: /^Yes$/ }).first();
    await yesDiv.click();
    await this.page.waitForTimeout(1000);
    
    // Click "Add Another Method"
    const addAnotherBtn = this.page.getByRole('button', { name: 'Add Another Method' });
    await addAnotherBtn.click();
    await this.page.waitForTimeout(1000);
    
    // Select "What if" method
    const methodDropdown2 = this.page.getByText('Select an option').nth(1);
    await methodDropdown2.click();
    await this.page.waitForTimeout(500);
    
    const whatIfOption = this.page.getByRole('option', { name: 'What if' });
    await whatIfOption.waitFor({ state: 'visible', timeout: 5000 });
    await whatIfOption.click();
    await this.page.waitForTimeout(1000);
    
    // Click action button and select "Moderate"

    await this.page.getByRole('button', { name: 'action' }).nth(2).click();
    await this.page.getByRole('cell', { name: 'Extreme 16' }).click();
    await this.page.getByRole('button', { name: 'Save' }).click();


    await this.page.locator('#radio-moc_yn_yes').nth(1).check();

  }

  /**
   * Fill Risk Justification and submit Section 3
   */
  async submitSection3(riskJustification: string) {
    console.log('Submitting Section 3...');
    
    
    // Fill risk justification
    const justField = this.page.locator('#riskJustification');
    await justField.click();
    await justField.fill(riskJustification);
    await this.page.waitForTimeout(500);
    
    // Click Submit for Endorsement button

    await this.page.locator('#btnSubmitForEndorsementSection2').click();
    
    console.log('✓ Section 3 submitted for endorsement');
  }

  /**
   * Verify success message after Section 3 submission
   */
  async verifySection3Success(): Promise<boolean> {
    try {
      console.log('Verifying Section 3 submission success...');
      
      const alert = this.page.getByRole('alert');
      await alert.waitFor({ state: 'visible', timeout: 10000 });
      
      const message = await alert.textContent();
      console.log(`Alert message: ${message}`);
      
      if (message && message.includes('Submit for Endorsement successfully')) {
        console.log('✓✓ Section 3 submitted successfully!');
        return true;
      }
      
      console.warn('✗ Success message not found');
      return false;
    } catch (e) {
      console.warn(`Error verifying submission: ${e.message}`);
      return false;
    }
  }

  /**
   * Complete the full Section 3 workflow for MOC Owner
   */
  async completeSection3(data: MOCOwnerSection3Data) {
    console.log(`\n=== Starting MOC Owner Section 3 Workflow for ${data.mocId} ===`);
    
    // Add stakeholder
    await this.addStakeholder(data.stakeholderName, data.stakeholderRole);
    
    // Wait for modal to close after adding stakeholder
    await this.page.waitForTimeout(2000);
    
    // Fill Plan Document (includes Add to Summary and Save)
    await this.fillPlanDocument({
      planDocumentName: data.planDocumentName,
      phase: data.phase,
      completionState: data.completionState,
      planDate: data.planDate,
      endorsers: data.endorsers,
      description: data.description
    });
    
    // Suggest Assessment Methods
    await this.suggestAssessmentMethods();
    
    // Add Risk Assessment Methods
    await this.addRiskAssessmentMethods();
    
    // Submit Section 3
    await this.submitSection3(data.riskJustification);
    
    // Verify success
    const submitted = await this.verifySection3Success();
    
    console.log(`\n=== MOC Owner Section 3 Workflow Completed ===\n`);
    
    return submitted;
  }
}
