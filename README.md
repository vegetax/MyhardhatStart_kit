# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

### .yarnrc.yml中的nodeLinker: node-modules 控制开关  PnP模式，有是关闭，如需打开则删除这行就行
### yarn hardhat console --network rinkeby  可以直接在console里与rinkeby交互
await ethers.provider.getBlockNumber()
### super示例合约 kovan地址 0xB789B26e12BCBbb334367c66807F0a63aB59cA0F
###  yarn hardhat run scripts/SFdeploy.js --network kovan 可发起一个流