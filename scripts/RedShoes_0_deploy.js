//部署合约

//imports
const { ethers, run, network } = require("hardhat")

//async main
async function main() {
    const CoreCoupon = await ethers.getContractFactory("CoreCoupon")
    const RedShoes = await ethers.getContractFactory("RedShoes")

    console.log("Deploying CoreCoupon...")
    const coreCoupon = await CoreCoupon.deploy()
    await coreCoupon.deployed()
    console.log(`Deployed CoreCoupon to: ${coreCoupon.address}`)
    console.log("Deploying RedShoes...")
    let mainName = "redshoes_main_80001_1717"
    let attributesName = "redshoes_attributes_80001_1718"
    const redShoes = await RedShoes.deploy(
        coreCoupon.address,
        `https://testnet.tableland.network/query?mode=list&s=`,
        mainName,
        attributesName
    )
    await redShoes.deployed()
    console.log(`Deployed RedShoes to: ${redShoes.address}`)
    console.log("Contract deployed success!")

    await coreCoupon.setRedShoes(redShoes.address)
    CoreCouponAdd = coreCoupon.address
    RedShoesAdd = redShoes.address
    /*** verify */
    /* if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await contract.deployTransaction.wait(6) //等待6个区块后开始verify
        await verify(contract.address, [10, 50])
    } */
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

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
