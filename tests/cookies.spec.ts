// @ts-check
import { test, expect } from "@playwright/test";

const scenarios = [
  { name: "with JavaScript", js: true },
  { name: "without JavaScript", js: false },
];

test.describe("Cookie settings page", () => {
  for (const { name, js } of scenarios) {
    test.describe(name, () => {
      test.use({ javaScriptEnabled: js });

      test.beforeEach(async ({ page }) => {
        await page.goto("/cookies");
      });

      test("displays the cookie preferences form with correct initial state", async ({
        page,
      }) => {
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          "Cookies",
        );

        const analyticsGroup = page.getByRole("group", {
          name: /Do you want to accept analytics cookies\?/,
        });
        await expect(analyticsGroup).toBeVisible();
        await expect(analyticsGroup.getByLabel("Yes")).toBeVisible();
        await expect(analyticsGroup.getByLabel("No")).toBeVisible();

        await expect(analyticsGroup.getByLabel("No")).toBeChecked();
      });

      test("can submit analytics cookie preferences", async ({ page }) => {
        const analyticsGroup = page.getByRole("group", {
          name: /Do you want to accept analytics cookies\?/,
        });
        await analyticsGroup.getByLabel("Yes").check();

        await page
          .getByRole("button", { name: "Save cookie settings" })
          .click();

        const notification = page.getByRole("alert");
        await expect(notification).toBeVisible();
        await expect(notification).toContainText(
          "You've set your cookie preferences",
        );

        if (js) {
          await expect(notification).toBeFocused();
        }

        const backLink = notification.getByRole("link", {
          name: "Go back to the page you were looking at",
        });
        await expect(backLink).toBeVisible();
      });

      test("preserves selected preferences on page reload", async ({
        page,
      }) => {
        const analyticsGroup = page.getByRole("group", {
          name: /Do you want to accept analytics cookies\?/,
        });
        const yesRadio = analyticsGroup.getByRole("radio", { name: "Yes" });

        await yesRadio.check();
        await page
          .getByRole("button", { name: "Save cookie settings" })
          .click();

        // Wait for transaction to complete before refreshing
        const notificationBanner = page.getByRole("alert", {
          name: /success/i,
        });
        await expect(notificationBanner).toBeVisible();

        await page.reload();

        await expect(yesRadio).toBeChecked();
      });
    });
  }
});
