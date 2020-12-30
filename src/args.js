import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

function getDnaPath(provisionalPath) {
  if (fs.existsSync(provisionalPath)) {
    return provisionalPath;
  } else if (fs.existsSync(__dirname + provisionalPath)) {
    return __dirname + provisionalPath;
  } else {
    throw new Error(`Couldn't file dna with path ${provisionalPath}`);
  }
}

function badInput() {
  throw new Error(`
  Bad input!
  USAGE: holochain-run-dna -p [PORT] [DNA_PATH, DNA_PATH...]
`);
}

export function getAppToInstall() {
  const yarg = yargs(hideBin(process.argv))
    .help()
    .option("port", {
      alias: "p",
      type: "integer",
      default: 8888,
      description:
        "port where the application interface of the conductor will be attached",
    })
    .option("admin-port", {
      alias: "a",
      type: "integer",
      description:
        "port where the admin interface of the conductor will be attached",
    })
    .option("proxy-url", {
      alias: "u",
      type: "string",
      description: "proxy URL for network configuration",
    })
    .option("run-path", {
      alias: "r",
      type: "string",
      description: "path to existing configuration and data use storing data",
    })
    .option("installed-app-id", {
      alias: "i",
      type: "string",
      default: "test-app",
      description: "installed app id",
    }).argv;

  const paths = yarg._;

  if (paths.length === 0) badInput();

  const dnas = paths.map((arg) => getDnaPath(arg));

  return {
    installedAppId: yarg.installedAppId,
    appPort: yarg.port,
    adminPort: yarg.adminPort,
    dnas,
    runPath: yarg.runPath,
    proxyUrl: yarg.proxyUrl,
  };
}
