// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SignupPage } from '../pages/SignupPage.js';
import { OnboardingPage } from '../pages/OnboardingPage.js';

test.describe('Authentication & Onboarding (POM Pattern)', () => {

  const UNIQUE_ID = Date.now().toString().slice(-4);
  const USERNAME = `tamal141_${UNIQUE_ID}`;
  const PASSWORD = `1411`;

  test('E2E Journey: Signup -> Onboard -> Logout -> Re-Login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);
    const onboardingPage = new OnboardingPage(page);

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

    await test.step('Logout from the application', async () => {
      await onboardingPage.logout();
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

});
