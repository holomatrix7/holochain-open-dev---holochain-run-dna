import tmp from "tmp";
import child_process from "child_process";
import fs from "fs";
import { ADMIN_PORT } from "./constants.mjs";

function createConfigFile() {
  const dbDirectory = tmp.dirSync({});

  const configFileContents = `
    environment_path = "${dbDirectory.name}"

    [[admin_interfaces]]
    driver.type = "websocket"
    driver.port = ${ADMIN_PORT}
    `;

  const configFile = tmp.fileSync({});

  fs.writeFileSync(configFile.name, configFileContents);

  return configFile.name;
}

export function execHolochain() {
  const configFilePath = createConfigFile();

  child_process.spawn("holochain", ["-c", configFilePath], {
    stdio: "inherit",
    env: {
      ...process.env,
      RUST_LOG: process.env.RUST_LOG ? process.env.RUST_LOG : "info",
    },
  });
}
