import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

interface QuestionPageOptions {
  errorMessage?: string;
}

/**
 * Base class for all question pages with shared functionality
 * Handles common error validation and accessibility checks
 */
export class QuestionPage extends BasePage {
  heading: Locator;
  continueButton: Locator;
  errorMessage?: Locator;
  errorMessageText?: string;
  errorSummaryHeading?: Locator;
  errorSummaryContainer?: Locator;
  errorSummaryAlert?: Locator;
  errorSummaryLink?: Locator;

  /**
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {string} pageName - Name of the page for reporting purposes
   * @param {Object} options - Options for configuring the question page
   * @param {string} options.errorMessage - Expected error message text
   */
  constructor(page: Page, pageName: string, options: QuestionPageOptions = {}) {
    super(page, pageName);

    this.heading = page.getByRole("heading", { level: 1 });
    this.continueButton = page.getByRole("button", { name: "Continue" });

    this.errorMessageText = options.errorMessage;

    if (this.errorMessageText) {
      this.errorMessage = page
        .locator(".govuk-error-message")
        .filter({ hasText: this.errorMessageText });

      this.errorSummaryHeading = page.getByRole("heading", {
        name: "There is a problem",
      });
      this.errorSummaryContainer = page.locator(".govuk-error-summary");
      this.errorSummaryAlert =
        this.errorSummaryContainer.locator('div[role="alert"]');
      this.errorSummaryLink = page.getByRole("link", {
        name: this.errorMessageText,
      });
    }
  }

  /**
   * Check if error handling is configured
   */
  private hasErrorHandling(): boolean {
    return !!(
      this.errorMessage &&
      this.errorSummaryHeading &&
      this.errorSummaryContainer &&
      this.errorSummaryAlert &&
      this.errorSummaryLink
    );
  }

  /**
   * Continue to the next page
   */
  async continue() {
    await this.continueButton.click();
  }

  /**
   * Verify validation error appears correctly
   * @throws {Error} If error handling is not configured
   */
  async verifyValidationError() {
    if (!this.hasErrorHandling()) {
      throw new Error(
        "Error handling not configured. Provide errorMessage option in constructor.",
      );
    }

    await expect(this.errorMessage!).toBeVisible();
    await expect(this.errorSummaryHeading!).toBeVisible();
    await expect(this.errorSummaryLink!).toBeVisible();

    const formGroup = this.page.locator(".govuk-form-group");
    await expect(formGroup).toHaveClass(/govuk-form-group--error/);

    return this;
  }

  /**
   * Verify all accessibility requirements for error summary
   * @throws {Error} If error handling is not configured
   */
  async verifyErrorSummaryAccessibility() {
    if (!this.hasErrorHandling()) {
      throw new Error(
        "Error handling not configured. Provide errorMessage option in constructor.",
      );
    }

    await expect(this.page).toHaveTitle(/^Error:/);
    await expect(this.errorSummaryHeading!).toBeVisible();
    await expect(this.errorSummaryLink!).toBeVisible();

    const hasVisuallyHiddenError = await this.errorMessage!.evaluate((el) => {
      const span = el.querySelector(".govuk-visually-hidden");
      return span && span.textContent?.trim() === "Error:";
    });
    expect(hasVisuallyHiddenError).toBeTruthy();

    const fieldErrorText = await this.errorMessage!.textContent();
    const summaryErrorText = await this.errorSummaryLink!.textContent();

    const normalisedFieldError = fieldErrorText
      ?.replace(/^Error:\s*/i, "")
      .trim();
    expect(summaryErrorText?.trim()).toEqual(normalisedFieldError);

    return this;
  }

  /**
   * Check if error summary has focus when validation error occurs
   * @throws {Error} If error handling is not configured
   */
  async checkErrorSummaryHasFocus() {
    if (!this.hasErrorHandling()) {
      throw new Error(
        "Error handling not configured. Provide errorMessage option in constructor.",
      );
    }

    let hasFocus = false;

    try {
      await expect(this.errorSummaryContainer!).toBeFocused({ timeout: 1000 });
      hasFocus = true;
    } catch {
      try {
        await expect(this.errorSummaryAlert!).toBeFocused({ timeout: 1000 });
        hasFocus = true;
      } catch {
        hasFocus = false;
      }
    }

    expect(hasFocus, "Error summary should receive focus").toBeTruthy();
    return this;
  }
}
