const tmp = require("tmp");
const child_process = require("child_process");
const fs = require("fs");
const { ADMIN_PORT } = require("./constants");

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

function execHolochain() {
  const configFilePath = createConfigFile();

  child_process.spawn("holochain", ["-c", configFilePath], {
    stdio: "inherit",
    env: {
      ...process.env,
      RUST_LOG: process.env.RUST_LOG ? process.env.RUST_LOG : "info",
    },
  });
}

module.exports = {
  execHolochain,
};
