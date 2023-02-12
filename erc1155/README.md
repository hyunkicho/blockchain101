# hardhat ERC1155
1. 컨트렉트 배포
    ```
    npx hardhat run scripts/deploy.ts
    ```
    * 참고) 패스트 캠퍼스 강의 중 P8-CH4-4에서 tokenID를 커스터마이징 하여 넣은 Token URI는 제대로 된 형태가 아니며 P8-CH4-5에서 이를 수정하는 내용을 추가하였습니다.
    * token URI의 경우 어떻게 관리하든지 본인의 자유이며 만약 P8-CH4-4에서  tokenID를 커스터마이징 하여 넣은 Token URI의 또 다른 형태를 보고 싶으시다면 제가 이전에 작성한 해당 소스코드를 참고하시면 되겠습니다. : https://github.com/hyunkicho/deployKIP37

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


4. 