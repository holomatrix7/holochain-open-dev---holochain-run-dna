#!/usr/bin/env bash
":"; //# comment; exec /usr/bin/env node --no-warnings --experimental-modules --input-type=module - "$@" < "$0"

import { getDnasToInstall } from "./utils";
import { execHolochain } from "./execHolochain";
import { installApp } from "./installApp";

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
