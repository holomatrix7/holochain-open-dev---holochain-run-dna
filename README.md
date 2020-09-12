# holochain-run-dna

A small and temporary cli tool to execute holochain and install the given DNAs. This emulates the behaviour that `hc run` had.

This tool: 

- Executes the `holochain` command with debug level on `info`
- Uses a temporary database that will be cleaned after exit
- Installs the given DNAs in the same app, named `test-app`, and listening to 8888.

If more configuration parameters are wanted, PRs and issues are welcomed at https://github.com/holochain-open-dev/holochain-run-dna.

Only to use for development purposes. For production purposes, use directly the `holochain` command.

## Installation

```
npm install -g @holochain-open-dev/holochain-run-dna
```

## Usage

```
holochain-run-dna [DNA_PATH, DNA_PATH...]
```