#!/usr/bin/env node
const { AdminWebsocket } = require("@holochain/conductor-api");

const { getDnasToInstall } = require("./utils");
const { execHolochain } = require("./execHolochain");
const { installApp } = require("./installApp");

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
