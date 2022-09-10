const { ethers } = require("hardhat")
const abi = require("../constants/redshoes_abi.json")

async function main() {
    // 建立provider
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.MUMBAI_RPC_URL
    )
    // 建立wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    // 建立合约
    const contract = new ethers.Contract(
        "0x3fF3EDce07Ce6De41F3BDD7c52a14C7AAD598Ff3",
        abi,
        wallet
    )
    console.log("合约创建成功...")

    /*** 监听 ”LogEvent“ 事件 */
    // sample.on("LogEvent", (x, y, event) => {
    //     console.log(`x is ${x} y is ${y}`)
    // })

    // await new Promise((resolve) => setTimeout(() => resolve(), 2000))

    // const Tx = await sample.xPlus1() //触发事件
    // const queryEvent = await contract.queryFilter("Transfer") // 拉取全部EVENT
    // console.log(queryEvent)
    contract.on("Transfer", (from, to, tokenId, event) => {
        console.log(`from  ${from} to ${to} tokenId:${tokenId}`)
    })
}

//main
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
