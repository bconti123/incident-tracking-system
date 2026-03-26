import { expect, test } from "@playwright/test";
import { credentials, seededTickets } from "./test-data";

test.describe("ticket filters", () => {
  test.use({ storageState: credentials.support.storageState });

  test("support can filter tickets by search, status, and priority", async ({ page }) => {
    await page.goto("/app/tickets");

    await page.locator('input[name="q"]').fill("RBAC permissions");
    await page.locator('select[name="status"]').selectOption("OPEN");
    await page.locator('select[name="priority"]').selectOption("URGENT");
    await page.getByRole("button", { name: "Filter" }).click();

    await expect(page).toHaveURL(/q=RBAC\+permissions|q=RBAC%20permissions/);
    await expect(page).toHaveURL(/status=OPEN/);
    await expect(page).toHaveURL(/priority=URGENT/);
    await expect(page.getByRole("link", { name: seededTickets.adminOnly })).toBeVisible();
    await expect(page.getByText("Dark mode toggle not persisting")).toHaveCount(0);
  });

  test("support can filter for unassigned tickets", async ({ page }) => {
    await page.goto("/app/tickets");

    await page.locator('select[name="assignedToId"]').selectOption("null");
    await page.getByRole("button", { name: "Filter" }).click();

    await expect(page).toHaveURL(/assignedToId=null/);
    await expect(page.getByRole("link", { name: seededTickets.userVisible })).toBeVisible();
    await expect(page.getByRole("link", { name: seededTickets.supportVisibleUnassigned })).toBeVisible();
    await expect(page.getByRole("link", { name: seededTickets.adminOnly })).toHaveCount(0);
  });
});
