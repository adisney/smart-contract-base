# Smart Contract Base
A base development platform for smart contract development in solidity

## Environment
This is a nodeJS project using the truffle framework to assist with solidity development.

### Requirements
* node: v8.9.4
* npm: v6.4.0

Assuming node and npm are installed, install the nodeJS packages in package.json by executing:

```
npm i
```

Once all of the packages are installed, you must also ensure that `truffle` executable script is on your path. You can do this by adding `node_modules/.bin` to your path.

```
export PATH=node_modules/.bin:$PATH
```

It is recommended to add the above line to your .bashrc (or .bash_profile or equivalent).

Follow the instructions below to run the tests to verify your installation was successful.

## Running tests
To run the code against a linter and to compile and run the test suite once:
```
npm run test
```

## Running tests

#### Requirements
* (Optional) `entr` - [Installation instructions](http://entrproject.org/)

To run the code against a linter and to compile and run the test suite once:
```
npm run test
```

### (Optional) Continuous Testing
Continuous testing can be helpful when developing while using Test Driven Development. Each time a source file changes in your repository, the testing suite will compile the changes and run the tests, providing immediate feedback on what has passed and failed as a result of the changes.

It is **not** necessary to practice continuous testing while developing in this project.

##### Continuous Testing Requirements
* `entr` - [Installation instructions](http://entrproject.org/)

To implement continuous testing, we utilize a service called `entr`. `entr` is a utility that monitors a list of files for changes and, if those files change on disk, it executes an arbitrary command that you can specify. For our purposes, the command invoked by `entr` does the following:

* Check if ganache-cli is running
  * If running, kill and restart
  * If not running, start
* Invoke `truffle test`, which does the following:
  * Compiles the contracts
  * Migrates them into the dev environment
  * Runs the test suite

Note: The linter does not run when running continuous tests.

To run the tests continuously:
```
npm run ct
```

## Truffle
This project uses the smart contract development framework [Truffle](https://truffleframework.com/). Truffle comes with a suite of tools that make many of the difficult parts of smart contract development much easier. The primary functions it serves for the project are:

* Compilation
* Testing
* Deployment

Compilation generally occurs as a part of running other truffle commands, so it is likely it will not be required to run it directly.

## Deployment
These contracts can be deployed to any of the Ethereum networks using the script at `./bin/deploy.sh`. The script will verify the appropriate environment variables have been set and ask you to indicate what network to deploy to.

### Wallet Mnemonic

Deploying an Ethereum smart contract is, in fact, a transaction on the Ethereum network. As such, it requires that you provide ether to be spent to pay the gas cost. To do this, you must provide a mnemonic string for a wallet that you control. This wallet must have a positive ether balance.

Provide the mnemonic by setting the environment variable `WALLET_MNEMONIC`.

### Infura

Truffle is configured to use the public Ethereum nodes at Infura to send the contract creation transactions. You must create an account and obtain an API key at https://infura.io.

Once you've obtained that key, provide it to the script by setting the environment variable `INFURA_TOKEN`.

### Deployment Logging

The output from the deployment process gets written to standard out and to the file `./contract_deployment.log`. Should something go wrong, you can use that log file for reference.

### Tying It All Together

The deployment script can be executed using the command `npm run deploy`.

```
export WALLET_MNEMONIC="this is a wallet mnemonic phrase"
export INFURA_TOKEN="your_API_key"
npm run deploy
```

### Deploying Multiple Times

When testing, you will likely want to deploy the same contract more than once. Truffle is designed such that once you've deployed a contract, it will not deploy the same contracts multiple times. That can be inconvenient if you're testing the deployment process itself.

Thankfully, Truffle can take a flag that will redeploy a previously deployed contract. If you'd like to run the deploy script with the reset flag, execute the following:
```
npm run reset_deploy
```
