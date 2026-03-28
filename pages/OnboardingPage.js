const { expect } = require('@playwright/test');

exports.OnboardingPage = class OnboardingPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.nextButton = page.locator('[data-test="user-onboarding-next"]');
    
    this.bankNameInput = page.getByRole('textbox', { name: 'Bank Name' });
    this.routingNumberInput = page.getByRole('textbox', { name: 'Routing Number' });
    this.accountNumberInput = page.getByRole('textbox', { name: 'Account Number' });
    
    this.submitBankButton = page.locator('[data-test="bankaccount-submit"]');
    this.signOutButton = page.locator('[data-test="sidenav-signout"]');
  }

  async completeWelcomeDialog() {
    await this.nextButton.click();
  }

  async setupBankAccount(bankName, routing, account) {
    await this.bankNameInput.fill(bankName);
    await this.routingNumberInput.fill(routing);
    await this.accountNumberInput.fill(account);
    await this.submitBankButton.click();
  }

  async finishOnboarding() {
    await this.nextButton.click();
    // Wait until URL proves onboarding is over (we hit the dashboard)
    await expect(this.page).not.toHaveURL(/signin/, { timeout: 10000 });
  }

  async logout() {
    await this.signOutButton.click();
    await this.page.waitForURL('**/signin');
  }
};
