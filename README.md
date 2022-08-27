# 给新手的Hardhat 傻瓜使用包
- 包含功能


### 
.yarnrc.yml中的nodeLinker: node-modules 控制开关  PnP模式，有是关闭，如需打开则删除这行就行
### yarn hardhat console --network rinkeby  可以直接在console里与rinkeby交互
await ethers.provider.getBlockNumber()