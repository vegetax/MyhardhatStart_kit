//部署合约

//imports
const { ethers, run, network } = require("hardhat")

let CoreCouponAdd = "0xbc9B4b1EE06E7938550096FB89437daF95612FfA"
let RedShoesAdd = "0xF67FF2e5A73f17241445530af836BDc8214CA933"
let GameCoinxRouterAdd = "0xDC09Af9a449F4c4821Efd222737A4A7BfE8539fC"

async function interact() {
    const accounts = await ethers.getSigners() //获得ganache上的地址
    const CoreCoupon = await ethers.getContractFactory("CoreCoupon_V2")
    const RedShoes = await ethers.getContractFactory("RedShoes")
    const GameCoinxRouter = await ethers.getContractFactory("GameCoinxRouter")

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
    const gameCoinxRouter = new ethers.Contract(
        GameCoinxRouterAdd,
        GameCoinxRouter.interface,
        accounts[0]
    )

    /* mint */
    // const mintTX = await redShoes.mint(1, 0)
    // const mintReceipt = await mintTX.wait().catch((err) => {
    //     console.log(err)
    // })
    // console.log("mint success!")

    /* 查询mint总量 */
    // const mintNum = await redShoes.totalSupply()
    // console.log("NFT total mint:" + mintNum.toString())

    /* Unstake */
    // const unstakeTX = await coreCoupon.UnStake([1, 2])
    // const unstakeReceipt = await unstakeTX.wait().catch((err) => {
    //     console.log(err)
    // })
    // console.log("unstake success!")

    /* 查询质押数 */
    // const stakeNum = await coreCoupon.totalShoesStaked()
    // console.log("total stake:" + stakeNum.toString())

    /* OwnerOf */
    // const ownerOf = await redShoes.ownerOf(4)
    // console.log(`ownerOf is ${ownerOf}`)

    /* Stake */
    // const TXStake = await coreCoupon.StakeShoesInGame(accounts[0].address, 1)
    // const stakeReceipt = await TXStake.wait().catch((err) => {
    //     console.log(err)
    // })
    // console.log("stake success!")

    /* redeem */
    // const redeemTX = await redShoes.MilesRedeem(2)
    // const redeemReceipt = await redeemTX.wait().catch((err) => {
    //     console.log(err)
    // })
    // console.log("redeem success!")

    /* getRedeemState  */
    // const state = await redShoes.getRedeemState(2)
    // console.log(`redeem state is ${state}`)
}

//
interact().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
