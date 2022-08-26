//imports
const { ethers, run, network } = require("hardhat")

//async main
async function main() {
  const Lock = await ethers.getContractFactory("Lock")
  console.log("Deploying contract...")
  const lock = await Lock.deploy()
  await lock.deployed()
  console.log(`Deployed contract to: ${lock.address}`)
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...")
    await lock.deployTransaction.wait(6) //等待6个区块后开始verify
    await verify(lock.address, [])
  }
  //get the contract data
  const x = await lock.test()
  console.log(x)
  const tx = await lock.setValue(222)
  const y = await lock.test()
  console.log(y.toString())
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
