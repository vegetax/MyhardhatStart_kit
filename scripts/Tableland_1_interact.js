// Standard `ethers` import for chain interaction, `network` for logging, and `run` for verifying contracts
const { ethers, network } = require("hardhat")
var sd = require("silly-datetime")
// The script required to upload metadata to IPFS
const { prepareSqlForTwoTables } = require("./Tableland_x_prepareSql")
// Import Tableland
const { connect } = require("@tableland/sdk")
// Import 'node-fetch' and set globally -- needed for Tableland to work with CommonJS
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args))
globalThis.fetch = fetch
// Optionally, do contract verification (for demo purposes, but this could be as a separate script `verify.js`)
require("@nomiclabs/hardhat-etherscan")
/**
 * Primary script to deploy the NFT, first pushing images to IPFS and saving the CIDs to a metadata object.
 * Then, creating both a 'main' and 'attributes' metadata table to INSERT metadata into for each NFT token.
 */
async function main() {
    // Define the account that will be signing txs for table creates/writes & contract deployment
    const [signer] = await ethers.getSigners()
    console.log(` network '${network.name}' with account ${signer.address}`)
    /* 拉取tableland合约 */
    const tableland = await connect({ signer, chain: "polygon-mumbai" })

    /* 不建表 ，直接用已经存在的表 */
    let mainName = "redshoes_main_80001_1717"
    let attributesName = "redshoes_attributes_80001_1718"

    /* 生成SQL语句 */
    /*  const sqlInsertStatements = await prepareSqlForTwoTables(
        mainName,
        attributesName
    )
    console.log(sqlInsertStatements) */

    /* 已经生成的SQL */
    /* let sqlInsertStatements =  */

    /* 写SQL进表 */
    /* console.log(`\nWriting metadata to tables...`)
    for await (let statement of sqlInsertStatements) {
        const { main, attributes } = statement
        // Call `write` with both INSERT statements; optionally, log it to show some SQL queries
        // Use `receipt` to make sure everything worked as expected
        let { hash: mainWriteTx } = await tableland.write(main)
        receipt = tableland.receipt(mainWriteTx)
        if (receipt) {
            console.log(`${mainName} table: ${main}`)
        } else {
            throw new Error(
                `Write table error: could not get '${mainName}' transaction receipt: ${mainWriteTx}`
            )
        }
        // Recall that `attributes` is an array of SQL statements for each `trait_type` and `value` for a `tokenId`
        for await (let attribute of attributes) {
            let { hash: attrWriteTx } = await tableland.write(attribute)
            receipt = tableland.receipt(attrWriteTx)
            if (receipt) {
                console.log(`${attributesName} table: ${attribute}`)
            } else {
                throw new Error(
                    `Write table error: could not get '${attributesName}' transaction receipt: ${attrWriteTx}`
                )
            }
        }
    } */
    /* 改表 */
    const updatedRes = await tableland.write(
        `UPDATE  ${attributesName}  SET  value='true'  WHERE main_id = 3 AND trait_type='isRedeemed';`
        // "INSERT INTO table_nft_main_80001_1702 (id, name, description, image) VALUES (2, 'Red Shoes #7261', 'a NFT shoes that can play in game or redeem in reality', 'https://bafkreihta4t6na4wtkaoksr3ogwu6xko6htf23ok5m5chizmq5jysmk2ye.ipfs.nftstorage.link/');"
    )
    console.log(updatedRes)

    /* 查表 */
    const readResMain = await tableland.read(`SELECT * FROM ${mainName};`)
    const readResAttributesName = await tableland.read(
        `SELECT * FROM ${attributesName};`
    )
    console.log(readResMain)
    console.log(readResAttributesName)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
