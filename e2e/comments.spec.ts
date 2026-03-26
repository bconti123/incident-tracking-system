import { expect, test } from "@playwright/test";
import { credentials, seededTickets } from "./test-data";

test.describe("ticket comments", () => {
  test.use({ storageState: credentials.user.storageState });

  test("user can add, edit, and delete a comment on an owned ticket", async ({ page }) => {
    const body = `Playwright comment ${Date.now()}`;
    const updatedBody = `${body} updated`;

    await page.goto("/app/tickets");
    await page.getByRole("link", { name: seededTickets.userVisible }).click();

    await page.locator('textarea[name="body"]').fill(body);
    await page.getByRole("button", { name: "Add Comment" }).click();

    const commentCard = page.locator("div.rounded-md.border.border-gray-200.bg-gray-50").filter({
      hasText: body,
    });

    await expect(commentCard.getByText(body, { exact: true })).toBeVisible();
    await commentCard.getByRole("button", { name: "Edit" }).click();
    await commentCard.locator('textarea[name="body"]').fill(updatedBody);
    await commentCard.getByRole("button", { name: "Save" }).click();

    const updatedCommentCard = page.locator("div.rounded-md.border.border-gray-200.bg-gray-50").filter({
      hasText: updatedBody,
    });

    await expect(updatedCommentCard.getByText(updatedBody, { exact: true })).toBeVisible();
    await expect(updatedCommentCard.getByText("(edited)")).toBeVisible();

    const deletedComments = page.getByText("Comment deleted");
    const deletedCountBefore = await deletedComments.count();

    await updatedCommentCard.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText(updatedBody, { exact: true })).toHaveCount(0);
    await expect(deletedComments).toHaveCount(deletedCountBefore + 1);
  });
});
