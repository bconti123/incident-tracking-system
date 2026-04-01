import { execFileSync } from "child_process";
import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ override: true, quiet: true });

export async function getTicketIdByTitle(title: string) {
  const scriptPath = path.resolve(__dirname, "get-ticket-id.ts");
  return execFileSync("npx", ["tsx", scriptPath, title], {
    encoding: "utf8",
    env: {
      ...process.env,
    },
  }).trim();
}
