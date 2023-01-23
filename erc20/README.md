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

    창 하나 더 띄우고 test bigNumber 살행
    ```
    node scripts/bigNumber.js    
    ```

4. 