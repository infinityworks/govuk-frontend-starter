import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckAnswersPage extends BasePage {
  heading: Locator;
  submitButton: Locator;
  changeBallsLink: Locator;
  changeTrickLink: Locator;

  constructor(page: Page) {
    super(page, "Check answers page");

    this.heading = page.getByRole("heading", { level: 1 });
    this.submitButton = page.getByRole("button", {
      name: /^(?:Accept and send|Confirm and send|Submit)$/,
    });
    this.changeBallsLink = page.getByRole("link", { name: /Change.*balls/ });
    this.changeTrickLink = page.getByRole("link", {
      name: /Change.*juggling trick/,
    });
  }

  async verifyPage() {
    await expect(this.heading).toContainText("Check your answers");
    return this;
  }

  async verifyAnswers(numberOfBalls: string, trick: string) {
    await expect(
      this.page.getByText(numberOfBalls, { exact: false }),
    ).toBeVisible();
    await expect(this.page.getByText(trick, { exact: false })).toBeVisible();
    return this;
  }

  async submit() {
    await this.submitButton.click();
  }

  async changeBalls() {
    await this.changeBallsLink.click();
  }

  async changeTrick() {
    await this.changeTrickLink.click();
  }

  async verifyChangeLinksAccessibility() {
    const ballsLinkHTML = await this.changeBallsLink.evaluate(
      (el) => el.outerHTML,
    );
    const trickLinkHTML = await this.changeTrickLink.evaluate(
      (el) => el.outerHTML,
    );

    expect(ballsLinkHTML).toContain("govuk-visually-hidden");
    expect(trickLinkHTML).toContain("govuk-visually-hidden");

    expect(ballsLinkHTML.toLowerCase()).toContain(
      "number of balls you can juggle",
    );
    expect(trickLinkHTML.toLowerCase()).toContain("juggling trick");

    return this;
  }
}
