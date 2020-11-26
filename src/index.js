import { sleep } from "./utils.js";
import { getDnasToInstall } from "./args";
import { execHolochain } from "./execHolochain.js";
import { installApp } from "./installApp.js";
import getPort from "get-port";

async function execAndInstall({ port, dnas }) {
  // Find a free port for the admin websocket
  const adminPort = await getPort({ port: 1234 });

  // Execute holochain
  await execHolochain(adminPort);

  await sleep(100);

  await installApp(adminPort, port, dnas, "test-app");
}

try {
  const { port, dnas } = getDnasToInstall();
  execAndInstall({ port, dnas }).catch(console.error);
} catch (e) {
  console.error(e.message);
}
