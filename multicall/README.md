# makerdao multi call
source : https://github.com/makerdao/multicall/blob/master/src/Multicall2.sol

1. multicall

defi의 경우 다양한 call을 한번의 화면에서 불러와야 한다. 이런 경우 시간이 오래걸리기 때문에 여러번의 call을 한번에 해주는 multicall이 나오게 되었다.
해당 로직은 defi 뿐 만 아니라 다양한 Dapp에서 활용이 될 수 있으며 페이지 로딩 시간을 최소화 시켜 줄 수 있어 중요하다.

컨트렉트에 조회 함수를 실행하기 위해서는 target (조회할 컨트렉트 주소)와 callData (call에 대한 실질적인 내용) 2가지가 있으면 조회가 가능하다.
해당 정보를 모두 담고 있는 Call을 다음과 같이 구조체로 만들면 컨트렉트에서 직접 call을 실행시킬 수 있다.
```
    struct Call {
        address target;
        bytes callData;
    }
```

해당 구조체를 배열 형태로 받아와서 각각 실행을 시키는 로직이다.
calls에 있는 target에 .call(callData)를 넣어서 해당 주소에 call을 직접 실행시킨다.
물론 callData의 경우에는 미리 콜데이터의 형태로 인코딩이 된 값을 넣어주어야 한다.
다만 여기서는 call에서 success가 아닐 경우는 오류가 나기 때문에 하나만 오류가 나더라도 전체가 오류를 발생시키게 된다.
```
    function aggregate(Call[] memory calls) public returns (uint256 blockNumber, bytes[] memory returnData) {
        blockNumber = block.number;
        returnData = new bytes[](calls.length);
        for(uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory ret) = calls[i].target.call(calls[i].callData);
            require(success);
            returnData[i] = ret;
        }
    }
```
그 외에도 디파이에서 유용한 Helper functions가 존재한다. 특히 timestamp나 blocknumber 등을 가져오는 부분은 디파이에서 많이 쓰기 때문에 넣어져 있는 것을 볼 수 있다.

2. multicall2

기존 multicall의 경우 중간에 하나라도 에러가 나면 전체가 다 콜이 안되는 문제가 있다.
이러한 경우 어디서 오류가 났는지 디버깅이 어려울 뿐 만 아니라 하나의 조회 함수 때문에 나머지 조회도 막힌다는 문제가 있어 해당 부분이 보안되었다.
왜 이런 과정이 필요한지 첨언을 하자면 실제로 개발을 진행할 때 multicall에서 하나만 오류가 나서 오류를 발생시키면 조회 함수가 잘못 되었을 때 별도의 캐싱 로직이 없다면 페이지 모든 값에 빈 값이 뜨는 오류가 날 수 있기 때문에
실제 프로덕트에서는 조회 중 오류가 있더라도 제대로 나오는 값들은 제대로 띄워야 하는 경우가 있다.

multicall2에서는 multicall 처럼 aggregate도 있지만 tryAggregate도 추가가 되었다.
중간에 실패를 하더라도 바로 오류를 발생 시키지는 않는다.
대신 Call 구조체 외에도 Result구조체가 있어서 결과 값을 리턴할 때 성공 여부를 따로 리턴해 준다.
```
    struct Call {
        address target;
        bytes callData;
    }
    struct Result {
        bool success;
        bytes returnData;
    }
```

try aggregate는 중간에 requireSuccess를 두어서 해당 값이 true일 때만 중간에 오류를 내준다.
success와 return data를 returnData[i] = Result(success, ret) 를 통해서 배열에 저장 시킨 후 리턴해준다.
```
    function tryAggregate(bool requireSuccess, Call[] memory calls) public returns (Result[] memory returnData) {
        returnData = new Result[](calls.length);
        for(uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory ret) = calls[i].target.call(calls[i].callData);

            if (requireSuccess) {
                require(success, "Multicall2 aggregate: call failed");
            }

            returnData[i] = Result(success, ret);
        }
    }
```

또한 multicall2에서는 호출당시의 블록 번호나 해시 값도 같이 호출해주는 로직도 있다.
```
    function tryBlockAndAggregate(bool requireSuccess, Call[] memory calls) public returns (uint256 blockNumber, bytes32 blockHash, Result[] memory returnData) {
        blockNumber = block.number;
        blockHash = blockhash(block.number);
        returnData = tryAggregate(requireSuccess, calls);
    }
```

* multicall의 함수에 view가 없는 이유??
multicall의 경우 조회임에도 view로 안되어 있어서 실제 실행이 아닌 상태변화 없이 결과 값만 얻는 함수인 staticCall로 호출해야지만 사용이 가능하다. staticCall은 컨트렉트 내부, 외부에서 모두 호출이 가능하기 때문에 view 함수가 아니더라도 조회가 가능하다. 또한 멀티콜은 조회 뿐만 아니라 트랜잭션 실행해도 사용될 수 있기 때문이다. multicall은 조회 외에도 트랜잭션을 묶어서 실행시킬 수 있으며, 이에 따라 가스비의 절감 효과도 가질 수 있다. 

1. 테스트 및 배포
```
//Multicall test
npx hardhat run scripts/deployMulticall.ts

//Multicall2 test
npx hardhat run scripts/deployMulticall2.ts
```