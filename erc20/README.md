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
