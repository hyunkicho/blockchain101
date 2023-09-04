# Upgradable Smart contract

1. 프록시 컨트렉트의 구조 (업그레이더블 컨트렉트의 구조)
스마트 컨트렉트의 경우 원래는 업그레이드 되지 않는 것이 일반적입니다.
하지만 실제로 서비스를 개발하다 보면 기획이 제품이 완성되고 난 후에 변경되는 경우도 있기 때문에
신뢰의 가치를 해치지만 업그레이더블을 사용하는 경우가 있습니다.

개인적으로는 컨트렉트 분리와 변수 세팅 함수를 사용하는 걸 선호하지만
상황에 따라서 써야 할 경우도 있기에 학습해보도록 하겠습니다.

업그레이더블 컨트렉트의 경우 사용하기 쉽게 오픈제플린에서 가이드를 제공하고 있습니다.

공식 가이드 :
https://docs.openzeppelin.com/learn/upgrading-smart-contracts

조금 더 자세히 보고 싶다면 해당 글들을 추천드립니다.

추천 1:
https://medium.com/@aiden.p/%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%8D%94%EB%B8%94-%EC%BB%A8%ED%8A%B8%EB%9E%99%ED%8A%B8-%EC%94%A8-%EB%A6%AC%EC%A6%88-part-1-%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%8D%94%EB%B8%94-%EC%BB%A8%ED%8A%B8%EB%9E%99%ED%8A%B8%EB%9E%80-b433225ebf58

추천 2:
https://blog.openzeppelin.com/proxy-patterns/


2. Call VS Delegate CAll
   
먼저 일반적으로 EOA가 다른 컨트렉트를 호출하거나 하나의 CA에서 다른 컨트렉트로 호출을 할 때 상태변화를 일으키는 call은 일반 call외에도 delegate call이 있습니다.

만약 인터널트랜잭션을 실행시키고 싶을 때 처음에 트랜잭션을 보낸 주소를 끝까지 전달해야 한다면 delegate call를 사용해서 처음의 Msg.sender를 유지시킬 수 있어 msg.sender를 하나의 context에서 유지 시키고 싶을때 많이 사용됩니다.
아래 이미지를 보시면 이해가 더 잘 갈겁니다.
https://twitter.com/definikola/status/1512100191804997640/photo/1

업그레이더블 컨트렉트에서 바로 이런 delegate call이 사용됩니다.
call은 주소의 스토리지 공간에 대한 변화와 함수의 내용이 같은 CA에 위치해 있습니다.
따라서 일반적으로 컨트렉트에서 상호작용을 할 때는 함수의 로직부분에 따라 스토리지가 변경됩니다.

그러나 delegate call의 경우 중간에 ProxyContract를 따로 두어서 로직과 스토리지 부분을 분리시킬 수 있습니다.
프록시 컨트렉트에서 들어오는 콜을 바로 delegate call로 로직이 있는 컨트렉트에 바로 넘겨버린다면 msg.sender가 유지된 채로 실제 코드 실행은 로직이 있는 컨트렉트에서 하지만
스토리지에 대한 변경은 최초에 시작된 프록시 컨트렉트에서 이루어집니다.

따라서 ProxyContract는 고정되 있으며 하나의 통로 역할과 저장공간만 나타내고 세부 로직의 경우에는 연결된 로직 컨트렉트의 버전을 바꿔가면서 업데이트 하면 되는 것입니다.
이에 따라 ProxyContract를 통해 일반적인 EOA나 CA가 상호작용을 하기에 ProxyContract에서 delegatecall을 통해 실제 로직이 실행되는 컨트렉트는 변경이 가능해져서 
업그레이드 가능한 컨트렉트가 만들어지게 되었습니다.

그러면 실제 코드를 통해서 업그레이더블 컨트렉트를 살펴보도록 하겠습니다.

실제 코드 : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/Proxy.sol

먼저 delegate에 대한 부분입니다.
implemenatation(로직이 있는컨트렉트 주소)를 받아와서 해당 컨트렉트로 delegate call을 보내고 데이터를 받아오는 부분입니다.

```
    function _delegate(address implementation) internal virtual {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
```
해당 _delegate가 실행되는 부분은
```
    function _fallback() internal virtual {
        _beforeFallback();
        _delegate(_implementation());
    }
```
바로 fallback함수 입니다.
fallback 함수의 경우 아무런 funsig가 없거나 맞는 funcsig가 없는 경우 실행이 되게 됩니다.
따라서 일단 해당 추상 컨트렉트를 상속받은 프록시컨트렉트가 스토리지 부분만 따로 정의해 놓는다면 나머지 부분에 대해서는 바로 fallback으로 처리되어 실제 implemntation 컨트렉트로 가게 되는 것입니다.


2. 설치하기
https://docs.openzeppelin.com/upgrades-plugins/1.x/
```
npm install --save-dev @openzeppelin/hardhat-upgrades
npm install --save-dev @nomiclabs/hardhat-ethers ethers
```

hardhat.config에 추가
```
import '@openzeppelin/hardhat-upgrades';
```

실습 코드의 원본
https://forum.openzeppelin.com/t/openzeppelin-upgrades-step-by-step-tutorial-for-hardhat/3580

3. 테스트 코드 실행

```
npx hardhat test
```

4. 네트워크 실행

클레이튼의 경우 오픈제플린의 공식예제대로 하면 작동이 안되므로 bsc로 진행하도록 하겠습니다.
*클레이튼은 추후 업데이트 예정

생성
```
hyunkicho@Hyunkiui-MacBookPro tutorial_hardhat % npx hardhat run scripts/create-box.ts --network bsc
Box deployed to: 0x0F20c143a98CdfB3a1487278Bcd310296c674498
```

생성된 컨트렉트 주소로 V2 업그레이드
Impelmantion 컨트렉트는 바뀌지만 유저가 상호작용하는 주소는 같은 주소로 업그레이드가 완료되었다.

```
hyunkicho@Hyunkiui-MacBookPro tutorial_hardhat % npx hardhat run scripts/upgrade-box.ts --network bsc
Preparing upgrade...
BoxV2 Implemantaion will be : 0x4C18BB1a60fb0b9fF5747658cEC416CB91a9AE43
upgraded to same address :  0x0F20c143a98CdfB3a1487278Bcd310296c674498
```

1. Initialzer와 생성자

출저 : https://forum.openzeppelin.com/t/korean-writing-upgradeable-contracts/2007

위의 예제이서는 생성자로서 작동하는 로직이 따로 없었다. 그러나 생성자가 있는 경우라면 어떻게 해야 할까?

현재 예제에서는 오픈제플린을 상속받아서 쓰고 싶을 때는 Constructor대신에 Inizilizer를 쓰기 때문에 이를 고려하여 오픈제플린 업그레이더블 코드를 받아서 사용한다는 차이점이 있다.

생성자는 최초 한번만 실행되어야 하는데 업그레이더블에서는 매번 새로 배포하면서 계속해서 실행이 가능하기 때문에 일부러 한번만 실행되도록 하는 Initialize 함수를 따로 두고 체크를 해주어야 한다.

```
contract MyContract {
  uint256 public x;
  bool private initialized;

  function initialize(uint256 _x) public {
    require(!initialized);
    initialized = true;
    x = _x;
  }
}
```
이런식으로 이미 실행이 된 함수라면 체크를 해주는 것이다.
이러한 패턴은 매우 일반적이기에 오픈제플린에서는 따로 코드를 작성해서 제공한다.

```
import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract MyContract is Initializable {

  function initialize(address arg1, uint256 arg2, bytes arg3) initializer public payable {
    // "constructor" code...
  }

}
```
이와 같이 오픈제플린의 Initializable 컨트렉트를 상속받아서 실행시키게 된다.
constructor와는 다르게 상단 경로의 Initialze를 수동으로 모두 넣어주어야 한다.
```
import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract BaseContract is Initializable {
  uint256 public y;

  function initialize() initializer public {
    y = 42;
  }
}

contract MyContract is BaseContract {
  uint256 public x;

  function initialize(uint256 _x) initializer public {
    BaseContract.initialize(); // Do not forget this call!
    x = _x;
  }
}
```


2. 오픈제플린의 업그레이더블 코드

오픈제플린 컨트렉트를 상속받는 경우에는 위의 내용들이 모두 적용된 형태로 코드가 작성된다.


출저 : https://www.npmjs.com/package/@openzeppelin/contracts-upgradeable

```
npm i @openzeppelin/contracts-upgradeable
```

업그레이더블 컨트렉트에서는 생성자가 없기 때문에 생성자 부분을 initialize 함수로 둔다.
```
-    constructor() ERC721("MyCollectible", "MCO") {
+    function initialize() initializer public {
+        __ERC721_init("MyCollectible", "MCO");
     }
```

이에 따라 import 경로도 수정된다.
```
-import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
+import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
 
-contract MyCollectible is ERC721 {
+contract MyCollectible is ERC721Upgradeable 
```

3. 업그레이더블 컨트렉트에서의 유의점

출저 : https://forum.openzeppelin.com/t/korean-writing-upgradeable-contracts/2007

컨트랙트 수정
새로운 기능이나 버그 수정으로 인해 컨트랙트의 새 버전을 작성할 때, 준수해야 할 추가 제한 사항이 있습니다. 컨트랙트 상태 변수의 선언 된 순서 나 유형을 변경할 수 없습니다. 패턴 섹션에서 6이 제한의 원인에 대한 자세한 내용을 읽을 수 있습니다.

즉, 다음과 같은 초기 컨트랙트가있는 경우

```
contract MyContract {
  uint256 private x;
  string private y;
}
```
이후엔, 변수 유형을 변경할 수 없으며,
```
contract MyContract {
  string private x;
  string private y;
}
```
순서 역시 변경할 수 없고,
```
contract MyContract {
  string private y;
  uint256 private x;
}
```
기존에 존재하는 변수 이전에, 새 변수를 추가할 수 없고,
```
contract MyContract {
  bytes private a;
  uint256 private x;
  string private y;
}
```
기존 존재하는 변수를 제거할 수 없습니다.
```
contract MyContract {
  string private y;
}
```
새로운 변수를 추가하고자 하는경우엔, 항상 기존 변수 마지막에 추가되어야 합니다.
```
contract MyContract {
  uint256 private x;
  string private y;
  bytes private z;
}
```
변수 이름을 바꾸면 업그레이드 후와 동일한 값을 유지한다는 점에 유의하십시오. 새 변수가 의미 적으로 이전 변수와 동일한 경우 이는 바람직한 동작 일 수 있습니다.
```
contract MyContract {
  uint256 private x;
  string private z; // starts with the value from `y`
}
```
컨트랙트의 마지막에있는 변수를 제거해도, 스토리지에서는 지워지지 않습니다. 새 변수를 추가하는 후속 업데이트는 해당 변수가 삭제 된 값에서 남은 값을 읽도록합니다.
```
contract MyContract {
  uint256 private x;
}

// Then upgraded to...

contract MyContract {
  uint256 private x;
  string private z; // starts with the value from `y`
}
```
부모 컨트랙트를 을 변경하여 컨트랙트의 저장 변수를 실수로 변경하는 경우도 있습니다. 예를 들어, 다음과 같은 컨트랙트가있는 경우

```
contract A {
  uint256 a;
}

contract B {
  uint256 b;
}

contract MyContract is A, B { }
```
그런 다음 기본 컨트랙트가 선언 된 순서를 바꾸거나 새 기본 컨트랙트를 도입하여 MyContract를 수정하면, 변수가 실제로 저장되는 방식이 변경됩니다.
```
contract MyContract is B, A { }
```
하위에 자체 변수가있는 경우 기본 컨트랙트에 새 변수를 추가 할 수 없습니다. 다음과 같은 시나리오가 있습니다.
```
contract Base {
  uint256 base1;
}

contract Child is Base {
  uint256 child;
}
```
변수를 추가하기 위해Base가 수정 된 경우
```
contract Base {
  uint256 base1;
  uint256 base2;
}
```
그런 다음 변수base2에는 이전 버전에서child가 있던 슬롯이 할당됩니다. 이에 대한 임시 해결책은, 해당 슬롯을 "예약"하는 수단으로 향후 확장하려는 기본 컨트랙트에서 사용되지 않는 변수를 선언하는 것입니다. 이 트릭에는 가스 사용량이 증가하지 않습니다.

Caution 이러한 스토리지 레이아웃 제한을 위반하면 업그레이드 된 계약 버전의 스토리지 값이 혼합되어 애플리케이션에 심각한 오류가 발생할 수 있습니다