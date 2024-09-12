# Create , Create2, Create3

요약 : 컨트렉트에서 컨트렉트를 배포하는 상황에서 아래 3가지 방식이 사용될 수 있다.

create의 경우 일반적인 배포,
create2의 경우 배포되기 전에 배포될 주소를 미리 알 수 있음 다만 생성자가 달라지면 생성되는 주소도 달라짐, uniswap에서 풀 배포시 사용중임.
create3의 경우 생성자의 값과 상관 없이 동일한 주소로 배포가 가능 (멀티체인에서 chainID같은 생성자가 있을 시 편의성 증대)
create3는 내부적으로 create2와 create를 같이 사용하기 때문에 가스비가 많이 나오는 단점이 존재한다.

https://it-timehacker.tistory.com/509

create의 경우 bytecode가 달라질 경우에 배포되는 주소가 달라지게 된다. 다만 배포 가스비가 가장 저렴하다.create2의 경우에는 bytecode와 salt 값을 가지고 배포를 하게 된다. 배포하는 주소가 결정적이고 예측 가능하다.
Uniswap에서도 create2를 사용하여서 pair컨트렉트를 사용할때도 create2를 사용한다. create2의 특징은 다음과 같다.
1. 0xff라는 prefix가 추가됨2. sender address라는 특정한 주소에 따라서 컨트렉트 주소가 정해진다.3. salt값이 컨트렉트 주소의 uniquness를 보장한다.4. bytecode는 새로 배포할 컨트렉트의 코드이다.
keccak256(0xff ++ address ++ salt ++ keccak256(init_code))[12:]
이렇게 create2를 사용할 경우에는 상태채널이나 컨트렉트 지갑, 오프체인 작업 등에서 미리 배포된 주소인지 여부를 확인하고 배포를 하기 때문에 더 안전한 실행이 가능하다.
    function deploy(
        bytes memory bytecode,
        uint _salt
    ) internal returns (address) {
        address addr;

        assembly {
            addr := create2(
                callvalue(), // wei sent with current call
                // Actual code starts after skipping the first 32 bytes
                add(bytecode, 0x20),
                mload(bytecode), // Load the size of code contained in the first 32 bytes
                _salt // Salt from function arguments
            )

            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        return addr;
    }
create2와 매우 유사하지만 다른점은 바로 컨트렉트의 initCode 즉 생성자에 들어가는 input의 영향 없이 동일한 주소를 배포할 수 있는 것이다. msg.sender와 salt 2개의 키만 가지고서 컨트렉트 주소가 정해지기 때문에 서로 다른 생성자를 가지고 있더라도 해당 2개의 값만 일치한다면 동일한 주소로 배포가 이루어진다.다만 문제는 55k가스만큼이 들면서 create나 create2보다는 비싸진다는 점이다.
  */
  function create3(bytes32 _salt, bytes memory _creationCode) internal returns (address addr) {
    return create3(_salt, _creationCode, 0);
  }

  /**
    @notice Creates a new contract with given `_creationCode` and `_salt`
    @param _salt Salt of the contract creation, resulting address will be derivated from this value only
    @param _creationCode Creation code (constructor) of the contract to be deployed, this value doesn't affect the resulting address
    @param _value In WEI of ETH to be forwarded to child contract
    @return addr of the deployed contract, reverts on error
  */
  function create3(bytes32 _salt, bytes memory _creationCode, uint256 _value) internal returns (address addr) {
    // Creation code
    bytes memory creationCode = PROXY_CHILD_BYTECODE;

    // Get target final address
    addr = addressOf(_salt);
    if (codeSize(addr) != 0) revert TargetAlreadyExists();

    // Create CREATE2 proxy
    address proxy; assembly { proxy := create2(0, add(creationCode, 32), mload(creationCode), _salt)}
    if (proxy == address(0)) revert ErrorCreatingProxy();

    // Call proxy with final init code
    (bool success,) = proxy.call{ value: _value }(_creationCode);
    if (!success || codeSize(addr) == 0) revert ErrorCreatingContract();
  }
보면 create2로 proxy를 먼저 배포한 후에 해당 proxy를 통해서 다시 컨트렉트를 배포하는 것을 볼 수 있다.
내부적으로 먼저 Create2를 사용하여 프록시를 배포한 다음 컨트렉트를 배포하는 형태로 해당 프록시 컨트렉트의 자체 주소와 salt만 들어가면 된다. 또한 다른 블록체인에서 해당 버전에 맞게 컴파일을 하고 배포를 하며 체인이 다르더라도 생성자를 다르게 배포할 수 있기 때문에 구조적으로 멀티체인 배포 환경에 적합한 배포함수이다.
2. Create3 자세히 살펴보기
다시 한번 정리하자면 create3는 create 와 create2를 섞어서 쓰는 방식인데1. Create3는 내부적으로 creat2를 새로 배포한다. (이를 Proxy 컨트렉트라고도 부름)
address proxy;
assembly {
    proxy := create2(0, add(creationCode, 32), mload(creationCode), _salt)
}
2. 배포한 프록시 컨트렉트에 creationCode를 넣고 배포 진행
(bool success,) = proxy.call(_creationCode);
3. 아래 로직처럼 실제 컨트렉트 배포는 create를 통해서 배포가 되게 되며 이에 따라 프록시 컨트렉트의 주소와 논스 값에 따라 주소가 정해진다. 매번 새로 배포된 프록시 컨트렉트로 사용을 하기 때문에 nonce값이 고정적으로 1이고 이에 따라서 facotry 컨트렉트의 주소와 salt만 같으면 같은 주소로 배포된다.
bytes20(sha3(rlp.encode(bytes20(sha3(rlp.encode(address,proxy_bytecode,salt))),1)))
 
3. Create3 Factory 사용해보기
그러나 Create3Factroy 구현체를 보면 msg.sender가 표기되어 있는데 여기서 create2를 내부적으로 사용하면서 배포하는 계정 주소를 고려하여서 미리 프론트 런을 해서 특정 주소의 소유자가 되는것을 막게 된다. 만약 salt값에 해당 로직을 넣지 않게 된다면 악의적인 사용자가 미리 컨트렉트 주소를 배포해 버릴 수 있기 때문에 공격포인트를 막기위해 넣어주는 것이다.
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CREATE3} from "@Vectorized/solady/src/utils/CREATE3.sol";

/// @title Factory for deploying contracts to deterministic addresses via CREATE3
/// @author zefram.eth, SKYBIT
/// @notice Enables deploying contracts using CREATE3. Each deployer (msg.sender) has
/// its own namespace for deployed addresses.
contract SKYBITCREATE3Factory {
    function deploy(
        bytes32 salt,
        bytes memory creationCode
    ) external payable returns (address) {
        // hash salt with the deployer address to give each deployer its own namespace
        salt = keccak256(abi.encodePacked(msg.sender, salt));
        return CREATE3.deploy(salt, creationCode, msg.value);
    }

    function getDeployed(
        address deployer,
        bytes32 salt
    ) external view returns (address) {
        // hash salt with the deployer address to give each deployer its own namespace
        salt = keccak256(abi.encodePacked(msg.sender, salt));
        return CREATE3.getDeployed(salt);
    }
}
다만, 이렇게 될 시 create3를 사용하는 create3Factory를 호출하는 컨트렉트가 서로 다른 체인별로 동일하게 배포되어야 한다는 단점이 있다. 결국 create3Factory를 사용하는 컨트렉트 자체도 create3로 배포해야지 지갑 주소 하나로 모든 체인에 동일한 컨트렉트를 배포할 수 있게 된다.
또한 가장 중요한것은 Create3입장에서는  Create3Factory가 msg.sender가 되기 때문에 Factory컨트렉트의 경우 각 체인별로 하나씩 존재해야 하며 새로운 배포주소로 배포해서 동일한 컨트렉트 주소를 보유하고 있도록 만들어야한다.
ethers v6에서 양쪽 체인에 한번에 배포하는 코드는 아래와 같다. ethers v5와는 다르게 jsonRPCProvider 넣는부분이 수정되었다.
const { ethers } = require("hardhat");
const { privateKeyDeploy, providerUrl_A, providerUrl_B} = require("./const");
require("dotenv").config();

async function main() {
  const providerA = new ethers.JsonRpcProvider(providerUrl_A);
  const providerB = new ethers.JsonRpcProvider(providerUrl_B);

  const signerA = new ethers.Wallet(privateKeyDeploy, providerA);
  const signerB = new ethers.Wallet(privateKeyDeploy, providerB);

  const CREATE3Factory_a = await ethers.deployContract("CREATE3Factory",[],signerA);
  await CREATE3Factory_a.waitForDeployment();
  console.log(`📮 CREATE3Factory_a deployed at: ${await CREATE3Factory_a.getAddress()}`,signerA);

  const CREATE3Factory_b = await ethers.deployContract("CREATE3Factory",[],signerB);
  await CREATE3Factory_b.waitForDeployment();
  console.log(`📮 CREATE3Factory_b deployed at: ${await CREATE3Factory_b.getAddress()}`,signerB);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

4. Create3 의 사용성 판단
create3는 이렇게 생성자에 상관 없이도 멀티체인 환경에서 동일한 주소로 배포가 보장되게 되므로 사용성이 매우 늘어나게 된다.
일단 현재 크로스체인 브릿지를 만드는 상황에서 유저입장에서 생각해보면 wrapped NFT나 FT를 발행하는 컨트렉트의 주소가 같은 컨트렉트끼리 모두 주소가 같다면 메타마스크 같은 곳에서 import를 할때 모든 체인에 같은 주소만 넣으면 되게 되고 백엔드에서 데이터를 활용할 때도 코드가 훨씬 간결하고 개발이 쉬워진다.그러나 이렇게 되면 사실상 가스비가 훨씬 많이 발생하게 된다. 하지만 가스비가 많이 들더라도 전반적인 개발 시간을 줄여주거나 운영 이 쉬워지거나 유저 편의성이 증대된다면 컨트렉트를 배포하는 함수는 가스비가 더 비싸도 용인해줄 수 있지 않을까 싶다.
출처: https://it-timehacker.tistory.com/509 [체인의정석:티스토리]