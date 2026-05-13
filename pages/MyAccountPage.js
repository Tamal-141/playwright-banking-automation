import { expect } from '@playwright/test';

/**
 * Page Object for My Account (User Settings)
 */
export class MyAccountPage {
  constructor(page) {
    this.page = page;
    
    // Using simple IDs as requested
    this.firstNameInput = page.locator('#user-settings-firstName-input');
    this.lastNameInput = page.locator('#user-settings-lastName-input');
    this.emailInput = page.locator('#user-settings-email-input');
    this.phoneInput = page.locator('#user-settings-phoneNumber-input');
    
    // The SAVE button usually has a specific text or data-test
    this.saveButton = page.getByRole('button', { name: /save/i });
  }

  /**
   * Updates only the email and phone number with professional stability
   */
  async updateEmailAndPhone(newEmail, newPhone) {
    // Fill the email and then PRESS TAB to trigger the next field! 
    await this.emailInput.fill(newEmail);
    await this.page.keyboard.press('Tab');
    
    // Fill the phone, then PRESS TAB again to enable the SAVE button!
    await this.phoneInput.fill(newPhone);
    await this.page.keyboard.press('Tab');
    
    // Critical DevOps Check: Ensure the button is actually BLUE (Enabled)
    await expect(this.saveButton).not.toBeDisabled();
    
    await this.saveButton.click();
  }

}
