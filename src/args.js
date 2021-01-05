import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
const chalk = require('chalk');

function getDnaPath(provisionalPath) {
  if (fs.existsSync(provisionalPath)) {
    return provisionalPath;
  } else if (fs.existsSync(__dirname + provisionalPath)) {
    return __dirname + provisionalPath;
  } else {
    throw new Error(`Couldn't file dna with path ${provisionalPath}`);
  }
}

function inputGuide(msg, help = false) {
  const logMsg = msg || '';
  throw new Error(`
  ${help ? chalk.bold.yellow('Usage Guide:') : chalk.bold.red('Bad input! ' + logMsg)}
  CONFIG  FILE  USAGE : holochain-run-dna -c <path/to/config.yml> [-m] -s [OPEN ADMIN PORT]
  CLI  ARGUMENT USAGE : holochain-run-dna -p [PORT] -a [ADMIN PORT] -i [INSTALLED-APP-ID] -r [RUN PATH] -u [PROXY URL] -s [OPEN ADMIN PORT] [DNA_PATH, DNA_PATH...]
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
    })
    .option("config", {
      alias: "c",
      type: "string",
      description: "path to happ config file"
    })
    .option("multiple-agents", {
      alias: "m",
      boolean: true,
      description: "flag informing whether all apps in config should share an agent or each have their own"
    })
    .option("skip-conductor-setup", {
      alias: "s",
      type: "integer",
      description: "open port where the admin interface is running (this will automatically skip internal holochain setup and connect to running conductor instead).",
    })
    .help('info')
    .argv;

  const paths = yarg._;

  if (yarg.help) inputGuide(null, yarg.help);

  if (yarg.skipConductorSetup && (typeof yarg.skipConductorSetup !== 'number')) inputGuide('Cannot use -s flag without providing a port number of type integer.');

  if (!yarg.config){
    if (yarg.multipleAgents) inputGuide('Cannot use -m flag without providing a path to config.');
    else if (paths.length === 0) inputGuide();
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
    skipConductorSetup: yarg.skipConductorSetup,
  };
}
