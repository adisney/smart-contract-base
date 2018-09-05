require('babel-register')({
    ignore: /node_modules\/(?!openzeppelin-solidity\/test\/helpers)/
});
require('babel-polyfill');

const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.WALLET_MNEMONIC
const infuraAccessToken = process.env.INFURA_TOKEN

module.exports = {
    scripts: {
    },
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*",
        },
        ropsten: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/" + infuraAccessToken)
            },
            network_id: "3",
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/" + infuraAccessToken)
            },
            network_id: "4",
        },
        kovan: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/" + infuraAccessToken)
            },
            network_id: "42",
        },
        mainnet: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/" + infuraAccessToken)
            },
            network_id: "1",
        }
    },
    rpc: {
        host: "localhost",
        port: 8545
    }
};
