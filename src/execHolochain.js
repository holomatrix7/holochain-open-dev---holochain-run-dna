import tmp from "tmp";
import child_process from "child_process";
import fs from "fs";
import { sleep } from "./utils.js";

function createConfigFile(adminPort, dirName, proxyUrl) {
  if (!dirName) {
    const dbDirectory = tmp.dirSync({});
    dirName = dbDirectory.name;
  }

  let configExists = false
  const configFileName = `${dirName}/config.yaml`;

  if (fs.existsSync(configFileName)) {
    return [configFileName, false]
  }
  const networkConfig = proxyUrl ?
`network:
    bootstrap_service: https://bootstrap.holo.host
    transport_pool:
      - type: proxy
        sub_transport:
          type: quic
        proxy_config:
          type: remote_proxy_client
          proxy_url: "${proxyUrl}"
` :
`network:
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

    return [configFileName, true];
}
//     "kitsune-proxy://CIW6PxKxsPPlcuvUCbMcKwUpaMSmB7kLD8xyyj4mqcw/kitsune-quic/h/proxy.holochain.org/p/5778/--",
export async function execHolochain(adminPort, runPath, proxyUrl) {
  const [configFilePath, configCreated] = createConfigFile(
    adminPort,
    runPath,
    proxyUrl,
  );

  child_process.spawn("lair-keystore", [], {
    stdio: "inherit",
    env: process.env,
  });

  await sleep(100);
    console.log("config file:", configFilePath)
  child_process.spawn("holochain", ["-c", configFilePath], {
    stdio: "inherit",
    env: {
      ...process.env,
      RUST_LOG: process.env.RUST_LOG ? process.env.RUST_LOG : "info",
    },
  });
  await sleep(500);
  return configCreated;
}
