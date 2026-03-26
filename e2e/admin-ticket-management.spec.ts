import { expect, test } from "@playwright/test";
import { credentials } from "./test-data";

test.use({ storageState: credentials.admin.storageState });

test("admin can create and update a ticket", async ({ page }) => {
  const title = `Playwright ticket ${Date.now()}`;
  const description = "Created by the Playwright E2E suite.";

  await page.goto("/app/tickets/new");
  await page.locator('input[name="title"]').fill(title);
  await page.locator('textarea[name="description"]').fill(description);
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForURL(/\/app\/tickets\/.+/);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText(description)).toBeVisible();

  await page.locator('select[name="status"]').selectOption("BLOCKED");
  await page.locator('select[name="priority"]').selectOption("URGENT");
  await page.locator('select[name="assignedToId"]').selectOption({
    label: "support@test.com (SUPPORT)",
  });
  await page.getByRole("button", { name: "Save" }).click();

  const detailsCard = page.locator("div.rounded-lg.border.border-gray-200.bg-white.p-6").first();

  await expect(detailsCard.getByText("BLOCKED", { exact: true })).toBeVisible();
  await expect(detailsCard.getByText("URGENT", { exact: true })).toBeVisible();
  await expect(detailsCard.getByText("support@test.com", { exact: true })).toBeVisible();
});
