pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";

contract MyERC721A is ERC721A {
    constructor() ERC721A("Myerc721A", "721A") {}

    //Base URI 설정
    function _baseURI() internal view virtual override returns (string memory) {
        return 'https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc721/metadata/';
    }

    //Azuki와 같이 유저가 이더리움을 내고 직접 민팅하는 함수를 가정하고 제작
    // 개당 가격은 0.001 이더로 가정, 만약 정확한 수치가 아닐 경우 오류가 나도록 진행
    function mint(uint256 quantity) external payable {
        require(msg.value == (0.001 ether * quantity), "MyERC721A : msg.value is not correct");
        // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
        _mint(msg.sender, quantity);
    }
}
