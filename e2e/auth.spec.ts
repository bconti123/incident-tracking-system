import { expect, test } from "@playwright/test";
import { credentials } from "./test-data";

test("shows an error for invalid credentials", async ({ page }) => {
  await page.goto("/login");

  await page.locator('input[name="email"]').fill(credentials.admin.email);
  await page.locator('input[name="password"]').fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Invalid email or password.")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("logs in with seeded credentials", async ({ page }) => {
  await page.goto("/login");

  await page.locator('input[name="email"]').fill(credentials.support.email);
  await page.locator('input[name="password"]').fill(credentials.support.password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL("**/app");
  await expect(page.getByRole("heading", { name: /welcome support/i })).toBeVisible();
  await expect(page.getByText(/support@test\.com/i)).toBeVisible();
});
