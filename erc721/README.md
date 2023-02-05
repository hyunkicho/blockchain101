# metadat
1. metadata url
```
https://docs.opensea.io/docs/metadata-standards
```

```
{
  "description": "Fastcampus X 체인의정석.", 
  "image": "https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc721/metadata/image.png", 
  "name": "NFT example"
}
```
# truffle ERC721

1. 컨트렉트배포

4. 테스트 진행

    Start local network (로컬 네트워크 실행)
    ```
    truffle develop
    ```
    run erc20 test (Erc20 단위 테스트 파일 실행)
    ```
    truffle(develop)> test ./test/ERC20.js
    ```

    install module for checking revert statement(revert 체크하는 모듈 설치)
    ```
    npm install --save-dev chai truffle-assertions
    ```

    run scenarioERC20 test (Erc20 시나리오 테스트 실행)
    ```
    truffle(develop)> test ./test/scenario1ERC20.js
    ```
    ```
    truffle(develop)> test ./test/scenario2ERC20.js
    ```
5. 이더리움 공식 테스트넷 사용해보기 (환경변수 세팅)
    using dotEnv for privateKey and Rpc url
    ```
    npm i dotenv --save
    ```

    https://github.com/trufflesuite/truffle-hdwallet-provider
    truffle hdwallet provider 설정

    테스트 이더 받기
    ```
    https://goerlifaucet.com/
    ```

    goerli에 배포 진행
    ```
    truffle migrate --network goerli
    ```

    set env file (.env 파일 생성 및 설정)

    .env
    ```
    PUBLIC_KEY='' //ganache 에서 공개키 가져오기
    TEST_PUBLIC_KEY=''//ganache 에서 공개키 가져오기
    PRIVATE_KEY=''//ganache 에서 개인키 가져오기
    TEST_PRIVATE_KEY=''//ganache 에서 개인키 가져오기
    ERC20='' // 배포된 ERC20 주소 넣기
    RPC_URL='https://ethereum-goerli-rpc.allthatnode.com' //endpoint 정해서 넣어주기
    ```
6. 이더리움 공식 테스트넷 사용해보기 (스크립트 실행)

    1. check balanceOf - 잔고 체크 (조회)
    ```
    node scripts/balanceOfERC20.js
    ```

    2. send mint Tx - 토큰 민팅하기
    ```
    node scripts/mintERC20.js
    ```

    3. send Transfer Tx - 전송하기
    ```
    node scripts/transferERC20.js 
    ```

    4. check event - 이벤트 뽑기
    ```
    node scripts/events.js
    ```

# hardhat

1. bignumber 테스트
```
npx hardhat run scripts/bigNumber.ts
```
2. 컨트렉트 배포
```
npx hardhat run scripts/deploy.ts  
``
goerli에 배포
```
npx hardhat run scripts/deploy.ts --network goerli
```

3. 컨트렉트 테스트
```
npx hardhat test  
```
4. 함수실행
```
npx hardhat run scripts/getBalance.ts
```
5. 이벤트 조회
```
npx hardhat run scripts/event.ts
```

6. 다중체인 배포
faucet 받기
```
https://www.allthatnode.com/faucet/polygon.dsrv //폴리곤
https://testnet.bnbchain.org/faucet-smart //바이낸스
https://www.allthatnode.com/faucet/klaytn.dsrv //클레이튼
```

endpoint 가져오기 
```
https://www.allthatnode.com/polygon.dsrv //폴리곤
https://bsc-testnet-rpc.allthatnode.com //바이낸스
https://www.allthatnode.com/klaytn.dsrv //클레이튼
```

scan에서 확인하기
```
https://mumbai.polygonscan.com/ //폴리곤
https://testnet.bscscan.com/ //바이낸스
https://baobab.scope.klaytn.com/ //클레이튼
```

다중체인 배포해보기
```
npx hardhat run scripts/deploy.ts --network matic
npx hardhat run scripts/deploy.ts --network bsc
npx hardhat run scripts/deploy.ts --network klaytn
```

7. flat 파일 생성 후 verify

waffle 설치
```
npm install --save-dev ethereum-waffle
````

flat 파일 생성
```
npx waffle flatten
```

이더스캔에서 verify and publish 누르기
```
https://goerli.etherscan.io/token/0x44b375b024518b424da3edaa9c5d493ec900d62d#code
```