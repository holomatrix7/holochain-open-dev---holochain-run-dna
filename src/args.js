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

function noIdleM() {
  throw new Error(`
  Bad input! Cannot use -m flag without providing a path to config.
  USAGE : holochain-run-dna -c <path/to/config.yml> [-m]
`);
}

function badInput() {
  throw new Error(`
  Bad input!
  CONFIG  FILE  USAGE : holochain-run-dna -c <path/to/config.yml> [-m]
  CLI  ARGUMENT USAGE : holochain-run-dna -p [PORT] -a [ADMIN PORT] -i [INSTALLED-APP-ID] -r [RUN PATH] -u [PROXY URL] [DNA_PATH, DNA_PATH...]
`);
}

export function getAppToInstall() {
  const yarg = yargs(hideBin(process.argv)).help()
        .option("port", {
          alias: "p",
          type: "integer",
          default: 8888,
          description: "port",
        })
        .option("admin-port", {
          alias: "a",
          type: "integer",
          default: 1234,
          description: "admin port"
        })
        .option("proxy-url", {
          alias: "u",
          type: "string",
          description: "proxy URL for network configuration"
        })
        .option("run-path", {
          alias: "r",
          type: "string",
          description: "path to existing configuration and data use storing data"
        })
        .option("installed-app-id", {
          alias: "i",
          type: "string",
          default: "test-app",
          description: "installed app id"
        })
        .option("config", {
          alias: "c",
          type: "string",
          description: "path to happ config file"
        })
        .option("multiple-agents", {
          alias: "m",
          boolean: true,
          description: "flag informing whether all apps in config should share an agent or each have their own."
        })
        .argv;

  const paths = yarg._;
  if (!yarg.config){
    if (yarg.multipleAgents) noIdleM()
    else if (paths.length === 0) badInput();
  }

  const dnas = paths.map((arg) => getDnaPath(arg));

  return {
    installedAppId: yarg.installedAppId,
    appPort: yarg.port,
    adminPort: yarg.adminPort,
    dnas,
    runPath: yarg.runPath,
    proxyUrl: yarg.proxyUrl,
    happs: yarg.config,
    multipleAgents: yarg.multipleAgents,
  };
}
