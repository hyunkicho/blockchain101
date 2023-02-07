// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauserAutoId.sol";

contract MyERC1155 is ERC1155PresetMinterPauser {
    constructor() ERC721PresetMinterPauserAutoId("https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc1155/metadata/") {
        mint(msg.sender);
    }
}
