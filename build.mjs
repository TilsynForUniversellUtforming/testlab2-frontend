import { spawn } from "node:child_process";
import { cp } from "node:fs/promises";

function run_command(command, directory = ".") {
  const parent_process = process;

  return new Promise((resolve, reject) => {
    const child_process = spawn(command, {
      cwd: directory,
      shell: true,
    });

    child_process.stdout.pipe(parent_process.stdout);
    child_process.stderr.pipe(parent_process.stderr);

    child_process.on("error", reject);
    child_process.on("exit", resolve);
  });
}

run_command("./mvnw clean")
  .then(() => run_command("npm ci", "frontend"))
  .then(() => run_command("npm run build", "frontend"))
  .then(() => cp("frontend/dist", "target/classes/public", { recursive: true }))
  .then(() => run_command("./mvnw test jib:build"));
