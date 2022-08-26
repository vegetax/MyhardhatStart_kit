import { Framework } from "@superfluid-finance/sdk-core";
import { hardhat, ethers } from "hardhat";

const injectedHardhatEthersSf = await Framework.create({
  chainId: 31337,
  provider: hardhat.ethers,
});
