// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SignupPage } = require('../pages/SignupPage');
const { OnboardingPage } = require('../pages/OnboardingPage');

// ========================================
// TEST SUITE: POM Authentication Flow
// App Under Test: Real World App (localhost:3000)
// Description: Refactored unified auth journey using the Page Object Model
// ========================================

test.describe('Authentication & Onboarding (POM Pattern)', () => {
  
  // To avoid "User already exists" errors on re-runs, we generate a unique username.
  // The password MUST be at least 4 characters long, otherwise the Submit button stays disabled!
  const UNIQUE_ID = Date.now().toString().slice(-4);
  const USERNAME = `tamal141_${UNIQUE_ID}`;
  const PASSWORD = `1411`;

  test('E2E Journey: Signup -> Onboard -> Logout -> Re-Login', async ({ page }) => {
    
    // Initialize Page Objects
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);
    const onboardingPage = new OnboardingPage(page);

    // ==========================================
    // PHASE 1: Sign up a new user
    // ==========================================
    await test.step('Navigate to Login and click Sign Up', async () => {
      await loginPage.navigate();
      await expect(loginPage.signInButton).toBeVisible();
      await loginPage.clickSignUp();
    });

    await test.step('Fill out Signup Form and submit', async () => {
      await signupPage.fillSignupForm('Tamal', 'Dev', USERNAME, PASSWORD);
      await signupPage.submitSignup();
    });

    // ==========================================
    // PHASE 2: Login and perform onboarding
    // ==========================================
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

    // ==========================================
    // PHASE 3: Logout & Verify Re-Login
    // ==========================================
    await test.step('Logout from the application', async () => {
      await onboardingPage.logout();
    });

    await test.step('Verify Re-Login works for the created account', async () => {
      // Re-Login
      await loginPage.login(USERNAME, PASSWORD);
      
      // Wait to confirm we successfully land on Dashboard (URL changes from /signin)
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
