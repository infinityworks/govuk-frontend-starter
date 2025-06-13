import { expect, type Locator, type Page } from "@playwright/test";
import { QuestionPage } from "./QuestionPage";

export class JugglingBallsPage extends QuestionPage {
  threeBallsRadio: Locator;
  twoBallsRadio: Locator;
  noneBallsRadio: Locator;

  constructor(page: Page) {
    super(page, "Juggling balls page", {
      errorMessage: "Select how many balls you can juggle",
    });

    this.threeBallsRadio = page.getByLabel("3 or more");
    this.twoBallsRadio = page.getByLabel("1 or 2");
    this.noneBallsRadio = page.getByLabel("None - I cannot juggle");
  }

  async selectThreeOrMore() {
    await this.threeBallsRadio.click();
    return this;
  }

  async selectOneOrTwo() {
    await this.twoBallsRadio.click();
    return this;
  }

  async selectNone() {
    await this.noneBallsRadio.click();
    return this;
  }

  async verifyPage() {
    await expect(this.heading).toHaveText("How many balls can you juggle?");
    return this;
  }
}
