# mermaid

```
sequenceDiagram
    actor user
    actor admin
    participant vending machine contract as contract
    user ->>+ contract : buy
    contract -->>- user : tx hash
    admin ->>+ contract : refill
    contract -->>- user : tx hash
```
<img width="718" alt="image" src="https://user-images.githubusercontent.com/35443121/210163061-3f0849b5-f6ef-4271-9128-a60f0a3e5add.png">

# Truffle 기본예제

1. truffle 설치

```
sudo npm install -g truffle --save
```

2. 버전체크
```
hyunkicho@Hyunkiui-MacBookPro tutorial_truffle % truffle version                   
Truffle v5.7.0 (core: 5.7.0)
Ganache v7.5.0
Solidity v0.5.16 (solc-js)
Node v16.14.2
Web3.js v1.7.4
```

3. 기본 예제 생성

```
hyunkicho@Hyunkiui-MacBookPro tutorial_truffle % mkdir MetaCoin
cd MetaCoin

hyunkicho@Hyunkiui-MacBookPro MetaCoin % truffle unbox metacoin


Starting unbox...
=================

✓ Preparing to download box
✓ Downloading
✓ Cleaning up temporary files
✓ Setting up box

Unbox successful, sweet!

Commands:

  Compile contracts: truffle compile
  Migrate contracts: truffle migrate
  Test contracts:    truffle test
```

4. 배포 스크립트 작성
2_deploy_vendingMachine.js 파일 참고

5. 배포 진행

컴파일만 하는 경우
```
truffle compile
```

임의의 로컬 네트워크를 생성하고 그 안에서 배포를 원할 시
```
truffle develop
truffle(develop)> migrate
```

기본 설정으로 배포를 해보고 싶은 경우
```
truffle migrate
```

config 파일 수정해 보기
```
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  },
```

ganache에 배포하길 원할 시 다음과 같이 실행
```
truffle migrate --network ganache
```

6. 1번 파일만 배포하길 원할 시
```
truffle migrate --f 1 --to 1
```

7. test 실행
```
truffle test ./test/vendingMachine.js
```

8. 스크립트 작성
https://trufflesuite.com/docs/truffle/how-to/write-external-scripts/
파일 형태로 스크립트를 만들어서 사용 가능

