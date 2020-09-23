#!/usr/bin/env node

import { getDnasToInstall } from "./utils.mjs";
import { execHolochain } from "./execHolochain.mjs";
import { installApp } from "./installApp.mjs";

async function execAndInstall(dnasToInstall) {
  // Execute holochain
  execHolochain();

  await installApp(8888, dnasToInstall, "test-app");
}

try {
  const dnasToInstall = getDnasToInstall();
  execAndInstall(dnasToInstall).catch(console.error);
} catch (e) {
  console.error(e.message);
}
