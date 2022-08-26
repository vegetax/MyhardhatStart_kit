const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers } = require("hardhat")
require("dotenv").config()

async function main() {
  const ContractAddress = "0xB789B26e12BCBbb334367c66807F0a63aB59cA0F"
  const sf = await Framework.create({
    chainId: 42, //your chainId here
    provider: ethers.provider,
  })

  const signer = sf.createSigner({
    privateKey: process.env.PRIVATE_KEY,
    provider: ethers.provider,
  })

  const DAIx = await sf.loadSuperToken("fDAIx")

  const CreatFl = sf.cfaV1.createFlow({
    receiver: ContractAddress,
    superToken: DAIx.address,
    flowRate: "100000000000",
  })

  const txn = await CreatFl.exec(signer)
  const receipt = await txn.wait()
  console.log(receipt)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
