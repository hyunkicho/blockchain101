// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract MyERC20 is ERC20PresetMinterPauser {
    constructor() ERC20PresetMinterPauser("MyToken", "MT") {
        // mint(msg.sender, 1 ether);
    }
}
