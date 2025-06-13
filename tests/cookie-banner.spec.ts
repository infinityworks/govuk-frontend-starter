// @ts-check
import { test, expect } from "@playwright/test";

const SELECTORS = {
  banner: '[aria-label="Cookies on [name of service]"]',
  messageContainer: ".govuk-cookie-banner__message",
  heading: ".govuk-cookie-banner__heading",
  acceptButton: 'button:text("Accept analytics cookies")',
  rejectButton: 'button:text("Reject analytics cookies")',
  hideButton: 'button:text("Hide cookie message")',
  viewLink: 'a:text("View cookies")',
  acceptConfirmation:
    '.govuk-cookie-banner__message:has-text("You\'ve accepted analytics cookies")',
  rejectConfirmation:
    '.govuk-cookie-banner__message:has-text("You\'ve rejected analytics cookies")',
};

test.describe("Cookie banner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays cookie banner with correct initial state", async ({
    page,
  }) => {
    await expect(page.locator(SELECTORS.banner)).toBeVisible();
    await expect(page.locator(SELECTORS.heading)).toHaveText(
      "Cookies on [name of service]",
    );

    const messageContent = page.locator(SELECTORS.messageContainer).first();
    await expect(messageContent).toContainText(
      "We use some essential cookies to make this service work",
    );
    await expect(messageContent).toContainText(
      "We'd also like to use analytics cookies",
    );

    await expect(page.locator(SELECTORS.acceptButton)).toBeVisible();
    await expect(page.locator(SELECTORS.rejectButton)).toBeVisible();
    await expect(page.locator(SELECTORS.viewLink)).toBeVisible();
  });

  test("accepting cookies shows confirmation message", async ({ page }) => {
    await page.locator(SELECTORS.acceptButton).click();

    const confirmationMessage = page.locator(SELECTORS.acceptConfirmation);
    await expect(confirmationMessage).toBeVisible();
    await expect(confirmationMessage).toContainText(
      "You can change your cookie settings",
    );
    await expect(confirmationMessage).toHaveAttribute("role", "alert");

    await expect(page.locator(SELECTORS.hideButton)).toBeVisible();
  });

  test("rejecting cookies shows confirmation message", async ({ page }) => {
    await page.locator(SELECTORS.rejectButton).click();

    const confirmationMessage = page.locator(SELECTORS.rejectConfirmation);
    await expect(confirmationMessage).toBeVisible();
    await expect(confirmationMessage).toContainText(
      "You can change your cookie settings",
    );
    await expect(confirmationMessage).toHaveAttribute("role", "alert");

    await expect(page.locator(SELECTORS.hideButton)).toBeVisible();
  });

  test("hides banner when clicking hide message button", async ({ page }) => {
    await page.locator(SELECTORS.acceptButton).click();

    await page.locator(SELECTORS.hideButton).click();

    await expect(page.locator(SELECTORS.banner)).toBeHidden();
  });

  test("navigates to cookie page when clicking view cookies link", async ({
    page,
  }) => {
    await page.locator(SELECTORS.viewLink).click();

    await expect(page).toHaveURL(/.*\/cookies$/);
  });

  test("meets accessibility requirements", async ({ page }) => {
    await expect(page.locator(SELECTORS.banner)).toHaveAttribute(
      "aria-label",
      "Cookies on [name of service]",
    );
    await expect(page.locator(SELECTORS.banner)).toHaveAttribute(
      "role",
      "region",
    );

    const html = await page.content();
    const bannerPosition = html.indexOf("govuk-cookie-banner");
    const skipLinkPosition = html.indexOf("govuk-skip-link");
    expect(bannerPosition).toBeLessThan(skipLinkPosition);

    await page.locator(SELECTORS.acceptButton).click();
    await expect(page.locator(SELECTORS.acceptConfirmation)).toHaveAttribute(
      "role",
      "alert",
    );
  });

  test("remembers user preference on subsequent visits", async ({
    page,
    context,
  }) => {
    await page.locator(SELECTORS.acceptButton).click();

    const cookies = await context.cookies();
    expect(
      cookies.some((cookie) => cookie.name.includes("cookie_policy")),
    ).toBeTruthy();

    // Wait for transaction to complete before refreshing
    const confirmationMessage = page.getByText(
      /you've accepted analytics cookies/i,
    );
    await expect(confirmationMessage).toBeVisible();

    await page.reload();

    await expect(page.locator(SELECTORS.banner)).toBeHidden();
  });
});
