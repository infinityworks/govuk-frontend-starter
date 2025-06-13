import { expect, type Locator, type Page } from "@playwright/test";
import { QuestionPage } from "./QuestionPage";

export class JugglingTrickPage extends QuestionPage {
  trickTextarea: Locator;

  constructor(page: Page) {
    super(page, "Juggling trick page", {
      errorMessage: "Enter your most impressive juggling trick",
    });

    this.trickTextarea = page.getByLabel(
      "What is your most impressive juggling trick?",
    );
  }

  async enterTrick(trick: string) {
    await this.trickTextarea.fill(trick);
    return this;
  }

  async verifyPage() {
    await expect(this.heading).toHaveText(
      "What is your most impressive juggling trick?",
    );
    return this;
  }

  async verifyTrickValue(expectedValue: string) {
    await expect(this.trickTextarea).toHaveValue(expectedValue);
    return this;
  }
}
