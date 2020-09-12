const fs = require("fs");

function getDnaPath(provisionalPath) {
  if (fs.existsSync(provisionalPath)) {
    return provisionalPath;
  } else if (fs.existsSync(__dirname + provisionalPath)) {
    return __dirname + provisionalPath;
  } else {
    throw new Error(`Couldn't file dna with path ${provisionalPath}`);
  }
}

function getDnasToInstall() {
  const args = process.argv.slice(2);

  if (args.length === 0)
    throw new Error(`
  Bad input!
  USAGE: npx @holochain-open-dev/holochain-run-dna [DNA_PATH, DNA_PATH...]
`);

  const dnas = args.map((arg) => getDnaPath(arg));

  return dnas;
}

module.exports = { getDnasToInstall };
