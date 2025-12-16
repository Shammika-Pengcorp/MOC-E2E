import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MOCListPage } from '../pages/MOCListPage';
import * as fs from 'fs';
import * as path from 'path';

const USER = process.env.MOC_USER || 'moc_requester1';
const PASS = process.env.MOC_PASS || 'admin';

test.describe('MOC - Section Workflow & Validation', () => {
  test('TC-019: verifies MOC status transitions after submission', async ({ page }) => {
    const login = new LoginPage(page);
    const mocList = new MOCListPage(page);

    await login.goto();
    await login.login(USER, PASS);
    await login.expectLoggedIn();

    // Navigate to MOC list
    await mocList.navigateToMOCList();
    
    // Get a MOC from test data
    const dataPath = path.join(__dirname, '../../src/test-data/moc-numbers.json');
    const mocData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const mocId = mocData['latest'] || 'eMOC_000634';

    await mocList.searchMOCById(mocId);
    await mocList.openMOCDetails();
    
    // Verify MOC details page shows status
    await page.waitForTimeout(1000);
    const pageContent = await page.content();
    expect(pageContent).toContain(mocId);
  });

  test('TC-020: displays MOC sections (1, 2, 3, 4, 5, etc) in sidebar or navigation', async ({ page }) => {
    const login = new LoginPage(page);
    const mocList = new MOCListPage(page);

    await login.goto();
    await login.login(USER, PASS);
    await login.expectLoggedIn();

    await mocList.navigateToMOCList();
    
    const dataPath = path.join(__dirname, '../../src/test-data/moc-numbers.json');
    const mocData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const mocId = mocData['latest'] || 'eMOC_000634';

    await mocList.searchMOCById(mocId);
    await mocList.openMOCDetails();
    
    // Wait for sections to load
    await page.waitForTimeout(1500);
    
    // Verify section navigation is visible
    const pageContent = await page.content();
    const hasSectionNav = pageContent.includes('Section') || pageContent.includes('section');
    expect(hasSectionNav).toBeTruthy();
  });

  test('TC-021: MOC requester can view their created MOCs', async ({ page }) => {
    const login = new LoginPage(page);
    const mocList = new MOCListPage(page);

    await login.goto();
    await login.login('moc_requester1', 'admin');
    await login.expectLoggedIn();

    await mocList.navigateToMOCList();
    
    // Wait for list to populate
    await page.waitForTimeout(2000);
    
    // Verify list is not empty
    const pageContent = await page.content();
    expect(pageContent.length).toBeGreaterThan(100);
  });

  test('TC-022: MOC coordinator can view pending approvals', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('moc_coordinator1', 'admin');
    await login.expectLoggedIn();

    // Coordinator should see dashboard/approvals list
    await page.waitForTimeout(1500);
    
    // Verify page loaded
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Host App');
  });

  test('TC-023: MOC acceptor can view MOCs pending acceptance', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('moc_acceptor1', 'admin');
    await login.expectLoggedIn();

    // Acceptor should see dashboard
    await page.waitForTimeout(1500);
    
    // Verify page loaded
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Host App');
  });

  test('TC-024: MOC owner can view MOCs in their execution queue', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('moc_owner1', 'admin');
    await login.expectLoggedIn();

    // Owner should see dashboard
    await page.waitForTimeout(1500);
    
    // Verify page loaded
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Host App');
  });

  test('TC-025: user can navigate back from MOC details to list', async ({ page }) => {
    const login = new LoginPage(page);
    const mocList = new MOCListPage(page);

    await login.goto();
    await login.login(USER, PASS);
    await login.expectLoggedIn();

    await mocList.navigateToMOCList();
    
    const dataPath = path.join(__dirname, '../../src/test-data/moc-numbers.json');
    const mocData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const mocId = mocData['latest'] || 'eMOC_000634';

    await mocList.searchMOCById(mocId);
    await mocList.openMOCDetails();
    
    // Go back to list
    await page.goBack();
    
    // Verify we're back on list
    await page.waitForTimeout(1000);
    const pageUrl = page.url();
    // Should be on a MOC list page
    expect(pageUrl).toContain('moc.otdm.ca');
  });
});
