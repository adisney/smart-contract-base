# Smart Contract Base
A base development platform for smart contract development in solidity

## Environment
This is a nodeJS project using the truffle framework to assist with solidity development.

### Requirements
* node: ^v8.9.4
* npm: ^v5.6.0

## Initialization

Assuming node and npm are installed correctly, execute

```
npm i
```

Once all of the packages are installed, you must also ensure that `truffle` executable script is on your path. You can do this by adding `node_modules/.bin` to your path.

```
export PATH=node_modules/.bin:$PATH
```

It is recommended to add the above line to your .bashrc (or .bash_profile or equivalent).

## Running tests

#### Requirements
* (Optional) `entr` - [Installation instructions](http://entrproject.org/)

To run the code against a linter and to compile and run the test suite once:
```
npm run test
```

### Continuous Testing

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
