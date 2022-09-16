// Standard `ethers` import for chain interaction, `network` for logging, and `run` for verifying contracts
const { ethers, network } = require("hardhat")

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
    console.log(`network '${network.name}' with account ${signer.address}`)

    /* 拉取tableland合约 */
    const tableland = await connect({ signer, chain: "polygon-mumbai" })

    /* 建立数据表 */
    /*   // Define the 'main' table's schema as well as the 'attributes' table; a primary key should exist
    // Recall that declaring a primary key must have a unique combination of values in its primary key columns
    const mainSchema = `id int primary key, name text, description text, image text`
    // Should have one `main` row (a token) to many `attributes`, so no need to introduce a primary key constraint
    const attributesSchema = `main_id int not null, trait_type text not null, value text`
    // Define the (optional) prefix, noting the main & attributes tables
    const mainPrefix = "redshoes_main"
    const attributesPrefix = "redshoes_attributes"

    // Create the main table and retrieve its returned `name` and on-chain tx as `txnHash`
    const { name: mainName, txnHash: mainTxnHash } = await tableland.create(
        mainSchema,
        { prefix: mainPrefix }
    )
    // Wait for the main table to be "officially" created (i.e., tx is included in a block)
    // If you do not, you could be later be inserting into a non-existent table
    let receipt = tableland.receipt(mainTxnHash)
    if (receipt) {
        console.log(
            `Table '${mainName}' has been created at tx '${mainTxnHash}'`
        )
    } else {
        throw new Error(
            `Create table error: could not get '${mainName}' transaction receipt: ${mainTxnHash}`
        )
    }

    // Create the attributes table and retrieve its returned `name` and on-chain tx as `txnHash`
    const { name: attributesName, txnHash: attributesTxnHash } =
        await tableland.create(attributesSchema, {
            prefix: attributesPrefix,
        })
    // Wait for the attributes table to be "officially" created
    // If you do not, you could be later be inserting into a non-existent table
    receipt = tableland.receipt(attributesTxnHash)
    if (receipt) {
        console.log(
            `Table '${attributesName}' has been created at tx '${attributesTxnHash}'`
        )
    } else {
        throw new Error(
            `Create table error: could not get '${attributesName}' transaction receipt: ${attributesTxnHash}`
        )
    } */

    /* 不建表 ，直接用已经存在的表 */
    let mainName = "redshoes_main_80001_1724"
    let attributesName = "redshoes_attributes_80001_1725"

    /* 生成SQL语句 */
    /* const sqlInsertStatements = await prepareSqlForTwoTables(
        mainName,
        attributesName
    )
    console.log(sqlInsertStatements) */

    /* 已经生成的SQL */
    let sqlInsertStatements = [
        {
            attributes: [
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (1, 'Brand', 'NIKE');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (1, 'Redeem Expire Date', '2023-06-01');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (1, 'Redeem Radio', '3');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (1, 'Redeemed', 'false');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (1, 'Mileage', '0');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (1, 'Level', '1');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (1, 'Str', '19');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (1, 'Dex', '15');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (1, 'Int', '3');",
            ],
        },
        {
            main: "INSERT INTO redshoes_main_80001_1724 (id, name, description, image) VALUES (2, 'Red Shoes #7261', 'a NFT shoes that can play in game or redeem in reality', 'https://bafkreihta4t6na4wtkaoksr3ogwu6xko6htf23ok5m5chizmq5jysmk2ye.ipfs.nftstorage.link/');",
            attributes: [
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (2, 'Brand', 'NIKE');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (2, 'Redeem Expire Date', '2023-06-01');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (2, 'Redeem Radio', '3');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (2, 'Redeemed', 'false');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (2, 'Mileage', '0');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (2, 'Level', '1');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (2, 'Str', '3');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (2, 'Dex', '15');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (2, 'Int', '13');",
            ],
        },
        {
            main: "INSERT INTO redshoes_main_80001_1724 (id, name, description, image) VALUES (3, 'Red Shoes #7261', 'a NFT shoes that can play in game or redeem in reality', 'https://bafkreihta4t6na4wtkaoksr3ogwu6xko6htf23ok5m5chizmq5jysmk2ye.ipfs.nftstorage.link/');",
            attributes: [
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (3, 'Brand', 'NIKE');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (3, 'Redeem Expire Date', '2023-06-01');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (3, 'Redeem Radio', '3');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (3, 'Redeemed', 'false');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (3, 'Mileage', '0');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (3, 'Level', '1');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (3, 'Str', '3');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (3, 'Dex', '15');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (3, 'Int', '3');",
            ],
        },
        {
            main: "INSERT INTO redshoes_main_80001_1724 (id, name, description, image) VALUES (4, 'Red Shoes #7261', 'a NFT shoes that can play in game or redeem in reality', 'https://bafkreihta4t6na4wtkaoksr3ogwu6xko6htf23ok5m5chizmq5jysmk2ye.ipfs.nftstorage.link/');",
            attributes: [
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (4, 'Brand', 'NIKE');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (4, 'Redeem Expire Date', '2023-06-01');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (4, 'Redeem Radio', '3');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (4, 'Redeemed', 'false');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (4, 'Mileage', '0');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (4, 'Level', '1');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (4, 'Str', '3');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (4, 'Dex', '5');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (4, 'Int', '13');",
            ],
        },
        {
            main: "INSERT INTO redshoes_main_80001_1724 (id, name, description, image) VALUES (5, 'Red Shoes #7261', 'a NFT shoes that can play in game or redeem in reality', 'https://bafkreihta4t6na4wtkaoksr3ogwu6xko6htf23ok5m5chizmq5jysmk2ye.ipfs.nftstorage.link/');",
            attributes: [
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (5, 'Brand', 'NIKE');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (5, 'Redeem Expire Date', '2023-06-01');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (5, 'Redeem Radio', '3');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (5, 'Redeemed', 'false');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (5, 'Mileage', '0');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (5, 'Level', '2');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (5, 'Str', '5');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (5, 'Dex', '5');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (5, 'Int', '3');",
            ],
        },
        {
            main: "INSERT INTO redshoes_main_80001_1724 (id, name, description, image) VALUES (6, 'Red Shoes #7261', 'a NFT shoes that can play in game or redeem in reality', 'https://bafkreihta4t6na4wtkaoksr3ogwu6xko6htf23ok5m5chizmq5jysmk2ye.ipfs.nftstorage.link/');",
            attributes: [
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (6, 'Brand', 'NIKE');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (6, 'Redeem Expire Date', '2023-06-01');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (6, 'Redeemed', 'false');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (6, 'Mileage', '0');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (6, 'Level', '1');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (6, 'Str', '3');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (6, 'Dex', '5');",
                "INSERT INTO redshoes_attributes_80001_1725 (main_id, trait_type, value) VALUES (6, 'Int', '6');",
            ],
        },
    ]
    /* 写SQL进表 */
    console.log(`\nWriting metadata to tables...`)
    for await (let statement of sqlInsertStatements) {
        const { main, attributes } = statement
        // Call `write` with both INSERT statements; optionally, log it to show some SQL queries
        // Use `receipt` to make sure everything worked as expected
        if (main) {
            let { hash: mainWriteTx } = await tableland.write(main)
            receipt = tableland.receipt(mainWriteTx)
            if (receipt) {
                console.log(`${mainName} table: ${main}`)
            } else {
                throw new Error(
                    `Write table error: could not get '${mainName}' transaction receipt: ${mainWriteTx}`
                )
            }
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
    }
    /* 改表 */
    /*  const updatedRes = await tableland.write(
        `ALTER TABLE  ${attributesName}  DateOfMint text`
        // `UPDATE  ${attributesName}  SET  value='true'  WHERE main_id = 3 AND trait_type='isRedeemed';`
        // "INSERT INTO table_nft_main_80001_1702 (id, name, description, image) VALUES (2, 'Red Shoes #7261', 'a NFT shoes that can play in game or redeem in reality', 'https://bafkreihta4t6na4wtkaoksr3ogwu6xko6htf23ok5m5chizmq5jysmk2ye.ipfs.nftstorage.link/');"
    )
    console.log(updatedRes) */

    /* 查表 */
    const readResMain = await tableland.read(`SELECT * FROM ${mainName};`)
    const readResAttributesName = await tableland.read(
        `SELECT * FROM ${attributesName};`
    )
    console.log(readResMain)
    console.log(readResAttributesName)

    /* 部署合约 */
    /*  // Set the Tableand gateway as the `baseURI` where a `tokenId` will get appended upon `tokenURI` calls
  // Note that `mode=list` will format the metadata per the ERC721 standard
  const tablelandBaseURI = `https://testnet.tableland.network/query?mode=list&s=`;
  // Get the contract factory to create an instance of the  TwoTablesNFT contract
  const TwoTablesNFT = await ethers.getContractFactory("TwoTablesNFT");
  // Deploy the contract, passing `tablelandBaseURI` in the constructor's `baseURI` and using the Tableland gateway
  // Also, pass the table's `name` to write to storage in the smart contract
  const twoTablesNFT = await TwoTablesNFT.deploy(
    tablelandBaseURI,
    mainName,
    attributesName
  );
  // For contract verification purposes, wait for 5 confirmations before proceeeding
  // Otherwise, just use `await twoTablesNFT.deployed()`
  await twoTablesNFT.deployTransaction.wait(5);

  // Log the deployed address and call the getter on `baseURIString` (for demonstration purposes)
  console.log(
    `\nTwoTablesNFT contract deployed on ${network.name} at: ${twoTablesNFT.address}`
  );
  const baseURI = await twoTablesNFT.baseURIString();
  console.log(`TwoTablesNFT is using baseURI: ${baseURI}`); */

    /* mint  */
    /*   // For demonstration purposes, mint a token so that `tokenURI` can be called
  const mintToken = await twoTablesNFT.mint();
  const mintTxn = await mintToken.wait();
  // For demonstration purposes, retrieve the event data from the mint to get the minted `tokenId`
  const mintReceipient = mintTxn.events[0].args[1];
  const tokenId = mintTxn.events[0].args[2];
  console.log(
    `\nNFT minted: tokenId '${tokenId.toNumber()}' to owner '${mintReceipient}'`
  );
  const tokenURI = await twoTablesNFT.tokenURI(tokenId);
  console.log(
    `See an example of 'tokenURI' using token '${tokenId}' here:\n${tokenURI}`
  ); */

    /* verify合约 */
    /*  try {
    console.log("\nVerifying contract...");
    await hre.run("verify:verify", {
      address: twoTablesNFT.address,
      constructorArguments: [tablelandBaseURI, mainName, attributesName],
    });
  } catch (err) {
    if (err.message.includes("Reason: Already Verified")) {
      console.log(
        `Contract is already verified! Check it out on Polygonscan: https://mumbai.polygonscan.com/address/${twoTablesNFT.address}`
      );
    }
  } */
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
