# 给新手的Hardhat傻瓜使用包
## 安装需求
- git
- npm or yarn
## 开始
```
yarn add
```
## Feature List



## 备注 
- yarnrc.yml中的"nodeLinker: node-modules"语句控制开关yarn的PnP模式。 
  - 保留语句，则关闭PnP功能，与NPM的兼容性更好，建议关闭
  - 删除语句，则打开PnP功能
- yarn hardhat console --network rinkeby  可以直接在console里与rinkeby交互
  - await ethers.provider.getBlockNumber() 直接查看rinkeby的链上信息
