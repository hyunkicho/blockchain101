// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract MyERC1155 is ERC1155PresetMinterPauser {
    constructor() ERC1155PresetMinterPauser("https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc1155/metadata/\{id\}.json") {
        mint(msg.sender,0,10,''); //data is needed only when neccessary
    }

    
}
