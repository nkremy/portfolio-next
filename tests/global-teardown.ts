import { execSync } from "child_process";

export default async function globalTeardown() {
  try {
    execSync("docker rm -f portfolio-mongo-test", { stdio: "pipe" });
  } catch {
    // ignore
  }
}
