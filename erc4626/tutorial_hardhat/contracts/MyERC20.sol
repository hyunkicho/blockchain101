// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyERC20 is ERC20PresetMinterPauser {
    using SafeERC20 for IERC20;
    constructor() ERC20PresetMinterPauser("MyToken", "MT") {
        // mint(msg.sender, 1 ether);
    }
}
