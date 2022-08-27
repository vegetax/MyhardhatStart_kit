// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

// Import this file to use console.log
import "hardhat/console.sol";

contract Lock {
    uint256 x = 10;

    constructor(uint256 _a) {
        x = _a;
    }

    function test() public view returns (uint256) {
        // console.log(x);
        return x;
    }

    function setValue(uint256 _x) public returns (uint256) {
        x = _x;
        return x;
    }
}
