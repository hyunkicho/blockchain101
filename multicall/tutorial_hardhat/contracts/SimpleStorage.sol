// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    mapping(address => uint256) private values;

    function setValue(uint256 newValue) public {
        values[msg.sender] = newValue;
    }

    function getValue(address addr) public view returns (uint256) {
        return values[addr];
    }
}
