# holochain-run-dna

A small and temporary cli tool to execute holochain and install the given DNAs. This emulates the behaviour that `hc run` had.

This tool:

- Executes the `holochain` command with default debug level on `info`
- Uses a temporary database that will be cleaned after exit
- Installs the given DNAs in the same app, named `test-app`, and listening to 8888.

If more configuration parameters are wanted, PRs and issues are welcomed at https://github.com/holochain-open-dev/holochain-run-dna.

Only to use for development purposes. For production purposes, use directly the `holochain` command.

## Requirements

You need to have the `holochain` binary already installed and accessible in the `PATH` environment variable.

If the holochain conductor crashes with a problem related to `lair-keystore`, uninstall it (`which lair-keystore` and `rm <PATH_OF_KEYSTORE>`) and run `holochain -i`. It should automatically install the appropriate version of `lair-keystore`.

## Installation in project

```bash
npm install -D @holochain-open-dev/holochain-run-dna
```

Install it in your project for it to be accessible to anyone that clones the project.

## Global installation

```bash
npm install -g @holochain-open-dev/holochain-run-dna
```

Install it globally if you want to be able to use it from the terminal anywhere in your system.

## Usage

```bash
holochain-run-dna -p [PORT] [DNA_PATH, DNA_PATH...]
```

Example: `holochain-run-dna -p 8889 ./test.dna.gz`

The port is optional, the default is 8888.

To change the debug level:

```bash
RUST_LOG=debug holochain-run-dna [DNA_PATH, DNA_PATH...]
```
