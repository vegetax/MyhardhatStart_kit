// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

// Import this file to use console.log
import "hardhat/console.sol";

contract Sample {
    uint256 x;
    uint256 y;

    event LogEvent(uint256 indexed x, uint256 y);

    constructor(uint256 _x, uint256 _y) {
        x = _x;
        y = _y;
    }

    function xPlus1() public returns (uint256) {
        x++;
        emit LogEvent(x, y);
        return x;
    }

    function yPlus1() public returns (uint256) {
        y++;
        emit LogEvent(x, y);
        return x;
    }

    function setX(uint256 _x) public returns (uint256) {
        x = _x;
        return x;
    }

    function getX() public view returns (uint256) {
        return x;
    }
}
