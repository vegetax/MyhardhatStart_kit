// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CoreCoupon.sol";

import {ISuperfluid, ISuperToken, ISuperApp} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {ISuperfluidToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidToken.sol";
import {CFAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

//host :0xEB796bdb90fFA0f28255275e16936D25d3418603
contract RedShoes is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0;
    uint256 public maxSupply = 10000;
    uint256 public redeemRatio = 3; //兑换比率
    bool public paused = false;
    bool public canRedeem = true;
    CoreCoupon core;
    //sf
    using CFAv1Library for CFAv1Library.InitData;
    CFAv1Library.InitData public cfaV1;

    constructor(string memory _initBaseURI, address _core)
        // ISuperfluid host
        ERC721("RedShoes", "RS")
    {
        core = CoreCoupon(_core);
        setBaseURI(_initBaseURI);
        // cfaV1 = CFAv1Library.InitData(
        //     host,
        //     IConstantFlowAgreementV1(
        //         address(
        //             host.getAgreementClass(
        //                 keccak256(
        //                     "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
        //                 )
        //             )
        //         )
        //     )
        // );
    }

    //mint with SUPERFLUID
    // function SFmint(
    //     ISuperfluidToken token,
    //     uint256 _mintAmount,
    //     bool stake
    // ) public {
    //     require(!paused, "the contract is paused");
    //     uint256 supply = totalSupply();
    //     require(_mintAmount > 0, "need to mint at least 1 NFT");
    //     require(supply + _mintAmount <= maxSupply, "max NFT limit exceeded");

    //     int96 flowRate = int96(int256(_mintAmount * 100)); //计算价格

    //     createFlowIntoContract(token, flowRate); //创建流支付

    //     uint256[] memory tokenIds = stake
    //         ? new uint256[](_mintAmount)
    //         : new uint256[](0); //如stake，则记录新mint的ID

    //     for (uint256 i = 0; i < _mintAmount; i++) {
    //         supply++; //tokenid 增加
    //         if (stake) {
    //             //如果选择质押，就直接mint在core中
    //             _safeMint(address(core), supply);
    //             tokenIds[i] = supply;
    //         } else {
    //             _safeMint(msg.sender, supply);
    //         }
    //     }
    //     if (stake) core.StakeShoesInGame(msg.sender, tokenIds); //让core合约记录质押
    // }

    //mint with ETH
    function mint(
        uint256 _mintAmount,
        bool stake,
        bytes32 hash
    ) public payable {
        require(!paused, "the contract is paused");
        uint256 supply = totalSupply();
        require(_mintAmount > 0, "need to mint at least 1 NFT");
        require(supply + _mintAmount <= maxSupply, "max NFT limit exceeded");
        require(msg.value >= cost * _mintAmount, "insufficient funds");

        supply++; //tokenid 增加
        if (stake) {
            //如果选择质押，就直接mint在core中
            _safeMint(address(core), supply);
            core.StakeShoesInGame(msg.sender, supply, hash); //让core合约记录质押
        } else {
            _safeMint(msg.sender, supply);
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    //设置价格
    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    //设置BaseURI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    //查询兑换比率
    function getRedeemRatio() external view returns (uint256) {
        return redeemRatio;
    }

    function SetCanRedeem(bool _state) public onlyOwner {
        canRedeem = _state;
    }

    //查询是否停止兑换
    function getCanRedeem() external view returns (bool) {
        return canRedeem;
    }

    // Hardcode the Core's approval so that users don't have to waste gas approving
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
        if (_msgSender() != address(core))
            require(
                _isApprovedOrOwner(_msgSender(), tokenId),
                "ERC721: transfer caller is not owner nor approved"
            );
        _transfer(from, to, tokenId);
    }

    /// @notice Create a stream into the contract.
    /// @dev This requires the contract to be a flowOperator for the msg sender.
    /// @param token Token to stream.
    /// @param flowRate Flow rate per second to stream.
    function createFlowIntoContract(ISuperfluidToken token, int96 flowRate)
        public
    {
        cfaV1.createFlowByOperator(msg.sender, address(this), token, flowRate);
    }
}
