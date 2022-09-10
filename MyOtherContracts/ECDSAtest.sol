// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ECDSAtest {
    mapping(uint256 => bytes) TokenIdBytes;

    function getHash(string memory password) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(password));
    }

    function recoverSigner(string memory password, uint256 tokenId)
        public
        view
        returns (address)
    {
        bytes32 messageDigest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(password))
            )
        );
        return ECDSA.recover(messageDigest, TokenIdBytes[tokenId]);
    }

    function setBytes(uint256 tokenId, bytes memory signature) public {
        TokenIdBytes[tokenId] = signature;
    }
}
