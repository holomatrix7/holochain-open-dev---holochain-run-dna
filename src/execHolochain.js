import tmp from "tmp";
import child_process from "child_process";
import fs from "fs";
import { sleep } from "./utils.js";
const yaml = require("js-yaml");

function createTmpDirIfNecessary(dirName) {
  if (!dirName) {
    const dbDirectory = tmp.dirSync({});
    dirName = dbDirectory.name;
  }
  return dirName;
}

function createConfigFile(adminPort, dirName, proxyUrl) {
  let configExists = false;
  const configFileName = `${dirName}/config.yaml`;

  if (fs.existsSync(configFileName)) {
    try {
      const doc = yaml.safeLoad(fs.readFileSync(configFileName, "utf8"));
      adminPort = doc.admin_interfaces[0].driver.port;
      console.log(`Using admin port ${adminPort} from config`);
    } catch (e) {
      console.log(e);
    }
    return [configFileName, false, adminPort];
  }
  const networkConfig = proxyUrl
    ? `network:
    bootstrap_service: https://bootstrap.holo.host
    transport_pool:
      - type: proxy
        sub_transport:
          type: quic
        proxy_config:
          type: remote_proxy_client
          proxy_url: "${proxyUrl}"
`
    : `network:
    bootstrap_service: https://bootstrap.holo.host
    transport_pool:
       - type: quic
`;
  const configFileContents = `
---
environment_path: ${dirName}
use_dangerous_test_keystore: false
signing_service_uri: ~
encryption_service_uri: ~
decryption_service_uri: ~
dpki: ~
keystore_path: "${dirName}/keystore"
passphrase_service: ~
admin_interfaces:
    - driver:
        type: websocket
        port: ${adminPort}
${networkConfig}
`;

  fs.writeFileSync(configFileName, configFileContents);

  return [configFileName, true, adminPort];
}
//     "kitsune-proxy://CIW6PxKxsPPlcuvUCbMcKwUpaMSmB7kLD8xyyj4mqcw/kitsune-quic/h/proxy.holochain.org/p/5778/--",
export async function execHolochain(adminPort, runPath, proxyUrl) {
  const dirName = createTmpDirIfNecessary(runPath);
  const [configFilePath, configCreated, realAdminPort] = createConfigFile(
    adminPort,
    dirName,
    proxyUrl
  );

  child_process.spawn("lair-keystore", [], {
    stdio: "inherit",
    env: { ...process.env, LAIR_DIR: `${dirName}/keystore` },
  });
  process.on("SIGINT", function () {
    fs.rm(`${dirName}/keystore/pid`)
    process.exit();
  });

  await sleep(500);

  console.log("Using config file:", configFilePath);
  child_process.spawn("holochain", ["-c", configFilePath], {
    stdio: "inherit",
    env: {
      ...process.env,
      RUST_LOG: process.env.RUST_LOG ? process.env.RUST_LOG : "info",
    },
  });
  await sleep(3000);
  return [configCreated, realAdminPort];
}
