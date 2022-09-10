// SPDX-License-Identifier: MIT LICENSE

pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./RedShoes.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CoreCoupon is Ownable, IERC721Receiver, Pausable {
    /**
     * 1、不同NFT鞋的质押，以及代理mint
     * 2、批量 burn 及 提款！！！
     * 3、转移所有权
     */

    RedShoes redShoes;
    mapping(uint256 => Stake) public warehouse;
    uint256 public totalShoesStaked;
    uint16 public redeemedCount;

    mapping(address => bytes32) commitments;

    struct Stake {
        address OwnerAccount;
        bool redeemed;
        bytes32 couponHash;
    }

    event LogTokenStaked(
        address owner,
        uint256 id,
        uint256 timestamp,
        bool stake
    );
    event LogRedeem(address owner, uint256[] tokenIds, uint16 redeemId);

    //通过Coupon Stake
    function StakeShoesInGame(
        address account,
        uint256 tokenId,
        bytes32 hash
    ) external whenNotPaused {
        require(
            redShoes.ownerOf(tokenId) == _msgSender() ||
                _msgSender() == address(redShoes),
            "ARN'T YOUR TOKEN"
        ); // 发送者必须拥有NFT

        if (_msgSender() != address(redShoes)) {
            // dont do this step if its a mint + stake
            redShoes.transferFrom(_msgSender(), address(this), tokenId); // 将NFT转移至合约
            warehouse[tokenId] = Stake({
                OwnerAccount: _msgSender(),
                redeemed: false,
                couponHash: hash // 储存hash
            });
        } else {
            warehouse[tokenId] = Stake({
                OwnerAccount: account,
                redeemed: false,
                couponHash: hash // 储存hash
            });
        }

        totalShoesStaked++;
        emit LogTokenStaked(_msgSender(), tokenId, block.timestamp, true);
    }

    //Unstake with coupon
    function UnstakeWithCoupon(uint256 tokenId, string memory coupon) external {
        Stake memory stake = warehouse[tokenId];
        // bytes32 digestHash = digest(coupon);
        // require(commitments[msg.sender] == digestHash, "Invalid data"); //防止front attack
        require(recoverCoupon(coupon) == stake.couponHash, "wrong coupon!"); //验证密码
        require(!stake.redeemed, "Shoes has redeemed!"); //Redeemed鞋子不能再提取

        redShoes.safeTransferFrom(address(this), _msgSender(), tokenId, ""); // send back Shoes
        delete warehouse[tokenId]; //清空信息
        delete commitments[msg.sender]; //清空commitments
        totalShoesStaked -= 1;

        emit LogTokenStaked(_msgSender(), tokenId, block.timestamp, false);
    }

    // Redeem with coupon
    function RedeemShoes(uint256[] memory tokenIds, string[] memory coupons)
        public
    {
        require(
            tokenIds.length == redShoes.redeemRatio() &&
                coupons.length == redShoes.redeemRatio(),
            "Wrong array length"
        );
        // bytes32 digestHash = digest(coupons[0]);
        // require(commitments[msg.sender] == digestHash, "Invalid data"); //防止front attack

        for (uint8 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            string memory coupon = coupons[i];
            Stake memory stake = warehouse[tokenId];

            require(redShoes.getCanRedeem(), "Redeem is closed"); //需要在NFT的有效期内
            require(recoverCoupon(coupon) == stake.couponHash, "wrong coupon!"); //验证密码

            if (
                (redShoes.ownerOf(tokenId) != _msgSender()) &&
                (redShoes.ownerOf(tokenId) != address(this))
            ) {
                //如果鞋子没有在质押
                revert("SWIPER, NO SWIPING");
            } else if (redShoes.ownerOf(tokenId) == _msgSender()) {
                //如果鞋子已经在质押
                redShoes.transferFrom(_msgSender(), address(this), tokenId); //先转移所有权
            }

            warehouse[tokenId].couponHash = ""; //修改redeem状态,清空密码
            warehouse[tokenId].redeemed = true;
            delete commitments[msg.sender]; //清空commitments
        }
        redeemedCount++;
        emit LogRedeem(_msgSender(), tokenIds, redeemedCount);
    }

    //设置新coupon
    function SetNewCoupon(
        uint256 tokenId,
        string memory oldCoupon,
        bytes32 newHash
    ) external onlyOwner {
        Stake memory stake = warehouse[tokenId];
        require(recoverCoupon(oldCoupon) == stake.couponHash, "wrong coupon!"); //验证密码
        require(!stake.redeemed, "Shoes has redeemed!"); //Redeemed鞋子不能再提取
        warehouse[tokenId].couponHash = newHash; // 储存签名
    }

    //SetShoesContrat
    function setRedShoes(address _redShoes) public onlyOwner {
        redShoes = RedShoes(_redShoes);
    }

    //pre-commit hash
    function preCommit(bytes32 hash) public {
        require(commitments[msg.sender] == bytes32(0), "Already committed");
        commitments[msg.sender] = hash;
    }

    //
    function digest(string memory coupon) public view returns (bytes32) {
        return keccak256(abi.encodePacked(coupon, _msgSender()));
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

    //验证密码
    function recoverCoupon(string memory coupon) public pure returns (bytes32) {
        bytes32 messageDigest = keccak256(abi.encodePacked(coupon));
        return messageDigest;
    }
}
