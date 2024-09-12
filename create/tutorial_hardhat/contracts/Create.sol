// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleContract.sol";

contract CreateExample {
    address public deployedContract;

    function create(uint256 _value) public {
        SimpleContract newContract = new SimpleContract(_value);
        deployedContract = address(newContract);
    }
}
