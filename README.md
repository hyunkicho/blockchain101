# basic tutorial for dapp developer

* 본 경로의 강의는 패스트캠퍼스 및 "체인의 정석"으로 활동할 강의에서 자료로 사용될 예정입니다.
https://www.youtube.com/watch?v=WNxKsA0gfc8&t=5s

* 외부 활용 시 "체인의 정석"으로 출저를 남겨주시길 바랍니다.

학습 순서

## 기초 학습 & ERC 토큰들 표준

* 현재 토큰 표준 실습에 있어서 각 소스 코드에는 optimize가 적용이 되지 않았는데 배포시 공간 절약과 가스비를 절감하는 작업이 필요하다면 아래와 같이 optimizer를 기본 설정 값으로 넣어두는 것은 추천드립니다. (run 숫자를 크게 잡아도 되지만 과도하게 클 경우 오히려 비효율 적일 수도 있습니다.)

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

