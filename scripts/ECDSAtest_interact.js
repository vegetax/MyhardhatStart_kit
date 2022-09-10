const { ethers } = require("hardhat")

let address

//部署
async function main() {
    const Contract = await ethers.getContractFactory("ECDSAtest")
    console.log("Deploying contract...")
    const contract = await Contract.deploy()
    await contract.deployed()
    console.log(`Deployed contract to: ${contract.address}`)
    address = contract.address
}

//交互
async function interact() {
    const Contract = await ethers.getContractFactory("ECDSAtest")

    const contract = new ethers.Contract(
        address,
        Contract.interface,
        Contract.signer
    )
    // console.log(contract)

    const tx = await contract.setBytes(
        1,
        "0xfe0021f2b619934e71c2ced6fc1d3fe35e297de1eadc317aa40ab7dd6433964461376a6e23acb382813325dc5fc076090ff8a05349704907a3a2737a38d049841b"
    )
    const x = await contract.recoverSigner("123456", 1)
    console.log("SignContract:" + x)
}

main()
    .then(() => interact())
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
// main().catch((error) => {
//     console.error(error)
//     process.exitCode = 1
// })
// interact().catch((error) => {
//     console.error(error)
//     process.exitCode = 1
// })
