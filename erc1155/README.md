# hardhat ERC1155
1. 컨트렉트 배포
    ```
    npx hardhat run scripts/deploy.ts
    ```

2. 컨트렉트 테스트

    run erc1155 test (Erc1155 테스트 파일 실행)
    ```
    npx hardhat test
    ```

3. 함수 실행
    잔고 조회
    ```
    npx hardhat run scripts/getBalance.ts --network bsc
    ```
    url 조회
    ```
    npx hardhat run scripts/getUrl.ts --network bsc
    ```
    민팅
    ```
    npx hardhat run scripts/mint.ts --network bsc
    ```
    배치 민팅
    ```
    npx hardhat run scripts/mintBatch.ts --network bsc
    ```
    전송
    ```
    npx hardhat run scripts/transfer.ts --network bsc
    ```