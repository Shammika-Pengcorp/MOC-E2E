import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MOCCoordinatorPage, MOCApprovalData } from '../pages/MOCCoordinatorPage';
import * as fs from 'fs';
import * as path from 'path';

const COORDINATOR_USER = process.env.MOC_COORDINATOR_USER || 'moc_coordinator1';
const COORDINATOR_PASS = process.env.MOC_COORDINATOR_PASS || 'admin';

test.describe('MOC - Coordinator Approval Workflow', () => {
  test('should search for MOC and approve it as MOC Coordinator', async ({ page }) => {
    // Read the MOC number saved from the previous test
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

    // Login as MOC Coordinator
    console.log(`\nLogging in as coordinator with user: ${COORDINATOR_USER}`);
    const login = new LoginPage(page);
    await login.goto();
    await login.login(COORDINATOR_USER, COORDINATOR_PASS);
    await login.expectLoggedIn();
    console.log('✓ Logged in successfully as coordinator');

    // Use MOCCoordinatorPage POM to perform approval workflow
    const coordinator = new MOCCoordinatorPage(page);
    
    // Prepare approval data
    const approvalData: MOCApprovalData = {
      mocId: mocNumber,
      decision: 'Pass',
      justification: `MOC ${mocNumber} approved by coordinator - All requirements met`,
      confirmDecision: true
    };

    // Execute the approval workflow
    console.log(`\nStarting approval workflow for MOC: ${mocNumber}`);
    const approvalSuccessful = await coordinator.approveMOC(approvalData);
    
    // Assert that the approval was successful
    expect(approvalSuccessful).toBeTruthy();
    
    console.log(`\n✓ Test completed successfully - MOC ${mocNumber} approved`);
  });
});