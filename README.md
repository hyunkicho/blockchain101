# basic tutorial for dapp developer

This repo is for students who wants to be a solidity developer

* 현재 레포지토리의 경우 패스트캠퍼스에서 사용됩니다. (오류 발견시 리드미에 바로 업데이트 예정)
https://www.youtube.com/watch?v=WNxKsA0gfc8&t=5s
* "체인의 정석"으로 활동할 강의에서 자료로 계속 업데이트 되어 사용될 예정입니다.
* 외부 활용 시 "체인의 정석"으로 출저를 남겨주시길 바랍니다.
* 개발 이외의 블록체인 시장 트렌드 및 기술 트렌드는 아래 채널에 꾸준히 업데이트 중입니다.

  *RPC_URL에 들어갈 앤드포인트는 infura나 alchemy 등 개인키를 이용하여 발급한 것을 사용하시를 추천드립니다. 공개 endpoint는 종종 오류가 많이 발생하며, 강의를 찍을 당시에는 오류가 없었어도 오류가 발생할 수 있습니다. 특히 과거 이벤트를 가져오는 경우 시간이 많이 지나면 불러오지 못하는 경우가 많습니다. 이때는 이벤트를 가져오는 블록넘버를 조정하거나 아카이브 노드 엔드포인트를 찾아서 가져와야 합니다. (실무에서는 유료 앤드포인트나 아카이브 노드를 자체적으로 돌리고 있는 경우가 대다수이나 무료 환경에서 실습용으로 이를 찾는게 쉽지 않은 네트워크도 많습니다.)

## 참고
모든 실습은 다음과 같이 .env라는 이름의 파일을 따로 생성해 주셔야 합니다.

.env
```
PUBLIC_KEY='공개키'
TEST_PUBLIC_KEY='공개키'
PRIVATE_KEY='비밀키'
TEST_PRIVATE_KEY='비밀키'
ERC1155='컨트렉트 주소'
RPC_URL='https://ethereum-goerli-rpc.allthatnode.com'
RPC_URL_MATIC='https://polygon-testnet-rpc.allthatnode.com:8545'
RPC_URL_BSC='https://bsc-testnet-rpc.allthatnode.com'
RPC_URL_KLAYTN='https://klaytn-baobab-rpc.allthatnode.com:8551'
```


## 기초 학습 & ERC 토큰들 표준

* 현재 토큰 표준 실습에 있어서 각 소스 코드에는 optimize가 적용이 되지 않았는데 배포시 공간 절약과 가스비를 절감하는 작업이 필요하다면 아래와 같이 optimizer를 기본 설정 값으로 넣어두는 것은 추천드립니다. (run 숫자를 크게 잡아도 되지만 과도하게 클 경우 오히려 비효율 적일 수도 있습니다. 배포 시에는 기본값인 200을 추천드립니다.)

hardhat.config.ts 에서 아래 내용 추가
```
  solidity: {
    version : "0.8.13",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
  },
```

* IPFS 메타데이터 저장의 경우 컨트렉트와 관련된 내용이 아니므로 본 실습에서는 다루지 않습니다. 따라서 깃허브의 저장 공간을 사용합니다. (패스트 캠퍼스 수강생의 경우 뒤에서 게뜨님이 직접 다룰 예정)

1. basics
이더리움 공식 문서의 VendingMachine 컨트렉트를 기준으로
truffle & javascript 
hardhat & ethers 
환경에서 트랜잭션 조회, 처리, 테스트, 이벤트 조회를 모두 진행하고
각종 편리한 모듈들을 학습해 봅니다.

2. erc20
openzeppelin의 erc20 컨트렉트를 기준으로
truffle & javascript 
hardhat & ethers 
환경에서 트랜잭션 조회, 처리, 테스트, 이벤트 조회를 모두 진행하고
다중 체인에 배포하여 봅니다.

3. erc721
openzeppelin의 erc721 컨트렉트를 기준으로
truffle & javascript 
hardhat & ethers 
환경에서 트랜잭션 조회, 처리, 테스트, 이벤트 조회를 모두 진행하고
다중 체인에 배포하여 봅니다.

4. erc1155
openzeppelin의 erc1155 컨트렉트를 기준으로 커스터마이징 하여
hardhat & ethers 환경에서 배포 및 테스트해 봅니다.

5. erc721A
Azuki의 erc721A를 베이스로
erc721에서 가스비를 절감한 erc721A의 기법에 대해 학습하고 배포 및 테스트 해봅니다.

6. erc4626
erc20의 4626 extension을 학습해 봅니다.

Bouns. KIP37 (Klaytn)
클레이튼의 KIP37 표준에 맞춘 NFT 소스 코드 입니다.
https://github.com/hyunkicho/deployKIP37

## 토큰 외에 현업에서 자주 쓰이는 주요 코드들 리뷰

1. Governance (open-zeppelin)
openzepplin의 governor 컨트렉트, erc20 컨트렉트 ,erc721 vote extension을
특정 nft를 통해 DAO가 운영되도록 구현합니다. 
(timelock, complike 제외한 순수 governor와 nft 컨트렉트로 원하는 정족수를 커스터마이징 할 수 있습니다.)

2. EIP712 서명 (open-zeppelin)
오픈씨, 유니스왑, Governor 등 주요 서비스 들에서 많이 쓰이는 EIP712 서명을 학습합니다.
복잡한 EIP712 서명을 테스트 코드를 통해 배웁니다.
EIP712 서명을 직접 메타마스크로 해보고 대표 프로덕트의 유즈케이스도 학습합니다.

3. accessAndOwner (컨트렉트 보안)
관리자 권한을 다루는데 가장 많이 사용되는 Ownable 외에도
openzepplin의 대표적인 Owner2Step, AccessRole를 사용하여 다양한 관리자 권한 관리 컨트렉트를 사용해봅니다.

4. multisigWallt (컨트렉트 보안)
실무에서 컨트렉트의 보안성을 높이려는 목적으로 멀티시그가 사용된다는 가정 하에 가장 빈번하게 쓰이는 gnosis의 멀티시그 지갑을 통하여
멀티시그 컨트렉트를 배포해보고 테스트 해봅니다.

5. Pausable and re-enterancy (컨트렉트 보안)
실무에서 컨트렉트 보안성 향상을 하기 위해 자주 사용하는 옵션인 Pausable과 Re-entrancy에 대해 학습하고 이를 적용해 봅니다.
실제 코드를 통해 직접 재진입 공격을 시도해보고 재진입 공격을 막을 때 잘막히나 체크해봅니다.

6. upgradable
오픈제플린의 업그레이더블 컨트렉트 예제를 통해서 직접 업그레이더블 컨트렉트를 활용해 봅니다.

## 코드 독해 1 Uniswap V2

공식 깃허브 : https://github.com/Uniswap

Uniswap V2 정리 - 기본 컨셉과 참고링크
https://it-timehacker.tistory.com/338

UniswapV2 정리 - UniswapV2Pair & UniswapV2ERC20 컨트렉트
https://it-timehacker.tistory.com/339

UniswapV2 정리 2 - Uniswap V2 Factory
https://it-timehacker.tistory.com/340

UniswapV2 정리3 - periphery, Router 뜯어보기
https://it-timehacker.tistory.com/341

UniswapV2 정리4 : fee-on-transfer tokens 함수들
https://it-timehacker.tistory.com/342

## 코드 독해 2 Opensea WyvernExchange V2.2

이더스캔 코드 : https://etherscan.io/address/0x7be8076f4ea4a4ad08075c2508e481d6c946d12b#code

트위터 스레드
https://twitter.com/stone_chain/status/1566946633807699968

미디엄 글 1 - 오픈씨 거래소의 구조, 직접 뜯어보자
 https://medium.com/curg/%EC%98%A4%ED%94%88%EC%94%A8-%EA%B1%B0%EB%9E%98%EC%86%8C%EC%9D%98-%EA%B5%AC%EC%A1%B0-%EC%A7%81%EC%A0%91-%EB%9C%AF%EC%96%B4%EB%B3%B4%EC%9E%90-253469a9224

미디엄 글 2 - OpenSea 컨트렉트의 버전별 특징과 핵심로직 분석
https://chohyunki.medium.com/%EC%98%A4%ED%94%88%EC%94%A8-%EC%BB%A8%ED%8A%B8%EB%A0%89%ED%8A%B8%EC%9D%98-%EB%B0%9C%EC%A0%84-%EA%B3%BC%EC%A0%95%EA%B3%BC-%EB%B2%84%EC%A0%84%EB%B3%84-%ED%95%B5%EC%8B%AC-%EB%A1%9C%EC%A7%81-%EB%B6%84%EC%84%9D-c1c2f592242

유튜브 1 - 오픈씨의 소스코드가 1년간 3번이나 바뀌었다고? 바뀐 이유와 버전별 차이 분석 (EIP191 서명과 EIP721 서명)
https://youtu.be/INvWh8vJkV8

유튜브 2 - NFT 거래소 OpenSea의 핵심로직과 작동원리 10분만에 설명해 드립니다.
https://youtu.be/yLRyPhnlvU0

## 코드 독해 3 Compound V2
컴파운드 분석 1 편) 전체 구조와 C Token
https://it-timehacker.tistory.com/364

컴파운드 분석 2 편) 컴파운드에서의 이자율 계산
https://it-timehacker.tistory.com/368

컴파운드 분석 3편 - CToken & Comptroller (transfer, 유동성체크, 이자율 체크, 청산)
https://it-timehacker.tistory.com/369


## 체인의 정석 SNS
트위터 (블로그 내용 요약) : @stone_chain
유튜브 (영상 설명) : https://www.youtube.com/@stone_chain

## 체인의 정석 블로그
미디엄 (블록체인 & 최신 트렌드) : https://chohyunki.medium.com/
개발블로그 (블록체인 + 백엔드 개발 & 실무 팁) :  https://it-timehacker.tistory.com/
네이버 블로그 (블록체인 시장분석 & 투자) : https://m.blog.naver.com/PostList.naver?blogId=dmsrlgusrl

## 체인의 정석 무료 멘토링
국비 지원 무료 멘토링 : https://gomentoring.or.kr/contents/mentoring/mentor_detail.php?a_gb=mentor&a_cd=1&a_item=0&g_flag=young&mentorID=cnldjq10

교육, 멘토링, 마케팅 문의 : timehacker95@gmail.com