import { expect, type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class IneligiblePage extends BasePage {
  heading: Locator;

  constructor(page: Page) {
    super(page, "Ineligible page");
    this.heading = page.getByRole("heading", { level: 1 });
  }

  async verifyPage() {
    await expect(this.heading).toHaveText("Not eligible");
    return this;
  }
}
