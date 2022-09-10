//部署合约

//imports
const { ethers, run, network } = require("hardhat")

let CoreCouponAdd = "0x60f2C177d08C33b28e1F300575bdE40DA87F19bc"
let RedShoesAdd = "0xffBb42eb5fD40F5626275c2C9b1F246949b8419F"

async function interact() {
    const accounts = await ethers.getSigners() //获得ganache上的地址
    const CoreCoupon = await ethers.getContractFactory("CoreCoupon")
    const RedShoes = await ethers.getContractFactory("RedShoes")

    const coreCoupon = new ethers.Contract(
        CoreCouponAdd,
        CoreCoupon.interface,
        accounts[0]
    )
    const redShoes = new ethers.Contract(
        RedShoesAdd,
        RedShoes.interface,
        accounts[0]
    )

    /* mint */
    // let hash1 = ethers.utils.keccak256(
    //     ethers.utils.toUtf8Bytes("happyBirthday1!")
    // )
    // let hash2 = ethers.utils.keccak256(
    //     ethers.utils.toUtf8Bytes("happyBirthday2!")
    // )
    // let hash3 = ethers.utils.keccak256(
    //     ethers.utils.toUtf8Bytes("happyBirthday3!")
    // )
    // await redShoes.mint(1, true, hash1)
    // await redShoes.mint(1, true, hash2)
    // await redShoes.mint(1, true, hash3)

    /* 查询总量 */
    // const mintNum = await redShoes.totalSupply()
    // console.log("NFT total mint:" + mintNum.toString())

    /* 提取 */
    // const tx1 = await coreCoupon.UnstakeWithCoupon(2, "happyBirthday111!")
    // const receipt1 = await tx1.wait()
    // console.log(receipt1)

    /* Unstake */
    // const TXunstaek = await coreCoupon.UnstakeWithCoupon(4, "happyBirthday1!")

    /* 查询质押数 */
    // const stakeNum = await coreCoupon.totalShoesStaked()
    // console.log("total stake:" + stakeNum.toString())

    /* OwnerOf */
    // const ownerOf = await redShoes.ownerOf(4)
    // console.log(`ownerOf is ${ownerOf}`)

    /* Stake */
    // let hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("666"))
    // const TXStake = await coreCoupon.StakeShoesInGame(
    //     "0x334Fb66c19bfc58d4596e97752F530E613330C8e",
    //     6,
    //     hash
    // )

    /* redeem */
    const TXRedeem = await coreCoupon.RedeemShoes(
        [4, 5, 6],
        ["444", "555", "666"]
    )
}

//
interact().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
