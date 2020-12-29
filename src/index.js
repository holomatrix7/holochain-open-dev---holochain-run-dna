#!/usr/bin/env node
import { sleep } from "./utils.js";
import { getAppToInstall } from "./args";
import { execHolochain } from "./execHolochain.js";
import { installApp } from "./installApp.js";
import getPort from "get-port";
import fs from "fs";
const yaml = require('js-yaml');

async function execAndInstall(appToInstall) {
  // Find a free port for the admin websocket
  const adminPort = await getPort({ port: 1234 });

  // Execute holochain
  const [configCreated, realAdminPort] = await execHolochain(
    adminPort,
    appToInstall.runPath,
    appToInstall.proxyUrl
  );

  // If the config file was created assume we also need to install everything
  if (configCreated) {
    await sleep(100);
    if (appToInstall.happs) {
      const happs = yaml.safeLoad(fs.readFileSync(appToInstall.happs, 'utf8'));
      for(let happ of happs){
        await installApp(realAdminPort, happ.app_port,  happ.dnas, happ.app_name);
      }
    } else {
      await installApp(realAdminPort, appToInstall.appPort,  appToInstall.dnas, appToInstall.installedAppId);
    }
  } else {
    await sleep(500);
    await attachAppInterface(realAdminPort, appToInstall.appPort, appToInstall.installedAppId);
  }
}

try {
  const appToInstall = getAppToInstall();
  execAndInstall(appToInstall).catch(console.error);
} catch (e) {
  console.error(e);
}
