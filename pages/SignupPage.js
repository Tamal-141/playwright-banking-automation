export class SignupPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    // Playwright needs exact locators when role descriptions match multiple elements
    this.passwordInput = page.locator('[data-test="signup-password"]').getByRole('textbox', { name: 'Password' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
    this.submitButton = page.locator('[data-test="signup-submit"]');
  }

  async fillSignupForm(firstName, lastName, username, password) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async submitSignup() {
    await this.submitButton.click();
    await this.page.waitForURL('**/signin');
  }
}
