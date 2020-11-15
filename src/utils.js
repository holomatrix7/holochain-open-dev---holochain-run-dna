import fs from "fs";

function getDnaPath(provisionalPath) {
  if (fs.existsSync(provisionalPath)) {
    return provisionalPath;
  } else if (fs.existsSync(__dirname + provisionalPath)) {
    return __dirname + provisionalPath;
  } else {
    throw new Error(`Couldn't file dna with path ${provisionalPath}`);
  }
}

export function getDnasToInstall() {
  const args = process.argv.slice(2);

  if (args.length === 0)
    throw new Error(`
  Bad input!
  USAGE: npx @holochain-open-dev/holochain-run-dna [DNA_PATH, DNA_PATH...]
`);

  if (args.find((arg) => arg.includes(":"))) {
    return args.map((arg) => {
      const portAndDna = arg.split(":");
      console.log(portAndDna);
      console.log(parseInt(portAndDna[0]));
      return { port: parseInt(portAndDna[0]), dnaPath: getDnaPath(portAndDna[1]) };
    });
  } else {
    const dnas = args.map((arg) => ({
      port: 8888,
      dnaPath: getDnaPath(arg),
    }));

    return dnas;
  }
}

export const sleep = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(), ms));
