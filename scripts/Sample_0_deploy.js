//部署合约

//imports
const { ethers, run, network } = require("hardhat")

//async main
async function main() {
    const Sample = await ethers.getContractFactory("Sample")
    console.log("Deploying contract...")
    const sample = await Sample.deploy(10, 50)
    await sample.deployed()
    console.log(`Deployed contract to: ${sample.address}`)
    // what happens when we deploy to our hardhat network?
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await sample.deployTransaction.wait(6) //等待6个区块后开始verify
        await verify(sample.address, [10, 50])
    }
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

//main
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
