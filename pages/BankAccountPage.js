import { expect } from '@playwright/test';

/**
 * Page Object for Bank Accounts management
 */
export class BankAccountPage {
  constructor(page) {
    this.page = page;
    
    // Create Button in the list
    this.createButton = page.locator('[data-test="bankaccount-new"]');
    
    // Creation Form Fields
    this.bankNameInput = page.locator('#bankaccount-bankName-input');
    this.routingNumberInput = page.locator('#bankaccount-routingNumber-input');
    this.accountNumberInput = page.locator('#bankaccount-accountNumber-input');
    this.saveButton = page.locator('[data-test="bankaccount-submit"]');
  }

  /**
   * Navigates to the Create form and fills it out
   */
  async createBankAccount(bankName, routing, account) {
    await this.createButton.click();
    await this.bankNameInput.fill(bankName);
    await this.routingNumberInput.fill(routing);
    await this.accountNumberInput.fill(account);
    await this.saveButton.click();
  }

  /**
   * SMART DELETE: Finds the specific bank by name and deletes it
   * This overcomes the "Hurdle" of multiple delete buttons!
   */
  async deleteBankAccount(bankName) {
    // 1. Find the specific row that has the Bank Name
    const bankRow = this.page.getByRole('listitem').filter({ hasText: bankName });
    
    // 2. Click the Delete button INSIDE that row ONLY
    await bankRow.getByRole('button', { name: /delete/i }).click();
    
    // 3. Optional: Verify the text "Deleted" appears or the row disappears
    await expect(bankRow).toContainText(/deleted/i);
  }
}
