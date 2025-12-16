import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MOCAcceptorPage, MOCAcceptanceData } from '../pages/MOCAcceptorPage';
import * as fs from 'fs';
import * as path from 'path';

const ACCEPTOR_USER = process.env.MOC_ACCEPTOR_USER || 'moc_acceptor1';
const ACCEPTOR_PASS = process.env.MOC_ACCEPTOR_PASS || 'admin';

test.describe('MOC - Acceptor Approval Workflow', () => {
  test('should search for MOC and approve it as MOC Acceptor', async ({ page }) => {
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

    // Login as MOC Acceptor
    console.log(`\nLogging in as acceptor with user: ${ACCEPTOR_USER}`);
    const login = new LoginPage(page);
    await login.goto();
    await login.login(ACCEPTOR_USER, ACCEPTOR_PASS);
    await login.expectLoggedIn();
    console.log('✓ Logged in successfully as acceptor');

    // Use MOCAcceptorPage POM to perform acceptance workflow
    const acceptor = new MOCAcceptorPage(page);
    
    // Prepare acceptance data
    const acceptanceData: MOCAcceptanceData = {
      mocId: mocNumber,
      ownerId: 'MOC Owner1',
      approvalComment: `MOC ${mocNumber} approved by acceptor - All requirements met`
    };

    // Execute the acceptance workflow
    console.log(`\nStarting acceptance workflow for MOC: ${mocNumber}`);
    const acceptanceSuccessful = await acceptor.approveMOC(acceptanceData);
    
    // Assert that the approval was successful
    expect(acceptanceSuccessful).toBeTruthy();
    
    console.log(`\n✓ Test completed successfully - MOC ${mocNumber} accepted`);
  });
});
