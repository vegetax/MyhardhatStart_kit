//部署后拷贝地址过来与合约在链上交互
//以及ethers.js 对event的操作

//imports
const { ethers, run, network } = require("hardhat")

//async main
async function main() {
    const Sample = await ethers.getContractFactory("Sample")
    // console.log(Sample)
    const sample = new ethers.Contract(
        "0x305242f6D16A2E4b8d3A4a0236F09e30A945a96e",
        Sample.interface,
        Sample.signer
    )
    const x = await sample.getX()
    console.log(`x = ${x.toString()}`)

    /*** 触发交易  */
    /*   const Tx = await sample.test() //先返回的是交易
    const receipt = await Tx.wait() //等待收据返回
    console.log(receipt.events[0].args)
    // console.log(receipt.events[0].args[1].toString())
    console.log(receipt.events[0].args.a.toString())
    console.log(receipt.events[0].args.b.toString()) */

    /*** 拉取Event  */
    const filterDate = sample.filters.LogEvent(56, null) //筛选event里的数据

    const pastEvent = await sample.queryFilter(filterDate) // 拉取全部EVENT
    // const pastEvent = await sample.queryFilter("*") // 拉取全部EVENT
    // const pastEvent = await sample.queryFilter("LogEvent") // 拉名字为LogEvent的EVENT
    console.log(pastEvent)
}

//main
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
