import { expect, test } from "@playwright/test";
import { getTicketIdByTitle } from "./db";
import { credentials, seededTickets } from "./test-data";

test.use({ storageState: credentials.user.storageState });

test("restricts a standard user to their own tickets", async ({ page }) => {
  await page.goto("/app/tickets");

  await expect(page.getByRole("heading", { name: "Tickets" })).toBeVisible();
  await expect(page.getByRole("link", { name: seededTickets.userVisible })).toBeVisible();
  await expect(page.getByText(seededTickets.adminOnly)).toHaveCount(0);
});

test("redirects a standard user away from another user's ticket detail page", async ({ page }) => {
  const ticketId = await getTicketIdByTitle(seededTickets.adminOnly);

  await page.goto(`/app/tickets/${ticketId}`);

  await page.waitForURL("**/app/forbidden");
  await expect(page.getByRole("heading", { name: "Forbidden" })).toBeVisible();
});
