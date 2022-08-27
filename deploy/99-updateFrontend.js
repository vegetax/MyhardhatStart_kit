const { ethers, network } = require("hardhat")
const fs = require("fs")
const { Contract } = require("ethers")

//更新这里的地址及合约名称
const FRONT_END_ADDRESS_FILE =
    "../MyNextTailMoralis_Kit/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../MyNextTailMoralis_Kit/constants/abi.json"
const ContractName = "Sample"

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Update front end... ")
        // updateContractAddress()

        /**更新CONTRACT ADDRESS */
        const contract = await ethers.getContract(ContractName)
        const chainID = network.config.chainId.toString()
        const currentAddresses = JSON.parse(
            fs.readFileSync(FRONT_END_ADDRESS_FILE, "utf8")
        )

        currentAddresses[chainID] = [contract.address]

        fs.writeFileSync(
            FRONT_END_ADDRESS_FILE,
            JSON.stringify(currentAddresses)
        )
        /**更新CONTRACT ABI */
        fs.writeFileSync(
            FRONT_END_ABI_FILE,
            contract.interface.format(ethers.utils.FormatTypes.json)
        )
        console.log("Updated front end!")
    }
}

module.exports.tags = ["all", "frontend"]
