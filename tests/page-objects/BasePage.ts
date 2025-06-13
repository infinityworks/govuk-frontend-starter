import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Base Page Object class that all page objects should inherit from
 * Provides common functionality including accessibility testing
 */
export class BasePage {
  page: Page;
  pageName: string;

  constructor(page: Page, pageName: string) {
    this.page = page;
    this.pageName = pageName;
  }

  /**
   * Run accessibility tests on the current page to check for WCAG 2.2 AA violations
   * @returns {Promise<void>}
   */
  async runAccessibilityTests() {
    const axeBuilder = new AxeBuilder({ page: this.page }).withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
      "wcag22a",
      "wcag22aa",
    ]);

    const accessibilityScanResults = await axeBuilder.analyze();

    console.log(`\nAccessibility test for page: ${this.pageName}`);
    console.log(
      `Total violations: ${accessibilityScanResults.violations.length}`,
    );

    expect(
      accessibilityScanResults.violations,
      `Page "${this.pageName}" should not have any WCAG 2.2 AA violations`,
    ).toEqual([]);
  }
}
