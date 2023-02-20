// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./AccessControl.sol";

contract AccessControlTest is AccessControl {
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }
}