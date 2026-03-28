const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('button[type="submit"]');
    this.signUpLink = page.getByRole('link', { name: /sign up/i });
    this.errorMessage = page.getByText(/username or password is invalid/i);
    this.header = page.getByRole('heading', { name: 'Sign in' });
  }

  async navigate() {
    await this.page.goto('/signin');
    await this.page.waitForURL('**/signin');
    await expect(this.header).toBeVisible();
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async clickSignUp() {
    // Retry block for flaky React hydration clicks
    await expect(async () => {
      await this.signUpLink.click();
      await expect(this.page).toHaveURL(/signup/);
    }).toPass({ timeout: 10000 });
  }

  async verifyErrorIsVisible() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }
};
