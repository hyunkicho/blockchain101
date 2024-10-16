// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DAOTimelock is TimelockController, Ownable {
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    )
    Ownable(msg.sender)
    TimelockController(minDelay,proposers,executors,admin)
    {

    }

    function grantAllRole(address grantedAddress) public onlyOwner {
        super._grantRole(PROPOSER_ROLE, grantedAddress);
        super._grantRole(CANCELLER_ROLE, grantedAddress);
        super._grantRole(EXECUTOR_ROLE, grantedAddress);
    }
}