// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract MyERC1155 is ERC1155PresetMinterPauser {
    constructor() ERC1155PresetMinterPauser("1") {
        setURI(0,"series1/0");
        setURI(1,"series1/1");
        setURI(2,"series2/0");
        mint(msg.sender,0,10,''); //data is needed only when neccessary
    }

    using Strings for uint256;

    // Optional base URI
    string private _baseURI = "https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc1155/metadata/";

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];

        // If token URI is set, concatenate base URI and tokenURI (via abi.encodePacked).
        return bytes(tokenURI).length > 0 ? string(abi.encodePacked(_baseURI, tokenURI)) : super.uri(tokenId);
    }

    function setURI(uint256 tokenId, string memory tokenURI) public {
        _setURI(tokenId, tokenURI);
    }

    /**
     * @dev Sets `tokenURI` as the tokenURI of `tokenId`.
     */
    function _setURI(uint256 tokenId, string memory tokenURI) internal virtual {
        _tokenURIs[tokenId] = tokenURI;
        emit URI(uri(tokenId), tokenId);
    }

    function setBaseURI(string memory baseURI) public {
        _setBaseURI(baseURI);
    }

    /**
     * @dev Sets `baseURI` as the `_baseURI` for all tokens
     */
    function _setBaseURI(string memory baseURI) internal virtual {
        _baseURI = baseURI;
    }
}
