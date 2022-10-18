import * as fsP from "node:fs/promises";
import { exec } from "node:child_process";

const FILENAME = new URL(`file://${__filename}`);

async function exists(filepath: URL): Promise<boolean> {
  try {
    await fsP.access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function execute(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      error ? reject(error) : resolve(stdout);
    });
  });
}

export async function onPreBootstrap() {
  // const caipsDir = new URL("./originals/CAIPs", FILENAME);
  // const isCaipsDirPresent = await exists(caipsDir);
  // if (!isCaipsDirPresent) {
  //   await execute(
  //     `git clone https://github.com/ChainAgnostic/CAIPs.git ${caipsDir.pathname}`
  //   );
  // }
}
