# open zeppelin Governance

1. 컨트렉트 학습


[Core]
Governor => 코어 컨트렉트로서 모든 로직을 포함하고 있으면서 추상 컨트렉트로서 다른 모듈들 중 하나를 선택하거나 커스터마이징을 할 수 있다.

[Modules]

GovernorVotes => ERC20, 721 등의 토큰을 통해서 voting weight를 추출합니다.
GovernorVotesQuorumFraction : 정족수를 설정하기 위하여 GovernorVotes와 함께 사용합니다.
GovernorVotesComp => 컴파운드 형태의 voting weight를 추출합니다.

[Extensions]
GovernorCountingSimple : 3가지 투표 옵션을 줍니다. (against, for , abstain)
GovernorTimelockControl : TimelockController를 통해 특정 시간에 따라 다수의 제안들을 실행시킬 수 있는 기능들을 추가합니다.
GovernorSettings : 업그레이드 없이 특정 값들을 세팅해 줍니다.
GovernorPreventLateQuorum : 

[배경지식 설명 - comp라고 되어 있는 모듈과 익스텐션은 무엇일까?]
* 컴파운드는 유명한 대출 플랫폼 dapp으로서 대출 서비스와 더불어 생성자에서 각종 초기 값을 설정합니다.
* 예를들어서 특정 자산의 최대 대출량 (borrow cap), 담보물이 청산할 때 한번에 얼마나 청산될지 (colletral factor), 특정 이자율 로직의 값들에 대한 값이 설정되며 이를 해당 서비스를 사용하여 컴파운드 토큰을 얻은 유저들의 DAO로 결정합니다.
주로 토큰 기반의 DAO는 컴파운드를 사용하는 경우가 많습니다.

[Openzepplin wizard]

1. 생성자
시간 설정 - Governor Settings (초기 설정 값 주기)

Governor : 컨트렉트의 초기 생성자에서 기본 값을 받아옵니다.

EIP712 서명에 필요한 name을 여기서 받아오게 되며 핵심 로직이 모두 들어가 있습니다. 구현시 여기 정의되어 있는 함수를 오버라이딩하면 됩니다.

GovernorSettings : 투표에 대한 딜레이, 기간 , 정족수를 정합니다.
기존에 있는 변수들을 조회하고 세팅하는 기능입니다.

GovernorVotes : 토큰 주소를 입력받아서 해당 토큰 

Ivote를 입력해야 한다.
(ERC721에서 votes extension을 상속 받은 NFT)

2. Votes & ERC721

CheckPoint 라이브러리 사용

Check Point는 구조체의 히스토리를 남기는 것입니다.
```
    struct History {
        Checkpoint[] _checkpoints;
    }

    struct Checkpoint {
        uint32 _blockNumber;
        uint224 _value;
    }
```

해당 라이브러리를 사용하여 기본 자료형을 정의합니다.

```
    mapping(address => address) private _delegation;
    mapping(address => Checkpoints.History) private _delegateCheckpoints;
    Checkpoints.History private _totalCheckpoints;

    mapping(address => Counters.Counter) private _nonces;
```

_delegateCheckpoints[account] 를 통해서 특정 시기의 체크포인트 블록 정보에 접근합니다.

getVotes 에서는 _delegateCheckpoints[account].latest() 를 통해 현재값을 가져오고
getPastVotes 에서는 _delegateCheckpoints[account].getAtProbablyRecentBlock(blockNumber) 를 통해 해당 블록에서의 값을 가져옵니다.

_delegate를 통해 투표권을 넘겨주는 부분이 있습니다.
delegateBySig : EIP712 서명을 통한 delegate입니다. (이 부분은 다음장에서 바로 설명합니다.)
delegte를 하게 될 경우 블록번호와 투표권 개수를 Checkpoint에 담게 됩니다.

이와 함께 내부적으로 토큰을 보낼때
_moveDelegateVotes 가 실행되도록 하여서
토큰의 소유권과 함께 투표권을 delegte 하게 됩니다.

이에 따라 DAO에 적합한 NFT가 나오게 됩니다.

3. Governor

open zepplin docs
https://docs.openzeppelin.com/contracts/4.x/governance



4. 직접 만들어보기 (커스터마이징 가능)

https://wizard.openzeppelin.com/#governor


5. 배포하기

```
npx hardhat run scripts/deploy.ts
```
테스트를 할 때는 시점이 매우 중요합니다.
propse 시점을 기준으로 스냅샷을 찍는 votingDelay가 정해지며 deadline이 정해집니다.
snap shot은 votingDelay + blockNumber
deadline은 snapshot + voting period
해당 시점이 잘 맞지 않으면 오류가 나게 됩니다.

6. 테스트 하기
```
npx hardhat test
```

7. 오픈제플린 이슈
   스냅샷 시점이 잘 안맞으면 투표는 되지만 카운트가 안되는 상황 발생
   이 경우 오픈 제플린에서 해당 함수를 내부적으로 0으로 호출하는 경우의 수도 유효하게 두었기 때문에 일부러 막지 않았다고 합니다.
   https://github.com/OpenZeppelin/openzeppelin-contracts/issues/4071

8. 테스트 결과 tally 또한 같은 환경의 erc721 Vote와 Openzepplin Governor를 사용중이므로  [NEW]
tally에서 dao페이지를 사용할 수 있습니다.
https://www.tally.xyz/gov/test-erc721