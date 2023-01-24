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

    Start local network (로컬 네트워크 실행)
    ```
    truffle develop
    ```

    ```
4. 테스트 진행

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
5. 스크립트 실행
    using dotEnv for privateKey and Rpc url
    ```
    npm i dotenv --save
    ```

    1. check balanceOf
    ```
    node scripts/balanceOfERC20.js
    ```
    2. send mint Tx
    ```
    node scripts/mintERC20.js
    ```
    3. send Transfer Tx
    ```
    node scripts/transferERC20.js 
    ```
