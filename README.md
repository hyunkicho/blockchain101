# basic tutorial for dapp developer

This repo is for students who wants to be a solidity developer

* 현재 레포지토리의 경우 패스트캠퍼스에서 사용됩니다. (오류 발견시 리드미에 바로 업데이트 예정)
https://www.youtube.com/watch?v=WNxKsA0gfc8&t=5s
* "체인의 정석"으로 활동할 강의에서 자료로 계속 업데이트 되어 사용될 예정입니다.
* 외부 활용 시 "체인의 정석"으로 출저를 남겨주시길 바랍니다.
* 개발 이외의 블록체인 시장 트렌드 및 기술 트렌드는 아래 채널에 꾸준히 업데이트 중입니다.

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

## 현업에서 알면 든든한 주요 코드들

1. Governance (open-zeppelin)
openzepplin의 governor 컨트렉트, erc20 컨트렉트 ,erc721 vote extension을
특정 nft를 통해 DAO가 운영되도록 구현합니다. 
(timelock, complike 제외한 순수 governor와 nft 컨트렉트로 원하는 정족수를 커스터마이징 할 수 있습니다.)

2. EIP712 서명
오픈씨, 유니스왑, Governor 등 주요 서비스 들에서 많이 쓰이는 EIP712 서명을 학습합니다.
복잡한 EIP712 서명을 테스트 코드를 통해 배웁니다.

3. accessAndOwner
관리자 권한을 다루는데 가장 많이 사용되는 Ownable 외에도
openzepplin의 대표적인 Owner2Step, AccessRole를 사용하여 다양한 관리자 권한 관리 컨트렉트를 사용해봅니다.



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