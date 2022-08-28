require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("./tasks/block-number")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const KOVAN_RPC_URL = process.env.KOVAN_RPC_URL

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        ganache: {
            url: "HTTP://127.0.0.1:7545",
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
        },
        localhost: {
            url: "http://localhost:8545",
            chainId: 31337,
        },
        kovan: {
            url: KOVAN_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 42,
        },
        kovan: {
            url: MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 80001,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.14",
            },
            {
                version: "0.6.0",
            },
        ],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
}
