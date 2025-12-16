import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ChangeFacilityPage, ChangeFacilitySection1Data } from '../pages/ChangeFacilityPage';
import * as fs from 'fs';
import * as path from 'path';

const USER = process.env.MOC_USER || 'moc_requester1';
const PASS = process.env.MOC_PASS || 'admin';

test.describe('MOC - Change Facility Request', () => {
  test('should create a new Change-Facility MOC and successfully submit Section 1 with all required fields', async ({ page }) => {
    // Login using LoginPage POM
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USER, PASS);
    await login.expectLoggedIn();

    // Navigate to Change - Facility form
    const changeFacility = new ChangeFacilityPage(page);
    await changeFacility.navigateToChangeFacility();

    // Prepare test data matching the recorded script
    const testData: ChangeFacilitySection1Data = {
      title: 'Emoc-0004562-2025-12-16',
      departments: ['Downstream', 'Engineering'],
      disciplines: ['Distribution', 'Drilling Engineering'],
      subDisciplines: ['Directional Drilling', 'Mud Engineering', 'Well Design'],
      driver: 'Capital Project',
      priority: 'Medium',
      privacyPolicy: 'Unrestricted',
      sites: ['AA DAIRY'],
      fields: ['1'],
      locations: ['AA DAIRY 1'],
      description: 'emoc000562- description',
      justification: 'emoc000562 - justification',
      proposedStartDate: '12/20/2025',
      proposedEndDate: '12/25/2025',
      estimatedImplementationDate: '12/30/2025',
      duration: 'Permanent',
      budgetType: 'CAPEX',
      estimatedCost: '40',
      accountType: 'moc000562',
      requestAcceptor: 'MOC Acceptor1'
    };

    // Fill Section 1 using the POM
    await changeFacility.fillSection1(testData);

    // Submit for approval
    await changeFacility.submitForApproval();
    
    // Verify success message appears after submission
    console.log('Waiting for success message...');
    const successVerified = await changeFacility.verifySuccessMessage();
    console.log(`Success message verified: ${successVerified}`);
    expect(successVerified).toBeTruthy();

    // Extract the MOC ID from the URL (most reliable method)
    const mocId = await changeFacility.getMOCIdFromURL();
    
    if (mocId) {
      // Save MOC ID to a file for use in subsequent tests
      const testDataDir = path.join(__dirname, '../test-data');
      if (!fs.existsSync(testDataDir)) {
        fs.mkdirSync(testDataDir, { recursive: true });
      }
      
      const mocDataFile = path.join(testDataDir, 'moc-numbers.json');
      let mocData: Record<string, string> = {};
      
      // Read existing MOC numbers if file exists
      if (fs.existsSync(mocDataFile)) {
        const content = fs.readFileSync(mocDataFile, 'utf-8');
        mocData = JSON.parse(content);
      }
      
      // Add or update the MOC ID with timestamp
      mocData['latest'] = mocId;
      mocData[`moc_${Date.now()}`] = mocId;
      
      // Write back to file
      fs.writeFileSync(mocDataFile, JSON.stringify(mocData, null, 2));
      console.log(`✓ MOC ID saved to ${mocDataFile}: ${mocId}`);
    }
  });
});