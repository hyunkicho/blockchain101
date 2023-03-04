# openzepplin multisig wallet

1. multisig 지갑 학습

멀티시그 서명의 경우 서명 한번만 진행을 하면 보안적인 문제가 발생할 수 있기 때문에
여러명의 서명을 통해서 트랜잭션을 실행시킵니다.

멀티시그 지갑 중 현업에서 대표적으로 많이 사용되는 것이 바로 gnosis의 멀티시그 지갑입니다.
기업 입장에서 감사를 받거나 보안점검등을 할 때 멀티시그 지갑을 필수로 두는 곳들이 어느정도 있기 때문에
멀티시그 지갑을 경험하는 것이 중요합니다.

멀티시그 지갑의 핵심 플로우는 아래와 같습니다.
1. 제안자 한명이 트랜잭션을 등록한다. (함수로 등록)
2. 트랜잭션을 등록할 때 누구에게(target) 얼만큼의 이더를 포함해서(value) 어떤 데이터를 보낼지(data)를 저장하게 되면 이를 통해 바로 트랜잭션을 실행시킬 수 있다.
3. 서명을 특정 N명 이상이 시작하게 될 시에는 실제로  트랜잭션이 실행되게 돤다.
4. 실행한 트랜잭션은 조회 함수를 사용해서 관리할 수 있다.

멀티시그 지갑을 사용하게 되면 컨트렉트 외에도 오프체인에서 데이터를 데이터 형태로 바꾸어 주는 작업이 필요하게 됩니다.
따라서 스크립트도 같이 학습을 해야 제대로 된 활용이 가능합니다.


2. multisig 코드 학습
   
multisig 지갑의 경우 아래 코드를 통해 학습할 예정입니다.
https://github.com/gnosis/MultiSigWallet

해당코드의 버전은 오래되었기 때문에 최신 버전으로 업데이트 된 코드를 보도록 하겠습니다.

2-1. submitTransaction

1단계 - 등록
destination으로, value 만큼의 이더를 보내면서, memory라는 내용의 트랜잭션을 실행하도록 등록
```
    function submitTransaction(address destination, uint value, bytes memory data)
        public
        returns (uint transactionId)
    {
        transactionId = addTransaction(destination, value, data);
        confirmTransaction(transactionId);
    }
```

2단계 - 트랜잭션 수락
등록된 트랜잭션 아이디를 입력하게 될 시 confirmations 를 하나씩 증가하게 만든다.

```
    function confirmTransaction(uint transactionId)
        public
        ownerExists(msg.sender)
        transactionExists(transactionId)
        notConfirmed(transactionId, msg.sender)
    {
        confirmations[transactionId][msg.sender] = true;
        emit Confirmation(msg.sender, transactionId);
        executeTransaction(transactionId);
    }
```

3단계 - 실행 

만약 트랜잭션 수락을 미리 지정한 confirmation number를 초과하여 진행할 시 자동적으로 트랜잭션이 실행된다.
```
    function executeTransaction(uint transactionId)
        public
        ownerExists(msg.sender)
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
        if (isConfirmed(transactionId)) {
            Transaction storage txn = transactions[transactionId];
            txn.executed = true;
            if (external_call(txn.destination, txn.value, txn.data.length, txn.data))
                emit Execution(transactionId);
            else {
                emit ExecutionFailure(transactionId);
                txn.executed = false;
            }
        }
    }
```

조건 검사의 경우 다음의 코드를 통해서 진행한다.
confirmations[transactionId][owners[i]] 를 1 씩 늘리다가
required로 지정된 숫자에 도달하는 순간 true를 리턴하며 아니라면 false를 리턴한다.
true를 만족하는 경우에만 실행이 되도록 만든다.
```
    function isConfirmed(uint transactionId)
        public
        view
        returns (bool)
    {
        uint count = 0;
        for (uint i=0; i<owners.length; i++) {
            if (confirmations[transactionId][owners[i]])
                count += 1;
            if (count == required)
                return true;
        }
        return false;
    }
```


* 그 외에는 취소, 관리자 권한 이동 등이 있다.

3. multisig 배포하기

생성자에 지갑 주소와 confirmation number를 지정해 주고 배포한다.
```
npx hardhat run scripts/deploy.ts 
```

4. 멀티시그 컨트렉트 테스트
   