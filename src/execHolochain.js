import tmp from "tmp";
import child_process from "child_process";
import fs from "fs";
import { ADMIN_PORT } from "./constants";
import { sleep } from "./utils";

function createConfigFile() {
  const dbDirectory = tmp.dirSync({});

  const configFileContents = `
    ---
    environment_path: ${dbDirectory.name}
    use_dangerous_test_keystore: false
    signing_service_uri: ~
    encryption_service_uri: ~
    decryption_service_uri: ~
    dpki: ~
    keystore_path: ~
    passphrase_service: ~
    admin_interfaces: 
        - driver:
            type: websocket
            port: ${ADMIN_PORT}  
    network: ~
    `;

  const configFile = tmp.fileSync({});

  fs.writeFileSync(configFile.name, configFileContents);

  return configFile.name;
}

export async function execHolochain() {
  const configFilePath = createConfigFile();

  child_process.spawn("lair-keystore", [], {
    stdio: "inherit",
    env: process.env,
  });

  await sleep(100);

  child_process.spawn("holochain", ["-c", configFilePath], {
    stdio: "inherit",
    env: {
      ...process.env,
      RUST_LOG: process.env.RUST_LOG ? process.env.RUST_LOG : "info",
    },
  });
}
