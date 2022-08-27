// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Mock {
    uint256 m = 10;

    function getM() public view returns (uint256) {
        return m;
    }
}
