1. Info
    erc 20 explain
    https://ethereum.org/en/developers/docs/standards/tokens/erc-20/

    eip 20
    https://eips.ethereum.org/EIPS/eip-20

    erc20 functions
    ```
    function name() public view returns (string)
    function symbol() public view returns (string)
    function decimals() public view returns (uint8)
    function totalSupply() public view returns (uint256)
    function balanceOf(address _owner) public view returns (uint256 balance)
    function transfer(address _to, uint256 _value) public returns (bool success)
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
    function approve(address _spender, uint256 _value) public returns (bool success)
    function allowance(address _owner, address _spender) public view returns (uint256 remaining)

    ```

    erc20 events
    ```
    event Transfer(address indexed _from, address indexed _to, uint256 _value)
    event Approval(address indexed _owner, address indexed _spender, uint256 _value)
    ```

2. install erc20

    you could install erc20 by following command (in this repo just use npm install instead)
    ```
    npm i @openzeppelin/contracts
    ```    

3. test bigNumber (bignumber 테스트 하기)

    ```
    node scripts/bigNumber.js 
    ```

    ```
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

.env 파일 예시

```
PUBLIC_KEY=''
TEST_PUBLIC_KEY=''
PRIVATE_KEY=''
TEST_PRIVATE_KEY=''
ERC20=''

RPC_URL='https://ethereum-goerli-archive-korea.allthatnode.com'
RPC_URL_MATIC='https://polygon-testnet-rpc.allthatnode.com:8545'
RPC_URL_BSC='https://bsc-testnet-rpc.allthatnode.com'
RPC_URL_KLAYTN='https://klaytn-baobab-rpc.allthatnode.com:8551'

# 컨트렉트 배포나 조회에서 에러가 날 때에는 node rpc url 키워드로 검색하셔서 새로운 rpc url을 찾아보시거나 infura 같은 회원 가입후 가능한 서비스를 찾아보세요
# could not detect network 같은 에러 발생 시
# 이벤트에서 에러가 날 때에는 archive node rpc url 키워드로 검색하셔서 새로운 rpc url을 찾아보시거나 infura 같은 회원 가입후 가능한 서비스를 찾아보세요
# https://ethereum-goerli-archive-korea.allthatnode.com
# https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
```

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

로컬에서 테스트 시
```
npx hardhat run scripts/getBalance.ts
```

goerli에서 테스트 시
```
npx hardhat run scripts/getBalance.ts --network goerli
```


로컬에서 테스트 시
```
npx hardhat run scripts/mint.ts
npx hardhat run scripts/transfer.ts
```

goerli에서 테스트 시

```
npx hardhat run scripts/mint.ts --network goerli
npx hardhat run scripts/transfer.ts --network goerli
```

1. 이벤트 조회

event.ts에서 fromBlock을 최신 블록으로 바꿔주기
(무료로 제공하는 rpc url에서는 최신 블록데이터를 많이 들고 있지 않는 경우가 있어서 응답값이 없을 수도 있습니다)
```
  const filter = {
    address: contractAddress.toString(),
    //fromBlock을 최근으로 조정해주어야 합니다. (노드 서비스에서 제공을 안해주는 경우가 많습니다.)
    fromBlock: 9066823,
    topics: [topic]
  };
```

로컬에서 테스트 시
```
npx hardhat run scripts/event.ts
```
goerli에서 테스트 시
```
npx hardhat run scripts/event.ts --network goerli
```


1. 다중체인 배포
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