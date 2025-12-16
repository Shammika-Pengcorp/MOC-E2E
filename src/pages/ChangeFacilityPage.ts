import { Page, expect } from '@playwright/test';

export interface ChangeFacilitySection1Data {
  title: string;
  departments: string[];
  disciplines: string[];
  subDisciplines: string[];
  driver: string;
  priority: string;
  privacyPolicy: string;
  sites: string[];
  fields?: string[];
  locations: string[];
  description: string;
  justification: string;
  proposedStartDate: string;
  proposedEndDate: string;
  estimatedImplementationDate: string;
  duration: string;
  assetId?: string;
  budgetType: string;
  estimatedCost: string;
  accountType: string;
  requestAcceptor: string;
}

export class ChangeFacilityPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to Create MOC and select Change - Facility
   */
  async navigateToChangeFacility() {
    // Click Create MOC button and wait for it to be interactive
    const createMocBtn = this.page.getByRole('button', { name: 'Create MOC' });
    await createMocBtn.waitFor({ state: 'visible', timeout: 10000 });
    await createMocBtn.click();
    
    // Wait for the modal/dropdown with Change - Facility option to appear
    const changeFacilityBtn = this.page.getByRole('button', { name: 'Change - Facility' });
    await changeFacilityBtn.waitFor({ state: 'visible', timeout: 10000 });
    await changeFacilityBtn.click();
    
    // Wait for the form page to load with the heading visible
    await expect(this.page.getByRole('heading', { name: 'Change - Facility' })).toBeVisible({ timeout: 15000 });
    
    // Wait for form elements to be ready
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill in the Title field
   */
  async fillTitle(title: string) {
    const titleField = this.page.locator('#mocChangeTitle');
    await titleField.click();
    await titleField.clear();
    await titleField.fill(title);
  }

  /**
   * Select departments from the multi-select dropdown - mirrors the recorded script more closely
   */
  async selectDepartments(departments: string[]) {
    // Click to open the dropdown
    const deptLabel = this.page.getByText('Select Department(s)');
    await deptLabel.click({ timeout: 10000 });
    await this.page.waitForTimeout(1000);

    // Per recorded script: click the first p-icon twice
    const firstIcon = this.page.locator('.p-icon').first();
    await firstIcon.click({ timeout: 5000 });
    await this.page.waitForTimeout(300);
    await firstIcon.click({ timeout: 5000 });
    await this.page.waitForTimeout(500);

    // Now select each department
    for (const dept of departments) {
      // Wait for options panel to be visible with a longer timeout
      await this.page.waitForSelector(`[role="option"]`, { timeout: 15000 });
      
      const option = this.page.getByRole('option', { name: dept });
      const checkbox = option.getByRole('checkbox');
      
      // Check the checkbox by clicking it
      await checkbox.check({ force: true, timeout: 8000 });
      await this.page.waitForTimeout(500);
    }

    // Press Escape or click outside to close
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(800);
  }

  /**
   * Select disciplines from the multi-select dropdown
   */
  async selectDisciplines(disciplines: string[]) {
    // Open disciplines dropdown
    await this.page.locator('#mocChangeDisciplines > .p-multiselect-trigger').click();
    await this.page.waitForTimeout(1000);

    // Click each discipline checkbox
    for (const disc of disciplines) {
      const option = this.page.getByRole('option', { name: disc });
      const checkbox = option.getByRole('checkbox');
      await checkbox.check({ force: true, timeout: 8000 });
      await this.page.waitForTimeout(500);
    }

    // Press Escape to close the dropdown
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(800);
  }

  /**
   * Select sub-disciplines from the multi-select dropdown
   */
  async selectSubDisciplines(subDisciplines: string[]) {
    // Click the sub-discipline dropdown label
    await this.page.getByText('Select Sub-Discipline').click();
    await this.page.waitForTimeout(1000);

    // Click each sub-discipline checkbox
    for (const subDisc of subDisciplines) {
      const option = this.page.getByRole('option', { name: subDisc });
      const checkbox = option.locator('input[type="checkbox"]');
      await checkbox.check({ force: true, timeout: 8000 });
      await this.page.waitForTimeout(500);
    }

    // Press Escape to close the dropdown
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(800);
  }

  /**
   * Select a driver from the dropdown
   */
  async selectDriver(driver: string) {
    await this.page.locator('#mocChangeDriver').click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByRole('option', { name: driver }).click();
  }

  /**
   * Select priority from the dropdown
   */
  async selectPriority(priority: string) {
    await this.page.locator('#mocChangePriority span').filter({ hasText: 'Select an option' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByRole('option', { name: priority }).click();
  }

  /**
   * Select privacy policy from the dropdown
   */
  async selectPrivacyPolicy(policy: string) {
    await this.page.locator('#mocChangePrivacyPolicy').click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByRole('option', { name: policy }).click();
  }

  /**
   * Select field(s) from the cascading dropdown (depends on site selection)
   */
  async selectFields(fields: string[]) {
    try {
      // Try to find Field dropdown using similar ID pattern as Site
      // mocChangeSite -> mocChangeField or similar
      let opened = false;
      
      try {
        // Try direct ID selector like Site does
        await this.page.locator('#mocChangeField > .p-multiselect-trigger').click();
        opened = true;
      } catch (e) {
        try {
          // Fallback: look for Field label and click the dropdown next to it
          const fieldLabel = this.page.getByText('Select Field\\(s\\)');
          await fieldLabel.click({ timeout: 8000 });
          opened = true;
        } catch (e2) {
          console.warn('Could not open Field dropdown');
        }
      }
      
      if (!opened) return;
      
      await this.page.waitForTimeout(600);

      // Select each field
      for (const field of fields) {
        try {
          const option = this.page.getByRole('option', { name: field });
          const checkbox = option.locator('input[type="checkbox"], [role="checkbox"]');
          await checkbox.check({ force: true, timeout: 5000 });
          await this.page.waitForTimeout(300);
        } catch (e) {
          console.warn(`Field option "${field}" not found: ${e.message}`);
        }
      }

      // Close dropdown
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(300);
    } catch (e) {
      console.warn(`Error in selectFields: ${e.message}`);
    }
  }

  /**
   * Select site(s) from the multi-select dropdown
   */
  async selectSites(sites: string[]) {
    // Open sites dropdown
    await this.page.locator('#mocChangeSite > .p-multiselect-trigger').click();
    await this.page.waitForTimeout(1500);

    // Click each site checkbox
    for (const site of sites) {
      try {
        const option = this.page.getByRole('option', { name: site });
        const checkbox = option.getByRole('checkbox');
        
        // Wait longer for options to render
        await this.page.waitForTimeout(600);
        await checkbox.check({ force: true, timeout: 10000 });
        await this.page.waitForTimeout(700);
      } catch (e) {
        console.warn(`Site option "${site}" not found or not clickable: ${e}`);
        // Try waiting and seeing if more options load
        await this.page.waitForTimeout(1000);
        // Try again
        const option = this.page.getByRole('option', { name: site });
        const checkbox = option.getByRole('checkbox');
        await checkbox.check({ force: true, timeout: 10000 });
        await this.page.waitForTimeout(700);
      }
    }

    // Press Escape to close the dropdown
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(800);
  }

  /**
   * Select location(s) from the multi-select dropdown - may be cascading with sites/fields
   */
  async selectLocations(locations: string[]) {
    try {
      // Click the location dropdown label
      const locationLabel = this.page.getByText('Select Location(s)');
      await locationLabel.waitFor({ state: 'visible', timeout: 8000 });
      await locationLabel.click();
      await this.page.waitForTimeout(800);

      // Try to find and select each location
      for (const loc of locations) {
        try {
          const optionLocator = this.page.getByRole('option', { name: new RegExp(`^${loc}$`) });
          let count = await optionLocator.count();
          
          if (count > 0) {
            const checkbox = optionLocator.locator('input[type="checkbox"], [role="checkbox"]');
            await checkbox.check({ force: true, timeout: 5000 });
            await this.page.waitForTimeout(300);
          } else {
            // Try partial match if exact match fails
            const partialOption = this.page.getByRole('option', { name: new RegExp(loc, 'i') });
            const partialCount = await partialOption.count();
            if (partialCount > 0) {
              const checkbox = partialOption.first().locator('input[type="checkbox"], [role="checkbox"]');
              await checkbox.check({ force: true, timeout: 5000 });
              await this.page.waitForTimeout(300);
            } else {
              console.warn(`Location "${loc}" not available in dropdown`);
            }
          }
        } catch (e) {
          console.warn(`Failed to select location "${loc}": ${e.message}`);
        }
      }

      // Close the dropdown
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(300);
    } catch (e) {
      console.warn('Location selection failed:', e.message);
    }
  }

  /**
   * Fill description text area
   */
  async fillDescription(description: string) {
    const descField = this.page.locator('#mocChangeDescription');
    await descField.click();
    await descField.fill(description);
  }

  /**
   * Fill change justification text area
   */
  async fillChangeJustification(justification: string) {
    const justField = this.page.locator('#mocChangeChangeJustification');
    await justField.click();
    await justField.fill(justification);
  }

  /**
   * Parse date string to extract day, month, year
   * @param dateString Format: 'MM/DD/YYYY' or '2025-12-15'
   */
  private parseDate(dateString: string): { day: string; month: string; year: string } | null {
    let match;
    
    // Try MM/DD/YYYY format
    if (dateString.includes('/')) {
      match = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (match) {
        return { month: match[1], day: match[2], year: match[3] };
      }
    }
    
    // Try YYYY-MM-DD format
    if (dateString.includes('-')) {
      match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        return { year: match[1], month: match[2], day: match[3] };
      }
    }
    
    return null;
  }

  /**
   * Select a date from the date picker calendar
   * @param dateIndex Index of the date picker (0 for first, 1 for second, etc.)
   * @param dateString Full date string in format 'MM/DD/YYYY' or 'YYYY-MM-DD' (e.g., '12/16/2025')
   */
  async selectDateByTyping(dateIndex: number, dateString: string) {
    try {
      console.log(`\n=== [Date Picker ${dateIndex}] Starting to fill with: ${dateString} ===`);
      
      // Parse the date
      const dateObj = this.parseDate(dateString);
      if (!dateObj) {
        console.warn(`Invalid date format: ${dateString}`);
        return;
      }
      
      console.log(`Parsed: Day=${dateObj.day}, Month=${dateObj.month}, Year=${dateObj.year}`);
      
      // FIRST: Close any open calendar from previous operation
      if (dateIndex > 0) {
        console.log(`Closing any open calendar from previous picker...`);
        try {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(300);
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(500);
          // Click somewhere neutral
          await this.page.click('h1', { force: true }).catch(() => {});
          await this.page.waitForTimeout(500);
        } catch (e) {
          console.log(`Error closing calendar: ${e.message}`);
        }
      }
      
      // Find all date picker buttons
      const dateButtons = await this.page.getByRole('button', { name: 'Choose date' }).all();
      console.log(`Found ${dateButtons.length} date picker buttons`);
      
      if (dateIndex >= dateButtons.length) {
        console.warn(`Date picker index ${dateIndex} out of range`);
        return;
      }
      
      const dateButton = dateButtons[dateIndex];
      
      // STEP 1: Click the date picker button to open calendar
      console.log(`STEP 1: Clicking date button ${dateIndex} to open calendar...`);
      
      // Wait for button to be visible and enabled
      await dateButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.page.waitForTimeout(300);
      
      // Try clicking with force
      await dateButton.click({ timeout: 5000, force: true });
      console.log(`✓ Clicked button ${dateIndex}`);
      await this.page.waitForTimeout(1500);
      
      // STEP 2: Find and click the day in the calendar
      console.log(`STEP 2: Looking for day ${dateObj.day} in calendar...`);
      
      let dayClicked = false;
      let attempts = 0;
      
      while (!dayClicked && attempts < 3) {
        attempts++;
        console.log(`  Attempt ${attempts}: Searching for day ${dateObj.day}...`);
        
        const allButtons = await this.page.locator('button').all();
        console.log(`  Found ${allButtons.length} buttons on page`);
        
        for (let i = 0; i < allButtons.length; i++) {
          try {
            const text = await allButtons[i].textContent({ timeout: 200 });
            const isVisible = await allButtons[i].isVisible({ timeout: 200 }).catch(() => false);
            const ariaDisabled = await allButtons[i].getAttribute('aria-disabled').catch(() => 'false');
            
            if (text && text.trim() === dateObj.day) {
              console.log(`  Found day ${dateObj.day} at button index ${i}, visible=${isVisible}, aria-disabled=${ariaDisabled}`);
              
              if (isVisible && ariaDisabled !== 'true') {
                console.log(`  ✓ CLICKING day ${dateObj.day}...`);
                await allButtons[i].click({ timeout: 5000, force: true });
                console.log(`  ✓ Day clicked successfully`);
                await this.page.waitForTimeout(1000);
                dayClicked = true;
                break;
              }
            }
          } catch (e) {
            // Continue to next button
          }
        }
        
        if (!dayClicked && attempts < 3) {
          console.log(`  Day not found on attempt ${attempts}, waiting and retrying...`);
          await this.page.waitForTimeout(400);
        }
      }
      
      if (!dayClicked) {
        console.warn(`Day ${dateObj.day} not found in calendar after ${attempts} attempts`);
      } else {
        console.log(`✓ Successfully selected day ${dateObj.day}`);
      }
      
      // STEP 3: Click outside calendar to close it
      console.log(`STEP 3: Closing calendar...`);
      await this.page.waitForTimeout(500);
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(300);
      await this.page.click('body', { position: { x: 50, y: 50 }, force: true });
      await this.page.waitForTimeout(1000);
      
      console.log(`✓ Date picker ${dateIndex} completed\n`);
      
    } catch (e) {
      console.error(`✗ Failed to fill date ${dateIndex}: ${e.message}`);
    }
  }

  /**
   * Fill in dates for Proposed Start, Proposed End, and Estimated Implementation
   * Dates should be in format: MM/DD/YYYY
   */
  async fillDates(proposedStart: string, proposedEnd: string, estimatedImpl: string) {
    // Proposed Start Date (first picker) - e.g., '12/15/2025'
    await this.selectDateByTyping(0, proposedStart);
    await this.page.waitForTimeout(600);

    // Proposed End Date (second picker) - e.g., '12/16/2025'
    await this.selectDateByTyping(1, proposedEnd);
    await this.page.waitForTimeout(600);

    // Estimated Implementation Date (third picker) - e.g., '12/16/2025'
    await this.selectDateByTyping(2, estimatedImpl);
  }

  /**
   * Select duration from the dropdown
   */
  async selectDuration(duration: string) {
    await this.page.locator('#mocChangeDuration').getByRole('button', { name: 'Select an option' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByRole('option', { name: duration }).click();
  }

  /**
   * Add an asset and select it
   * Note: Currently simplified due to complex modal interactions with data grid
   */
  async addAsset() {
    try {
      // Click Add Asset button
      const addAssetBtn = this.page.getByRole('button', { name: 'Add Asset' });
      await addAssetBtn.click();
      await this.page.waitForTimeout(1200);

      // Select first asset checkbox
      const checkboxes = await this.page.locator('input[type="checkbox"]').all();
      if (checkboxes.length > 1) {
        // Skip header checkbox, click first data row
        await checkboxes[1].check({ force: true });
        await this.page.waitForTimeout(400);
      }

      // Click "Add to Summary" button
      const addToSummaryBtn = this.page.getByRole('button', { name: 'Add to Summary' });
      await addToSummaryBtn.click();
      await this.page.waitForTimeout(800);

      // Force close modal with Escape multiple times if still open
      for (let i = 0; i < 3; i++) {
        try {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(300);
        } catch (e) {
          break;
        }
      }
      
      // Wait for modal to actually close
      await this.page.waitForTimeout(800);
    } catch (e) {
      console.warn('Asset selection failed:', e.message);
      // Try to close modal anyway
      for (let i = 0; i < 2; i++) {
        try {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(200);
        } catch (e) {
          break;
        }
      }
    }
  }

  /**
   * Select budget type and fill in budget details
   */
  async fillBudgetInfo(budgetType: string, estimatedCost: string, accountType: string) {
    // Select "No" for the initial radio button (if present)
    const radioButtons = await this.page.getByRole('radio', { name: /No/ }).all();
    if (radioButtons.length > 0) {
      await radioButtons[0].check();
    }

    // Select budget type
    await this.page.locator('#mocChangeBudgetType').click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByRole('option', { name: budgetType }).click();

    // Fill estimated cost
    const costField = this.page.locator('#mocChangeBudgetEstimatedCost');
    await costField.click();
    await costField.fill(estimatedCost);

    // Fill account type
    const accountField = this.page.locator('#mocChangeBudgetAccountType');
    await accountField.click();
    await accountField.fill(accountType);
  }

  /**
   * Select request acceptor
   */
  async selectRequestAcceptor(acceptorName: string) {
    await this.page.locator('#mocChangeRequestAcceptor span').filter({ hasText: 'Select an option' }).click();
    await this.page.waitForLoadState('domcontentloaded');

    // If there's a filter/search field, use it
    const filterField = this.page.locator('.p-dropdown-filter');
    if (await filterField.isVisible()) {
      await filterField.click();
      await filterField.fill('accep');
      await this.page.waitForTimeout(300);
    }

    // Select the acceptor option
    await this.page.getByRole('option', { name: acceptorName }).click();
  }

  /**
   * Submit the form for approval (Section 1)
   */
  async submitForApproval() {
    await this.page.locator('#btnSubmitForApprovalSection1').click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);

    // Verify the alert appears and check its content
    const alert = this.page.getByRole('alert');
    await alert.waitFor({ state: 'visible', timeout: 10000 });
    const alertText = await alert.textContent();
    
    console.log(`Alert message: ${alertText}`);
    
    // Accept either success or specific known issues
    if (alertText && alertText.includes('successfully')) {
      console.log('✓ Form submitted successfully!');
      return true;
    } else if (alertText && (alertText.includes('Required field') || alertText.includes('missing'))) {
      console.warn(`Form submission requires more fields: ${alertText}`);
      // Log the missing field for debugging but don't fail completely
      return false;
    } else {
      console.log(`Form submit returned: ${alertText}`);
      return false;
    }
  }

  /**
   * Verify success message appears after form submission
   */
  async verifySuccessMessage(): Promise<boolean> {
    try {
      await this.page.waitForTimeout(1500);
      
      // Look for the success toast/alert message
      // The message should say "Success! Submit for Approval successfully" or similar
      const alert = this.page.getByRole('alert');
      const alertCount = await alert.count();
      
      if (alertCount > 0) {
        const message = await alert.first().textContent();
        console.log('✓ Alert message found:', message);
        
        // Check for success keywords indicating successful submission
        if (message && (message.includes('Success') && message.includes('successfully'))) {
          console.log('✓✓ Form submitted successfully - verified exact message!');
          return true;
        } else if (message && message.includes('Success')) {
          console.log('✓ Success message found (partial match)');
          return true;
        }
      }
      
      // Alternative: look for success toast containers
      const toastContainers = await this.page.locator('[role="status"], .p-toast-message, .success-alert, [class*="success"]').all();
      for (const container of toastContainers) {
        const text = await container.textContent({ timeout: 500 });
        if (text && text.includes('Success')) {
          console.log('✓ Success message found in toast:', text);
          return true;
        }
      }
      
      console.warn('✗ No success message found');
      return false;
    } catch (e) {
      console.warn('Error verifying success:', e.message);
      return false;
    }
  }

  /**
   * Extract MOC ID from the current URL
   * URL format: https://moc.otdm.ca/moc-builder/type/moc_facility_full/id/eMOC_000632
   */
  async getMOCIdFromURL(): Promise<string | null> {
    try {
      await this.page.waitForTimeout(1000);
      
      // Get current URL
      const currentURL = this.page.url();
      console.log(`Current URL: ${currentURL}`);
      
      // Extract MOC ID from URL using regex
      // Pattern: /id/eMOC_\d+
      const match = currentURL.match(/\/id\/(eMOC_\d+)/);
      
      if (match && match[1]) {
        const mocId = match[1];
        console.log(`✓ MOC ID extracted from URL: ${mocId}`);
        return mocId;
      }
      
      console.warn('Could not extract MOC ID from URL');
      return null;
    } catch (e) {
      console.warn(`Error extracting MOC ID from URL: ${e.message}`);
      return null;
    }
  }

  /**
   * Fill entire Section 1 with provided data
   */
  async fillSection1(data: ChangeFacilitySection1Data) {
    await this.fillTitle(data.title);
    await this.selectDepartments(data.departments);
    await this.selectDisciplines(data.disciplines);
    await this.selectSubDisciplines(data.subDisciplines);
    await this.selectDriver(data.driver);
    await this.selectPriority(data.priority);
    await this.selectPrivacyPolicy(data.privacyPolicy);
    await this.selectSites(data.sites);
    
    // Add minimal wait after selecting sites - fields/locations may be cascading
    await this.page.waitForTimeout(800);
    
    // Select fields if provided
    if (data.fields && data.fields.length > 0) {
      await this.selectFields(data.fields);
      await this.page.waitForTimeout(500);
    }
    
    await this.selectLocations(data.locations);
    await this.fillDescription(data.description);
    await this.fillChangeJustification(data.justification);



    // Then fill the date fields
    await this.page.getByRole('spinbutton', { name: 'Year' }).first().click();
    await this.page.getByRole('spinbutton', { name: 'Year' }).first().fill('2027');
    await this.page.getByRole('group').filter({ hasText: 'MM/DD/2027' }).getByLabel('Day').click();
    await this.page.getByRole('group').filter({ hasText: 'MM/DD/2027' }).getByLabel('Day').fill('11');
    await this.page.getByRole('group').filter({ hasText: 'MM/11/' }).getByLabel('Month').click();
    await this.page.getByRole('group').filter({ hasText: 'MM/11/' }).getByLabel('Month').fill('11');
    await this.page.getByRole('spinbutton', { name: 'Year' }).nth(1).click();
    await this.page.getByRole('spinbutton', { name: 'Year' }).nth(1).fill('2028');
    await this.page.getByRole('group').filter({ hasText: 'MM/DD/2028' }).getByLabel('Day').click();
    await this.page.getByRole('group').filter({ hasText: 'MM/DD/2028' }).getByLabel('Day').fill('06');
    await this.page.getByRole('group').filter({ hasText: 'MM/06/' }).getByLabel('Month').click();
    await this.page.getByRole('group').filter({ hasText: 'MM/06/' }).getByLabel('Month').fill('01');
    await this.page.getByRole('spinbutton', { name: 'Year' }).nth(2).click();
    await this.page.getByRole('spinbutton', { name: 'Year' }).nth(2).fill('2029');
    await this.page.getByRole('group').filter({ hasText: 'MM/DD/2029' }).getByLabel('Day').click();
    await this.page.getByRole('group').filter({ hasText: 'MM/DD/2029' }).getByLabel('Day').fill('07');
    await this.page.getByRole('group').filter({ hasText: 'MM/07/' }).getByLabel('Month').click();
    await this.page.getByRole('group').filter({ hasText: 'MM/07/' }).getByLabel('Month').fill('11');

    //await this.fillDates(data.proposedStartDate, data.proposedEndDate, data.estimatedImplementationDate);
    await this.selectDuration(data.duration);

    // First, add asset to summary
    await this.page.getByRole('button', { name: 'Add Asset' }).click();
    await this.page.getByRole('cell', { name: 'Row Selected 68c9c7ddc55a448d5d52ce25' }).locator('input[type="checkbox"]').check();
    await this.page.getByRole('button', { name: 'Add to Summary' }).click();
    await this.page.getByRole('button', { name: 'Save' }).click();

    await this.page.waitForTimeout(800);

    await this.fillBudgetInfo(data.budgetType, data.estimatedCost, data.accountType);
    await this.selectRequestAcceptor(data.requestAcceptor);
  }
}
