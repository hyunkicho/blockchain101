# metadat
1. metadata url
```
https://docs.opensea.io/docs/metadata-standards
```

```
{
  "description": "Fastcampus X 체인의정석.", 
  "image": "https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc721/metadata/image.png", 
  "name": "NFT example"
}
```
# truffle ERC721

1. 컨트렉트배포

```
truffle migrate --network goerli
```

2. 테스트 진행

    Start local network (로컬 네트워크 실행)
    ```
    truffle develop
    ```
    run erc20 test (Erc20 단위 테스트 파일 실행)
    ```
    truffle(develop)> test ./test/ERC721.js
    ```
3. 함수 실행

잔고 조회
```
node scripts/balanceOfERC721.js --network goerli
```

민팅
```
node scripts/mint.js --network goerli
```

전송
```
node scripts/transferERC721.js --network goerli
```

이벤트 조회
```
node scripts/events.js --network goerli
```