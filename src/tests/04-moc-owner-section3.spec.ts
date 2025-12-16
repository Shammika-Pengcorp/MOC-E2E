import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MOCOwnerSection3Page, MOCOwnerSection3Data } from '../pages/MOCOwnerSection3Page';
import * as fs from 'fs';
import * as path from 'path';

const OWNER_USER = process.env.MOC_OWNER_USER || 'moc_owner1';
const OWNER_PASS = process.env.MOC_OWNER_PASS || 'admin';

test.describe('MOC - Owner Section 3 Workflow', () => {
  test('should fill and submit Section 3 as MOC Owner', async ({ page }) => {
    // Read the MOC number saved from the previous tests
    const testDataDir = path.join(__dirname, '../test-data');
    const mocDataFile = path.join(testDataDir, 'moc-numbers.json');
    
    let mocNumber: string | null = null;
    
    if (fs.existsSync(mocDataFile)) {
      const content = fs.readFileSync(mocDataFile, 'utf-8');
      const mocData = JSON.parse(content);
      mocNumber = mocData['latest'];
      console.log(`✓ Retrieved MOC number from file: ${mocNumber}`);
    } else {
      throw new Error(`MOC data file not found at: ${mocDataFile}. Please run the Section 1 creation test first.`);
    }
    
    if (!mocNumber) {
      throw new Error('No MOC number found in test data. Please run the Section 1 creation test first.');
    }

    // Login as MOC Owner
    console.log(`\nLogging in as owner with user: ${OWNER_USER}`);
    const login = new LoginPage(page);
    await login.goto();
    await login.login(OWNER_USER, OWNER_PASS);
    await login.expectLoggedIn();
    console.log('✓ Logged in successfully as owner');

    // Use MOCOwnerSection3Page POM to perform Section 3 workflow
    const ownerSection3 = new MOCOwnerSection3Page(page);
    
    // Prepare Section 3 data
    const section3Data: MOCOwnerSection3Data = {
      mocId: mocNumber,
      stakeholderName: 'MOC Asset Owners1',
      stakeholderRole: 'Endorse',
      planDocumentName: 'plan doc section 3',
      phase: 'Initiation',
      completionState: 'Draft',
      planDate: '01/01/2027',
      endorsers: 'MOC Asset Owners1',
      description: 'plan for 2027',
      riskJustification: `MOC ${mocNumber} - Risk Assessment Complete`
    };

    // Execute the Section 3 workflow
    console.log(`\nStarting Section 3 workflow for MOC: ${mocNumber}`);
    
    // First navigate to MOC List and search for the MOC (as in test-3)
    await ownerSection3.navigateToMOCList();
    await ownerSection3.searchMOCById(mocNumber);
    await ownerSection3.openMOCDetails(mocNumber);
    
    // Complete Section 3
    const section3Successful = await ownerSection3.completeSection3(section3Data);
    
    // Assert that the submission was successful
    expect(section3Successful).toBeTruthy();
    
    console.log(`\n✓ Test completed successfully - MOC ${mocNumber} Section 3 submitted`);
  });
});
