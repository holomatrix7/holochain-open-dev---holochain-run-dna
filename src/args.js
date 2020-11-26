import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

function getDnaPath(provisionalPath) {
  if (fs.existsSync(provisionalPath)) {
    return provisionalPath;
  } else if (fs.existsSync(__dirname + provisionalPath)) {
    return __dirname + provisionalPath;
  } else {
    throw new Error(`Couldn't file dna with path ${provisionalPath}`);
  }
}

function badInput() {
  throw new Error(`
  Bad input!
  USAGE: holochain-run-dna -p [PORT] [DNA_PATH, DNA_PATH...]
`);
}

export function getDnasToInstall() {
  const yarg = yargs(hideBin(process.argv)).help().option("port", {
    alias: "p",
    type: "integer",
    description: "Run with verbose logging",
  }).argv;

  let port = yarg.port || 8888; // Default port

  const paths = yarg._;

  if (paths.length === 0) badInput();

  const dnas = paths.map((arg) => getDnaPath(arg));

  return {
    port,
    dnas,
  };
}
