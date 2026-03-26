import { mkdirSync } from "fs";
import path from "path";
import type { Browser } from "@playwright/test";
import { expect, test as setup } from "@playwright/test";
import { credentials } from "./test-data";

const authDir = path.resolve(__dirname, ".auth");

setup.setTimeout(60_000);

async function loginAndSaveState(
  browser: Browser,
  email: string,
  password: string,
  storageStatePath: string,
) {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL("**/app");
  await expect(page.getByText(email)).toBeVisible();

  await context.storageState({ path: storageStatePath });
  await context.close();
}

setup("authenticate seeded roles", async ({ browser }) => {
  mkdirSync(authDir, { recursive: true });

  for (const { email, password, storageState } of Object.values(credentials)) {
    await loginAndSaveState(browser, email, password, storageState);
  }
});
