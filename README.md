# 给新手的Hardhat傻瓜使用包
## 安装需求
- git
- npm or yarn
## 开始
```
yarn add
```
## Feature List
- deploy
  - 通过 --tags 控制deploy代码
- task
- verify
  - 如果不是在本地环境 自动verity
- 自动迁移合约和abi 
  - <img width="547" alt="image" src="https://user-images.githubusercontent.com/38912494/187022227-4ee3a0a8-9a69-4b72-aafb-070a14484127.png">
  - 在.env中设置 UPDATE_FRONT_END=TRUE




## 备注 
- yarnrc.yml中的"nodeLinker: node-modules"语句控制开关yarn的PnP模式。 
  - 保留语句，则关闭PnP功能，与NPM的兼容性更好，建议关闭
  - 删除语句，则打开PnP功能
- yarn hardhat console --network rinkeby  可以直接在console里与rinkeby交互
  - await ethers.provider.getBlockNumber() 直接查看rinkeby的链上信息
- yarn hardhat deploy --tags lock    部署有tag的deploy

