// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CoreCoupon_V2.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//  _initBaseURI=`https://testnet.tableland.network/query?mode=list&s=`
//  mainName = "redshoes_main_80001_1717"
//  attributesName = "redshoes_attributes_80001_1718"

contract RedShoes is ERC721Enumerable, Ownable {
    using Strings for uint256;

    //TableLand fields
    string public mainTable = "redshoes_main_80001_1717";
    string public attributesTable = "redshoes_attributes_80001_1718";
    string public baseURIString =
        "https://testnet.tableland.network/query?mode=list&s=";

    string public baseExtension = ".json";
    uint256 public cost = 0;
    uint256 public maxSupply = 10000;
    uint256 public redeemRatio = 3; //兑换比率
    bool public paused = false;
    bool public canRedeem = true;
    mapping(uint256 => bool) public redeemed;

    CoreCoupon_V2 core;

    constructor(address _core)
        // ISuperfluid host
        ERC721("RedShoes", "RS")
    {
        core = CoreCoupon_V2(_core);
    }

    //mint with ETH
    function mint(uint8 _mintAmount, bool stake) public payable {
        require(!paused, "the contract is paused");
        uint256 supply = totalSupply();
        require(_mintAmount > 0, "need to mint at least 1 NFT");
        require(supply + _mintAmount <= maxSupply, "max NFT limit exceeded");
        require(msg.value >= cost * _mintAmount, "insufficient funds");

        for (uint8 i = 0; i < _mintAmount; i++) {
            supply++; //tokenid 增加
            redeemed[supply] = false;
            if (stake) {
                //如果选择质押，就直接mint在core中
                _safeMint(address(core), supply);
                core.StakeShoesInGame(msg.sender, supply); //让core合约记录质押
            } else {
                _safeMint(msg.sender, supply);
            }
        }
    }

    // miles Redeem
    function MilesRedeem(uint256 tokenId) external onlyOwner {
        redeemed[tokenId] = true;
    }

    // get Redeem state
    function getRedeemState(uint256 tokenId) external view returns (bool) {
        require(_exists(tokenId), " query for nonexistent token");
        return redeemed[tokenId];
    }

    /**
     *  @dev Must override the default implementation, which simply appends a `tokenId` to _baseURI.
     *  tokenId - The id of the NFT token that is being requested
     */
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
        string memory baseURI = _baseURI();

        if (bytes(baseURI).length == 0) {
            return "";
        }

        /**
         *   A SQL query to JOIN two tables to compose the metadata accross a 'main' and 'attributes' table
         *
         *   SELECT json_object(
         *       'id', id,
         *       'name', name,
         *       'description', description,
         *       'image', image,
         *       'attributes', json_group_array(
         *           json_object(
         *               'trait_type',trait_type,
         *               'value', value
         *           )
         *       )
         *   )
         *   FROM {mainTable} JOIN {attributesTable}
         *       ON {mainTable}.id = {attributesTable}.main_id
         *   WHERE id = <main_id>
         *   GROUP BY id
         */
        string memory query = string(
            abi.encodePacked(
                "SELECT%20json_object%28%27id%27%2Cid%2C%27name%27%2Cname%2C%27description%27%2Cdescription%2C%27image%27%2Cimage%2C%27attributes%27%2Cjson_group_array%28json_object%28%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20FROM%20",
                mainTable,
                "%20JOIN%20",
                attributesTable,
                "%20ON%20",
                mainTable,
                "%2Eid%20%3D%20",
                attributesTable,
                "%2Emain_id%20WHERE%20id%3D"
            )
        );
        // Return the baseURI with a query string, which looks up the token id in a row.
        // `&mode=list` formats into the proper JSON object expected by metadata standards.
        return
            string(
                abi.encodePacked(
                    baseURI,
                    query,
                    Strings.toString(tokenId),
                    "%20group%20by%20id"
                )
            );
    }

    /**
     *
     *  @dev Tableland's _baseURI, Must override the default implementation, which returns an empty string.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURIString;
    }

    //设置价格
    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    //设置BaseURI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURIString = _newBaseURI;
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
}
