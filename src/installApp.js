import { AppWebsocket, AdminWebsocket } from "@holochain/conductor-api";

export async function installApp(adminPort, appPort, dnas, installedAppId) {
  const adminWebsocket = await AdminWebsocket.connect(
    `ws://localhost:${adminPort}`
  );

  const pubKey = await adminWebsocket.generateAgentPubKey();

  const app = await adminWebsocket.installApp({
    agent_key: pubKey,
    installed_app_id: installedAppId,
    dnas: dnas.map((dna) => {
      const path = dna.split("/");
      return { nick: path[path.length - 1], path: dna };
    }),
  });

  await adminWebsocket.activateApp({ installed_app_id: installedAppId });
  await adminWebsocket.attachAppInterface({ port: appPort });

  const appWebsocket = await AppWebsocket.connect(`ws://localhost:${appPort}`);

  console.log(`Successfully installed app on port ${appPort}`);

  await appWebsocket.client.close();
  await adminWebsocket.client.close();
}

export async function attachAppInterface(adminPort, appPort, installedAppId) {
  console.log("\n Attaching... \n ");
  const adminWebsocket = await AdminWebsocket.connect(
    `ws://localhost:${adminPort}`
  );
  //  await adminWebsocket.activateApp({ installed_app_id: installedAppId });
  await adminWebsocket.attachAppInterface({ port: appPort });

  const appWebsocket = await AppWebsocket.connect(`ws://localhost:${appPort}`);

  console.log(`Successfully attached to app interface on port ${appPort}`);

  await appWebsocket.client.close();
  await adminWebsocket.client.close();
}
