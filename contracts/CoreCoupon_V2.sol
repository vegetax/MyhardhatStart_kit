// SPDX-License-Identifier: MIT LICENSE

pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./RedShoes.sol";
import "./GameCoinxRouter.sol";

contract CoreCoupon_V2 is Ownable, IERC721Receiver {
    /**
     * 1、不同NFT鞋的质押，以及代理mint
     * 2、批量 burn 及 提款！！！
     * 3、转移所有权
     */

    //0xDC09Af9a449F4c4821Efd222737A4A7BfE8539fC   GameCoinxRouter
    //0x17d6fae16dffd29267eeb20b0f08c106c4059309 GAMECOINx

    RedShoes redShoes;
    GameCoinxRouter gameCoinxRouter;
    mapping(uint256 => address) public stakeOwner;
    uint256 public totalShoesStaked;
    int96 public flowratePerShoes = 1000;

    event LogTokenStaked(
        address owner,
        uint256 id,
        uint256 timestamp,
        bool stake
    );
    event LogRedeem(address owner, uint256[] tokenIds, uint16 redeemId);
    event LogMerge(address Owner, uint256 tokenId_A, uint256 tokenId_B);

    //通过Coupon Stake
    function StakeShoesInGame(address account, uint256 tokenId) external {
        require(
            redShoes.ownerOf(tokenId) == _msgSender() ||
                _msgSender() == address(redShoes),
            "ARN'T YOUR TOKEN!"
        ); // 发送者必须拥有NFT

        if (_msgSender() != address(redShoes)) {
            // dont do this step if its a mint + stake
            redShoes.transferFrom(_msgSender(), address(this), tokenId); // 将NFT转移至合约
        }
        setSuperFlows(account);
        stakeOwner[tokenId] = account;
        totalShoesStaked++;
        emit LogTokenStaked(_msgSender(), tokenId, block.timestamp, true);
    }

    //Unstake
    function UnStake(uint256[] memory tokenIds) external {
        for (uint8 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(_msgSender() == stakeOwner[tokenId], "Invalid data"); //验证所有权

            redShoes.safeTransferFrom(address(this), _msgSender(), tokenId, ""); // send back Shoes
            deleteSuperFlows(_msgSender()); //删除superflow
            totalShoesStaked -= 1; // updage total

            emit LogTokenStaked(_msgSender(), tokenId, block.timestamp, false);
        }
    }

    //Check Owner
    function isShoesOwner(uint256 tokenId_A, uint256 tokenId_B)
        internal
        view
        returns (bool)
    {
        if (
            // _msgsender is A and B owner
            (redShoes.ownerOf(tokenId_A) == _msgSender() ||
                stakeOwner[tokenId_A] == _msgSender()) &&
            (redShoes.ownerOf(tokenId_B) == _msgSender() ||
                stakeOwner[tokenId_B] == _msgSender())
        ) {
            return true;
        } else {
            return false;
        }
    }

    //Check Owner
    function isShoesOwner(uint256 tokenId) internal view returns (bool) {
        if (
            redShoes.ownerOf(tokenId) == _msgSender() ||
            stakeOwner[tokenId] == _msgSender()
        ) {
            return true;
        } else {
            return false;
        }
    }

    //创建superflows
    function setSuperFlows(address _account) public {
        int96 flowRate = gameCoinxRouter.getFlowRate(_account);
        if (flowRate != 0) {
            //已经有flow了就+flowratePerShoes
            flowRate += flowratePerShoes;
            gameCoinxRouter.updateFlowFromContract(_account, flowRate);
        } else if (flowRate == 0) {
            //还没有flow 就初始flowratePerShoes
            flowRate = flowratePerShoes;
            gameCoinxRouter.createFlowFromContract(_account, flowRate);
        }
    }

    //删除superflows
    function deleteSuperFlows(address _account) public {
        int96 flowRate = gameCoinxRouter.getFlowRate(_account);

        if (flowRate > flowratePerShoes) {
            //大于就减掉一份
            flowRate -= flowratePerShoes;
            gameCoinxRouter.updateFlowFromContract(_account, flowRate);
        } else if (flowRate != 0) {
            //小于或者等于 就直接删除
            gameCoinxRouter.deleteFlowFromContract(_account);
        }
    }

    //get Shoes Owner
    function getShoesOwner(uint256 tokenId)
        external
        view
        returns (address Owner)
    {
        if (redShoes.ownerOf(tokenId) != address(this)) {
            Owner = redShoes.ownerOf(tokenId);
        } else {
            Owner = stakeOwner[tokenId];
        }
        return Owner;
    }

    //SetShoesContrat
    function setRedShoes(address _redShoes) public onlyOwner {
        redShoes = RedShoes(_redShoes);
    }

    //SetGameCoinxRouter
    function setGameCoinxRouter(address _router) public onlyOwner {
        gameCoinxRouter = GameCoinxRouter(_router);
    }

    //ERC721Received
    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        require(from == address(0x0), "Cannot send tokens to Core directly");
        return IERC721Receiver.onERC721Received.selector;
    }
}
