//部署合约

//imports
const { ethers, run, network } = require("hardhat")

//async main
async function main() {
    const CoreCoupon = await ethers.getContractFactory("CoreCoupon_V2")
    const RedShoes = await ethers.getContractFactory("RedShoes")
    const GameCoinxRouter = await ethers.getContractFactory("GameCoinxRouter")
    const accounts = await ethers.getSigners() //获得签名地址

    console.log(`network '${network.name}' with account ${accounts[0].address}`)
    console.log("Deploying CoreCoupon...")
    const coreCoupon = await CoreCoupon.deploy()
    await coreCoupon.deployed()
    console.log(`Deployed CoreCoupon to: ${coreCoupon.address}`)
    console.log("Deploying RedShoes...")

    //depoly redshoes contract
    let mainName = "redshoes_main_80001_1717"
    let attributesName = "redshoes_attributes_80001_1718"
    const redShoes = await RedShoes.deploy(coreCoupon.address)
    await redShoes.deployed()
    console.log(`Deployed RedShoes to: ${redShoes.address}`)

    const gameCoinxRouter = new ethers.Contract(
        "0xDC09Af9a449F4c4821Efd222737A4A7BfE8539fC",
        GameCoinxRouter.interface,
        accounts[0]
    )
    /* 重新构建 GameCoinxRouter  */
    // const gameCoinxRouter = await GameCoinxRouter.deploy(
    //     "0x17d6fae16dffd29267eeb20b0f08c106c4059309",
    //     "0x17d6fae16dffd29267eeb20b0f08c106c4059309"
    // )
    // console.log(`Deployed GameCoinxRouter to: ${gameCoinxRouter.address}`)
    // 给GameCoinxRouter转账

    console.log("set params...")
    const TX1 = await coreCoupon.setRedShoes(redShoes.address)
    const receipt1 = await TX1.wait()
    console.log("coreCoupon set redshoes success!")

    const TX2 = await coreCoupon.setGameCoinxRouter(
        "0xDC09Af9a449F4c4821Efd222737A4A7BfE8539fC"
    )
    const receipt2 = await TX2.wait()
    console.log("coreCoupon set GameCoinxRouter success!")

    const TX3 = await gameCoinxRouter.allowAccount(coreCoupon.address)
    const receipt3 = await TX3.wait()
    console.log("gameCoinxRouter allowAccount coreCoupon success!")

    console.log("All Contract deployed success!")

    CoreCouponAdd = coreCoupon.address
    RedShoesAdd = redShoes.address
    GameCoinxRouterAdd = "0xDC09Af9a449F4c4821Efd222737A4A7BfE8539fC"
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
