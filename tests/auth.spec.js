// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SignupPage } from '../pages/SignupPage.js';
import { OnboardingPage } from '../pages/OnboardingPage.js';
import { MyAccountPage } from '../pages/MyAccountPage.js';
import { BankAccountPage } from '../pages/BankAccountPage.js';




test.describe('Authentication & Onboarding (POM Pattern)', () => {
  // Ensure tests run in order because they depend on the same user data
  test.describe.configure({ mode: 'serial' });


  const UNIQUE_ID = Date.now().toString().slice(-4);
  const USERNAME = `tamal141_${UNIQUE_ID}`;
  const PASSWORD = `1411`;

  test('E2E Journey: Signup -> Onboard -> Logout -> Re-Login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);
    const onboardingPage = new OnboardingPage(page);
    const myAccountPage = new MyAccountPage(page);



    await test.step('Navigate to Login and click Sign Up', async () => {
      await loginPage.navigate();
      await loginPage.clickSignUp();
    });

    await test.step('Fill out Signup Form and submit', async () => {
      await signupPage.fillSignupForm('Tamal', 'Dev', USERNAME, PASSWORD);
      await signupPage.submitSignup();
    });

    await test.step('Login with newly created account', async () => {
      await expect(page).toHaveURL(/signin/);
      await loginPage.login(USERNAME, PASSWORD);
    });

    await test.step('Complete the Welcome dialog', async () => {
      await onboardingPage.completeWelcomeDialog();
    });

    await test.step('Fill and submit Bank Account details', async () => {
      await onboardingPage.setupBankAccount('Tamal Bank', '123456789', '987654321');
      await onboardingPage.finishOnboarding();
    });

    await test.step('Update user profile settings', async () => {
      // Navigate to My Account
      await page.getByRole('link', { name: /my account/i }).click();
      
      const NEW_EMAIL = `test_${UNIQUE_ID}@example.com`;
      const NEW_PHONE = `555000${UNIQUE_ID}`;
      
      await myAccountPage.updateEmailAndPhone(NEW_EMAIL, NEW_PHONE);
      
      // PRO TIP: The app doesn't show a 'Success' message! 
      // So we RELOAD the page to prove it's saved in the database.
      await page.reload();
      
      // Verify success by checking if the values are still in the inputs after reload
      await expect(myAccountPage.emailInput).toHaveValue(NEW_EMAIL);
      await expect(myAccountPage.phoneInput).toHaveValue(NEW_PHONE);
    });




    await test.step('Logout from the application', async () => {
      await expect(page).not.toHaveURL(/.*\/signin/);
      await onboardingPage.logout();
      await expect(page).toHaveURL(/.*\/signin/);
    });

    await test.step('Verify Re-Login works for the created account', async () => {
      await loginPage.login(USERNAME, PASSWORD);
      await expect(page).not.toHaveURL(/signin/, { timeout: 10000 });
      await expect(page.locator('[data-test="sidenav-username"]')).toBeVisible();
    });
  });

  // Adding a negative test case utilizing the POM structure
  test('Negative: Invalid Login should display error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Navigate & attempt login with bad credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('fakeUser123', 'wrongPassword');
    });

    await test.step('Verify error message appears', async () => {
      await loginPage.verifyErrorIsVisible();
    });
  });

  test('Manage Bank Accounts: Create and Delete', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const bankAccountPage = new BankAccountPage(page);
    const RANDOM_BANK = `MasterBank_${UNIQUE_ID}`;

    await test.step('Login & Navigate to Bank Accounts', async () => {
      await loginPage.navigate();
      await loginPage.login(USERNAME, PASSWORD);
      await page.getByRole('link', { name: /bank accounts/i }).click();
    });

    await test.step('Create a new bank account', async () => {
      await bankAccountPage.createBankAccount(RANDOM_BANK, '111222333', '999888777');
      await expect(page.getByText(RANDOM_BANK)).toBeVisible();
    });

    await test.step('Delete the created bank account', async () => {
      await bankAccountPage.deleteBankAccount(RANDOM_BANK);
      // The row should now say 'Deleted' (based on app behavior)
      await expect(page.locator('li', { hasText: RANDOM_BANK })).toContainText(/deleted/i);
    });
  });

});

