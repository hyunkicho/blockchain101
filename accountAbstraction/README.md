# Account Abstraction

ERC4337 블로그 설명 글 : https://it-timehacker.tistory.com/494

참고 할 만한 국문 자료 : https://github.com/boyd-dev/account-abstraction

```
npx hardhat test
Compiled 44 Solidity files successfully (evm target: paris).

  Account Abstraction Test with Counter
    Account Abstraction and Counter Test
owner wallet >> 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
aa_owner_salt >> 2
createdAccountAddress >> 0x6DEE055BFc735183C7ECFD009a9d537f69C2d8de
Wallet Nonce:  0n
Counter before increment:  0n
sig >> 0xfb0d1b282368fee70c5cf46c7e7e57e1feaa81f821d77d03d06a012a4fa790f8313a72b31887a5a0efe7f4e2bacf874daca91dd00b835af49aaa0a114aba66e61c
userOpHash: 0x2fea5fa7e39751aee85789cc3f6760ea07e8439af7b0ac089bad5e48d1feb09c
{
  sender: '0x6DEE055BFc735183C7ECFD009a9d537f69C2d8de',
  nonce: 0n,
  initCode: '0x',
  callData: '0xb61d27f60000000000000000000000009fe46736679d2d9a65f0992f2272de9f3c7fa6e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000004d5a49e0100000000000000000000000000000000000000000000000000000000',
  accountGasLimits: '0x000000000000000000000000008954400000000000000000000000000121eac0',
  preVerificationGas: 0,
  gasFees: '0x0000000000000000000000003b9aca000000000000000000000000003b9aca00',
  paymasterAndData: '0x',
  signature: '0xfb0d1b282368fee70c5cf46c7e7e57e1feaa81f821d77d03d06a012a4fa790f8313a72b31887a5a0efe7f4e2bacf874daca91dd00b835af49aaa0a114aba66e61c'
}
entryPoint: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Counter after increment:  1n
      ✔ Should create a wallet and increment counter

·------------------------------------------|---------------------------|-----------|-----------------------------·
|           Solc version: 0.8.24           ·  Optimizer enabled: true  ·  Runs: 1  ·  Block limit: 30000000 gas  │
···········································|···························|···········|······························
|  Methods                                                                                                       │
·························|·················|·············|·············|···········|···············|··············
|  Contract              ·  Method         ·  Min        ·  Max        ·  Avg      ·  # calls      ·  usd (avg)  │
·························|·················|·············|·············|···········|···············|··············
|  EntryPoint            ·  depositTo      ·          -  ·          -  ·    45768  ·            1  ·          -  │
·························|·················|·············|·············|···········|···············|··············
|  EntryPoint            ·  handleOps      ·          -  ·          -  ·   122043  ·            2  ·          -  │
·························|·················|·············|·············|···········|···············|··············
|  SimpleAccountFactory  ·  createAccount  ·          -  ·          -  ·   172235  ·            1  ·          -  │
·························|·················|·············|·············|···········|···············|··············
|  Deployments                             ·                                       ·  % of limit   ·             │
···········································|·············|·············|···········|···············|··············
|  Counter                                 ·          -  ·          -  ·    96409  ·        0.3 %  ·          -  │
···········································|·············|·············|···········|···············|··············
|  EntryPoint                              ·          -  ·          -  ·  3275375  ·       10.9 %  ·          -  │
···········································|·············|·············|···········|···············|··············
|  SimpleAccountFactory                    ·          -  ·          -  ·  1822311  ·        6.1 %  ·          -  │
·------------------------------------------|-------------|-------------|-----------|---------------|-------------·

  1 passing (715ms)
```

# Paymaster

simple paymaster example
https://github.com/piatoss3612/aa-from-scratch/blob/main/contracts/src/SimplePaymaster.sol

