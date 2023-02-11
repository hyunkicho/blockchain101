# ERC721A 학습
Azuki에서 사용
https://www.erc721a.org/

여러 유명 프로젝트에서도 사용 됨
@moonbirds
@doodles (dooplicator)
@rtfkt (forged token)
@goblintown
@adidas (airdrop)

1. 주요 컨셉
다중 민팅을 위해 중복되는 코드 내역을 변경하는 것으로 배치 민팅을 ERC721에서 지원하는 것이 포인트이다.
가스비를 줄이기 위해 여러 방안을 사용하였으며 사용자 입장에서는 ERC271과 동일하게 느낄 수 있다.

Optimization 1 - Removing duplicate storage from OpenZeppelin’s (OZ) ERC721Enumerable
먼저 오픈제플린의 ERC721 Enumerable의 중복된 스토리지 제거

Optimization 2 - updating the owner’s balance once per batch mint request, instead of per minted NFT
배치 민팅 상황에서 소유자의 잔고 업데이트 행위의 중복을 줄임

Optimization 3 - updating the owner data once per batch mint request, instead of per minted NFT
한명의 유저가 민팅을 여러번 요청할 경우 모든 nft의 오너를 다 세팅하는 대신 해당 유저가 첫번째 민팅한 오너만 세팅해주고 조회해 올 때 
중간에 오너가 없는 경우는 뛰어 넘는 식으로 조회함수를 바꾸어서 가스비를 최적화 하였다.

* ERC721A에서는 어셈블리어와 바이트코드 등을 이용하여서 추가적으로 가스비를 개선하였습니다.
기존의 자료형과는 다르게 mapping의 value값에 uint256 형태의 결과 값을 매핑 시키고 바이트 코드 형태로 다양한 데이터를 저장합니다.

* ownership에 대한 정보 관리의 경우

다음과 같이 256 비트를 통해 여러 정보가 들어갈 위치를 미리 지정해 두고 저장 공간을 절약하였습니다.
저장공간의 절약은 곧 가스비 절감으로 이어집니다.
```
    // Bits Layout:
    // - [0..159]   `addr`
    // - [160..223] `startTimestamp`
    // - [224]      `burned`
    // - [225]      `nextInitialized`
    // - [232..255] `extraData`
    mapping(uint256 => uint256) private _packedOwnerships;
```

* 특정 주소에 대한 정보를 uint256안에 모두 넣고 활용

```
    // Mapping owner address to address data.
    //
    // Bits Layout:
    // - [0..63]    `balance`
    // - [64..127]  `numberMinted`
    // - [128..191] `numberBurned`
    // - [192..255] `aux`
    mapping(address => uint256) private _packedAddressData;
```

이러한 자료형들을 packed라고 정의 한 후에 
unpacked라는 인터널 함수들을 통하여서 필요한 위치에 있는 정보만 뽑아서 가져다 사용합니다.
필요한 위치에 있는 정보만 뽑기 위하여 constants 에서 미리 위치를 정의해두거나 마스크를 하기 위한 수치를 정해 둡니다.

_packedAddressData 에서
BITMASK의 경우 자신이 원하는 위치에만 1을 넣은 자료형을 만들고 and 연산을 하여 나머지 위치의 값은 모두 0으로 만들어 버립니다.

BITPOS라고 되어 있는 변수의 경우 특정 위치를 의미하여 해당 위치에서 데이터를 가져올 때 사용합니다.

2. 코드
https://github.com/chiru-labs/ERC721A

3. 설치 
```
npm install --save-dev erc721a
```

4. 사용법은 간단합니다. erc721과 동일합니다.
```
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";

contract MyERC721A is ERC721A {
    constructor() ERC721A("Myerc721A", "721A") {}

    function mint(uint256 quantity) external payable {
        // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
        _mint(msg.sender, quantity);
    }
}
```

5. erc721과 동일하게 작동합니다.