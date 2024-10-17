# 요약
만약 특정 서비스에서 동일한 컨트렉트를 계속해서 배포되어야 하는 상황이라면 어떻게 해야할까?
hardhat에서 계속해서 배포하는 것은 사람이 작업을 하는 것이기 때문에 실수 포인트도 많고 많은 시간이 들 것이다.
이러한 경우에는 컨트렉트에서 다른 컨트렉트를 배포하는 식으로 작업을 하는 것이 가능하다.
이러한 방법에는 크게 3가지가 존재하고 각자 장단점이 존재한다.

- Create
기존의 create => new Contract 새로운 컨트렉트 배포
https://docs.soliditylang.org/en/v0.5.15/control-structures.html#creating-contracts-via-new

create의 경우에는 컨트렉트를 생성한 사람의 주소값과 지갑이 보내는 트랜잭션의 개수가 늘어날때마다 1씩 증가하는 nonce를 hash한 값이 컨트렉트의 주소가 된다.
```
new_address = hash(sender, nonce)
```
이러한 방법은 일반적인 배포와 완전히 동일한 로직이며 가스비도 가장 저렴하다.

- Create2
지갑의 nonce값과 상관 없이 예측 가능한 컨트렉트 주소 값을 만드는 것이 create2이다.
예측 가능한 컨트렉트의 주소를 만들게 되면 nonce와 같은 체인외부의 상황과 상관 없이 어떤 주소가 나오게 될지 미리 알 수 있기 때문에
배포 전에 미리 이미 있는 컨트렉트인지 체크할 수 있으며, 이에 따라 더 안전하고 복잡한 로직을 실행할 수 있게 된다.
대표적으로 계정추상화나 유니스왑에서 풀을 생성하는 부분이 create2로 사용된다.
다만 Creat2는 생성자에 따라서 영향을 받기 때문에 여러 체인에서 동일한 주소를 만들고 싶은데 chainId와 같은 값이 생성자로 들어가게 되면 동일한 주소를 만들기는 어려운 점이 존재한다.
```
new_address = hash(0xFF, sender, salt, bytecode)
```

- Create3
Creat3의 경우 컨트렉트를 배포하는 주소와 salt값 만을 가지고 배포하기 때문에 생성자와 상관 없이 미리 예측 가능한 동일한 주소를 만들 수 있다. 어차피 한 체인에서는 동일한 주소를 만들 일이 없지만 여러 체인을 다루는 서비스에서 사용하면 유리할 수 있는 장점이 있다. 이에 따라 Create3는 여러 체인을 다루는 서비스에서 사용되기에 좋다. 다만 Creat3의 경우 배포되는 순서가 먼저 Create2를 통해서 ProxyContract라는 1회성 컨트렉트를 배포하고 난 뒤에 Create를 1번 실행시켜주는 형태로 진행되기 때문에 배포를 진행할 때 마다 가스비가 많이 들어가게 된다. 

=> 이에 따라 각 서비스의 상황에 맞게 Create를 사용하는 것이 중요하다.

# CREATE & CREATE2 상세설명
설명링크 : https://it-timehacker.tistory.com/483

# CREAT3 설명
설명 링크 : https://it-timehacker.tistory.com/509
참고 코드 : https://github.com/transmissions11/solmate

```
npm i solmate
```
