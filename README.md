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
```
truffle compile
truffle migrate
```

6. 2번 파일만 배포하길 원할 시
```
truffle migrate --f 2 --to 2
```

7. test 실행
```
truffle test ./test/vendingMachine.js
```

8. 스크립트 작성
https://trufflesuite.com/docs/truffle/how-to/write-external-scripts/
파일 형태로 스크립트를 만들어서 사용 가능

