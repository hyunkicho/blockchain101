출저 :     https://soliditydeveloper.com/erc-4626

1. ERC4626의 개념
    원래 erc20 토큰은 전송으로도 충분히 작동했지만 디파이 서비스가 활발해지자
    예치를 하고 이자를 받아가거나 인출을 하는 경우가 많아졌습니다.

    이에 따라서 erc20 토큰 자체에 예치를 하고 인출하고 이자를 나누어 주는 로직을 구현하자고 주장하여 나오게 된 것이 ERC4626입니다.

    이러한 역할을 하여 실제로 토큰을 보관하는 컨트렉트를 Vault라고도 부릅니다. 실제로 금고 처럼 토큰을 보관하면서 여기서 발생하는 이자까지 토큰에서 직접 하게 되면 여러 디파이 서비스에 쉽게 적용 가능한 토큰이 나오게 됩니다.
    
    일단 예치자 입장에서는 가스비가 절감되게 되며 유저입장에서는 유저 친화적으로 서비스를 쉽게 만들 수 있습니다.

2. 주요 코드

    ### 예치 및 인출
    먼저 예치하는 부분입니다. 자신이 원래 배포된 erc20을 deposit 해주게 되면 그만큼이 예치가 되게 됩니다. 이때 예치한 원래 erc20을 underlying token이라고 부르고 예치되어 받는 예치 증표는 shares라고 부릅니다.
    ```
    function deposit(uint256 assets, address receiver)
    external
    returns (uint256 shares);
    ```

    다음 mint는 예치와는 유사하지만 underlying asset 대신 shares에 해당하는 토큰을 넣고 mint 해서 받아오는 것입니다.
    ```
    function mint(uint256 shares, address receiver)
    external
    returns (uint256 assets);
    ```

    redeem의 경우 자신이 deposit 했던 자산을 다시 받아오는 행위 입니다. shares 만큼이 소각되고 underlying 자산이 돌아오게 됩니다.
    ```
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) external returns (uint256 assets);
    ```

    withdraw의 경우 deposit과 mint의 차이처럼 redeem을 하게 되면 underlying이 아닌 shares 형태의 자산으로 인출이 되게 됩니다.
    ```
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) external returns (uint256 shares);
    ```

    ### Max functions

    인출 및 예치 가능한 각각 최대 수치를 산정해주는 함수입니다.
    ```
    function maxDeposit(address receiver) external view returns (uint256);
    ```

    ```
    function maxMint(address receiver) external view returns (uint256);
    ```

    ```
    function maxWithdraw(address owner) external view returns (uint256);
    ```

    ```
    function maxRedeem(address owner) external view returns (uint256);
    ```

    ### 자산 조회

    underliying 토큰의 주소
    ```
    function asset() external view returns (address);
    ```

    총 관리중인 자산의 수
    ```
    function totalAssets() external view returns (uint256);
    ```

    ### 자산 변환
    각 share와 underliying token을 변환 가능하게 표시
    ```
    function convertToShares(uint256 assets) external view returns (uint256);

    function convertToAssets(uint256 shares) external view returns (uint256);
    ```

    ### 미리 계산해 보는 조회 함수들
    
    ```
    function previewDeposit(uint256 assets) external view returns (uint256);
    function previewMint(uint256 shares) external view returns (uint256);
    function previewWithdraw(uint256 assets) external view returns (uint256);
    function previewRedeem(uint256 shares) external view returns (uint256);
    ```

3. 배포 해보기
    ```
    npx hardhat run scripts/deploy.ts
    ```

4. 테스트 해보기
    ```
    npx hardhat run test
    ```