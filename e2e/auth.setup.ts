import { execFileSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";
import type { Browser } from "@playwright/test";
import { expect, test as setup } from "@playwright/test";
import { credentials } from "./test-data";

const authDir = path.resolve(__dirname, ".auth");
const appUrlPattern = /\/app(?:\/)?(?:\?.*)?$/;

setup.setTimeout(120_000);

function prepareDatabase() {

  try {
    execFileSync("npm", ["run", "migrate:deploy"], {
      stdio: "inherit",
      env: {
        ...process.env,
      },
    });

    execFileSync("npm", ["run", "seed"], {
      stdio: "inherit",
      env: {
        ...process.env,
      },
    });
  } catch {
    throw new Error(
      "Unable to prepare the Playwright database. Start the test database first, " +
        "for example with `docker compose up -d`, and ensure `DATABASE_URL` is set " +
        "and seed data to run successfully before logging in.",
    );
  }
}

async function submitLoginForm(page: Awaited<ReturnType<Browser["newPage"]>>) {
  await page.getByRole("button", { name: "Sign in" }).click();

  const loginError = page.getByText("Invalid email or password.");

  await Promise.race([
    page.waitForURL(appUrlPattern, { waitUntil: "domcontentloaded" }),
    loginError.waitFor({ state: "visible" }).then(async () => {
      throw new Error(
        `Login did not reach /app for ${page.url()}. ` +
          "The UI reported invalid credentials, so the E2E database likely needs to be seeded.",
      );
    }),
  ]);
}

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
  await submitLoginForm(page);

  await expect(page).toHaveURL(appUrlPattern);
  await expect(page.getByText(email)).toBeVisible();

  await context.storageState({ path: storageStatePath });
  await context.close();
}

setup("authenticate seeded roles", async ({ browser }) => {
  mkdirSync(authDir, { recursive: true });
  prepareDatabase();

  for (const { email, password, storageState } of Object.values(credentials)) {
    await loginAndSaveState(browser, email, password, storageState);
  }
});
