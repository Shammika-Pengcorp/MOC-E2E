import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MOCApproverSection46Page, ApprovalData } from '../pages/MOCApproverSection46Page';
import * as fs from 'fs';
import * as path from 'path';

test.describe('MOC - Approver Section 4.6 Workflow', () => {
  let loginPage: LoginPage;
  let approverPage: MOCApproverSection46Page;
  let mocId: string;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    approverPage = new MOCApproverSection46Page(page);

    // Read MOC ID from JSON file
    const mocFilePath = path.join(__dirname, '../test-data/moc-numbers.json');
    try {
      const fileContent = fs.readFileSync(mocFilePath, 'utf-8');
      const mocData = JSON.parse(fileContent);
      mocId = mocData['latest'];
      console.log(`✓ Retrieved MOC number from file: ${mocId}`);
    } catch (error) {
      throw new Error(`Failed to read MOC number from ${mocFilePath}: ${error}`);
    }

    if (!mocId) {
      throw new Error('No MOC number found in test data. Please run Section 1 creation test first.');
    }

    // Login as MOC Approver
    console.log('Logging in as approver with user: moc_approver');
    await loginPage.goto();
    await loginPage.login('moc_approver1', 'admin');
    await loginPage.expectLoggedIn();
    console.log('✓ Logged in successfully as approver');
  });

  test('should search for MOC and approve Section 4.6 as MOC Approver', async ({ page }) => {
    console.log(`\nStarting approval workflow for MOC: ${mocId}`);

    // Navigate to MOC List
    await approverPage.navigateToMOCList();

    // Search for MOC
    await approverPage.searchMOCById(mocId);

    // Execute search
    await approverPage.executeSearch();

    // Verify MOC is in list
    await approverPage.verifyMOCInList(mocId);

    // Open MOC Details
    await approverPage.openMOCDetails();

    // Navigate to Section 4.6
    await approverPage.navigateToSection46();
    await approverPage.verifySection46Visible();

    await page.getByRole('checkbox').check();


    await page.getByRole('button', { name: 'Release Approval' }).click();
    await page.getByRole('button', { name: 'Approve', exact: true }).click();
    await page.getByRole('textbox', { name: 'Add comment' }).click();
    await page.getByRole('textbox', { name: 'Add comment' }).fill('approved by approver1');
    await page.getByRole('dialog', { name: 'Approve Remark Button' }).getByLabel('Approve').click();
    await expect(page.getByRole('alert')).toContainText('Submit for Approval successfully.');

    // // Fill approval comments
    // const approvalComments = `MOC ${mocId} approved by approver - Section 4.6 execution planning verified and approved`;
    // await approverPage.fillApprovalJustification(approvalComments);

    // // Submit approval
    // await approverPage.submitApprovalDecision('Approve');

    // // Verify success
    // await approverPage.verifyApprovalSuccess();

    console.log('✓ Test completed successfully - MOC Section 4.6 approved');
  });

  test.skip('should reject MOC Section 4.6 with comments as MOC Approver', async ({ page }) => {
    console.log(`\nStarting rejection workflow for MOC: ${mocId}`);

    // Navigate to MOC List
    await approverPage.navigateToMOCList();

    // Search for MOC
    await approverPage.searchMOCById(mocId);

    // Execute search
    await approverPage.executeSearch();

    // Verify MOC is in list
    await approverPage.verifyMOCInList(mocId);

    // Open MOC Details
    await approverPage.openMOCDetails();

    // Navigate to Section 4.6
    await approverPage.navigateToSection46();
    await approverPage.verifySection46Visible();

    // Fill rejection comments
    const rejectionComments = `MOC ${mocId} requires changes - Section 4.6 execution planning needs revision`;
    await approverPage.fillApprovalJustification(rejectionComments);

    // Submit rejection
    await approverPage.submitApprovalDecision('Reject');

    // Verify success
    await approverPage.verifyApprovalSuccess();

    console.log('✓ Test completed successfully - MOC Section 4.6 rejected with comments');
  });

  test.skip('should request changes for MOC Section 4.6 as MOC Approver', async ({ page }) => {
    console.log(`\nStarting change request workflow for MOC: ${mocId}`);

    // Navigate to MOC List
    await approverPage.navigateToMOCList();

    // Search for MOC
    await approverPage.searchMOCById(mocId);

    // Execute search
    await approverPage.executeSearch();

    // Verify MOC is in list
    await approverPage.verifyMOCInList(mocId);

    // Open MOC Details
    await approverPage.openMOCDetails();

    // Navigate to Section 4.6
    await approverPage.navigateToSection46();
    await approverPage.verifySection46Visible();

    // Fill change request comments
    const changeComments = `MOC ${mocId} - Please provide additional details in Section 4.6 milestone schedule and approver assignment`;
    await approverPage.fillApprovalJustification(changeComments);

    // Submit change request
    await approverPage.submitApprovalDecision('Request Changes');

    // Verify success
    await approverPage.verifyApprovalSuccess();

    console.log('✓ Test completed successfully - Change request submitted for MOC Section 4.6');
  });
});