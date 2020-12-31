import { AppWebsocket } from "@holochain/conductor-api";

export const genPubKey = async (adminWebsocket) => await adminWebsocket.generateAgentPubKey();

export async function installApp(adminWebsocket, agentPubKey, appPort, dnas, installedAppId) {
  try {
    if (!agentPubKey) {
      console.log(`(-m FLAG ON) Generating new agent pub key for ${installedAppId}.`);
      try {
        agentPubKey = await genPubKey(adminWebsocket);
      } catch (error) {
        throw new Error('Unable to generate agent key. Error : ', error);
      }
    }

    const app = await adminWebsocket.installApp({
      agent_key: agentPubKey,
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
  }
  catch (e) {
    console.log("Error while installing happs: ", e);
  }
}
