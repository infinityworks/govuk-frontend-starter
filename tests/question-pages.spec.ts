import { test, expect } from "@playwright/test";
import {
  StartPage,
  JugglingBallsPage,
  JugglingTrickPage,
  CheckAnswersPage,
  ConfirmationPage,
  IneligiblePage,
} from "./page-objects";

test.describe("Apply for a juggling license - functional tests", () => {
  test("complete happy path journey", async ({ page }) => {
    const startPage = new StartPage(page);
    const ballsPage = new JugglingBallsPage(page);
    const trickPage = new JugglingTrickPage(page);
    const checkAnswersPage = new CheckAnswersPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await startPage.goto();
    await startPage.clickStart();

    await ballsPage.verifyPage();
    await ballsPage.selectThreeOrMore();
    await ballsPage.continue();

    await trickPage.verifyPage();
    await trickPage.enterTrick("Cascade while blindfolded");
    await trickPage.continue();

    await checkAnswersPage.verifyPage();
    await checkAnswersPage.verifyAnswers(
      "3 or more",
      "Cascade while blindfolded",
    );
    await checkAnswersPage.submit();

    await confirmationPage.verifyPage();
  });

  test("ineligible path journey", async ({ page }) => {
    const startPage = new StartPage(page);
    const ballsPage = new JugglingBallsPage(page);
    const ineligiblePage = new IneligiblePage(page);

    await startPage.goto();
    await startPage.clickStart();

    await ballsPage.verifyPage();
    await ballsPage.selectOneOrTwo();
    await ballsPage.continue();

    await ineligiblePage.verifyPage();
  });

  test("validation errors on both question pages", async ({ page }) => {
    const startPage = new StartPage(page);
    const ballsPage = new JugglingBallsPage(page);
    const trickPage = new JugglingTrickPage(page);

    await startPage.goto();
    await startPage.clickStart();
    await ballsPage.verifyPage();
    await ballsPage.continue();
    await ballsPage.verifyValidationError();

    await ballsPage.selectThreeOrMore();
    await ballsPage.continue();
    await trickPage.verifyPage();
    await trickPage.continue();
    await trickPage.verifyValidationError();
  });

  test("change answers functionality", async ({ page }) => {
    const startPage = new StartPage(page);
    const ballsPage = new JugglingBallsPage(page);
    const trickPage = new JugglingTrickPage(page);
    const checkAnswersPage = new CheckAnswersPage(page);

    await startPage.goto();
    await startPage.clickStart();
    await ballsPage.selectThreeOrMore();
    await ballsPage.continue();
    await trickPage.enterTrick("Cascade while blindfolded");
    await trickPage.continue();

    await checkAnswersPage.verifyPage();
    await checkAnswersPage.verifyChangeLinksAccessibility();

    await checkAnswersPage.changeBalls();
    await ballsPage.verifyPage();
    await expect(ballsPage.threeBallsRadio).toBeChecked();
    await ballsPage.continue();

    await trickPage.verifyPage();
    await trickPage.verifyTrickValue("Cascade while blindfolded");
    await trickPage.continue();

    await checkAnswersPage.changeTrick();
    await trickPage.verifyPage();
    await trickPage.verifyTrickValue("Cascade while blindfolded");

    await trickPage.enterTrick("Mills Mess");
    await trickPage.continue();

    await checkAnswersPage.verifyPage();
    await checkAnswersPage.verifyAnswers("3 or more", "Mills Mess");
  });

  test("answer persistence when navigating back and refreshing", async ({
    page,
  }) => {
    const startPage = new StartPage(page);
    const ballsPage = new JugglingBallsPage(page);
    const trickPage = new JugglingTrickPage(page);

    await startPage.goto();
    await startPage.clickStart();
    await ballsPage.selectThreeOrMore();
    await ballsPage.continue();
    await page.goBack();
    await expect(ballsPage.threeBallsRadio).toBeChecked();
    await ballsPage.continue();

    await trickPage.enterTrick("Five ball cascade");
    await trickPage.continue();
    await page.goBack();
    await trickPage.verifyTrickValue("Five ball cascade");
    await page.reload();
    await trickPage.verifyTrickValue("Five ball cascade");
  });
});

test.describe("Apply for a juggling license with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("complete journey with JavaScript disabled", async ({ page }) => {
    const startPage = new StartPage(page);
    const ballsPage = new JugglingBallsPage(page);
    const trickPage = new JugglingTrickPage(page);
    const checkAnswersPage = new CheckAnswersPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await startPage.goto();
    await startPage.clickStart();

    await ballsPage.selectThreeOrMore();
    await ballsPage.continue();

    await trickPage.enterTrick("Cascade while blindfolded");
    await trickPage.continue();

    await checkAnswersPage.verifyAnswers(
      "3 or more",
      "Cascade while blindfolded",
    );
    await checkAnswersPage.submit();

    await confirmationPage.verifyPage();
  });
});

test.describe("Accessibility testing for juggling license service", () => {
  test("pages have no automatically detectable accessibility violations", async ({
    page,
  }) => {
    const startPage = new StartPage(page);
    await startPage.goto();
    await startPage.runAccessibilityTests();

    await startPage.clickStart();
    const ballsPage = new JugglingBallsPage(page);
    await ballsPage.runAccessibilityTests();

    await ballsPage.continue();
    await ballsPage.verifyValidationError();
    await ballsPage.runAccessibilityTests();

    await ballsPage.selectThreeOrMore();
    await ballsPage.continue();
    const trickPage = new JugglingTrickPage(page);
    await trickPage.runAccessibilityTests();

    await trickPage.continue();
    await trickPage.verifyValidationError();
    await trickPage.runAccessibilityTests();

    await trickPage.enterTrick("Five ball cascade");
    await trickPage.continue();
    const checkAnswersPage = new CheckAnswersPage(page);
    await checkAnswersPage.runAccessibilityTests();

    await checkAnswersPage.submit();
    const confirmationPage = new ConfirmationPage(page);
    await confirmationPage.runAccessibilityTests();
  });

  test("check answers page has accessible change links", async ({ page }) => {
    const startPage = new StartPage(page);
    const ballsPage = new JugglingBallsPage(page);
    const trickPage = new JugglingTrickPage(page);
    const checkAnswersPage = new CheckAnswersPage(page);

    await startPage.goto();
    await startPage.clickStart();
    await ballsPage.selectThreeOrMore();
    await ballsPage.continue();
    await trickPage.enterTrick("Mills Mess");
    await trickPage.continue();

    await checkAnswersPage.verifyPage();
    await checkAnswersPage.verifyChangeLinksAccessibility();
  });

  test("error summary meets accessibility requirements", async ({ page }) => {
    const startPage = new StartPage(page);
    const ballsPage = new JugglingBallsPage(page);

    await startPage.goto();
    await startPage.clickStart();
    await ballsPage.continue();

    await expect(page).toHaveTitle(/^Error:/);

    const errorSummaryHeading = page.getByRole("heading", {
      name: "There is a problem",
    });
    await expect(errorSummaryHeading).toBeVisible();

    const errorLink = page.getByRole("link", {
      name: "Select how many balls you can juggle",
    });
    await expect(errorLink).toBeVisible();

    await ballsPage.checkErrorSummaryHasFocus();

    await errorLink.click();
    const fieldset = page.locator("fieldset");
    await expect
      .poll(async () => {
        return fieldset.evaluate(
          (el) =>
            document.activeElement === el ||
            el.contains(document.activeElement),
        );
      })
      .toBeTruthy();
  });
});
