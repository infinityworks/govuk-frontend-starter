import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class StartPage extends BasePage {
  startButton: Locator;

  constructor(page: Page) {
    super(page, "Start page");
    this.startButton = page.getByRole("button", { name: "Start now" });
  }

  async goto() {
    await this.page.goto("/apply-juggling-license/start");
    return this;
  }

  async clickStart() {
    await this.startButton.click();
  }
}
