# EIP712

1. EIP712 공식 문서 살펴보기
이더리움에서 서명을 할 때는 raw트랜잭션을 서명해서 signed 트랜잭션으로 만드는 과정도 대표적이지만
반대로 메세지에 대한 서명만 진행하는 경우도 같다.

아래와 같이 서명된 형태를 EIP712 서명이라고 부르며, 특정 구조체에 대한 정보를 유저가 확인하고 서명할 수 있다.
해당 서명은 각종 DAPP에서 자주 쓰인다.

```
encode(transaction : 𝕋) = RLP_encode(transaction)
encode(message : 𝔹⁸ⁿ) = "\x19Ethereum Signed Message:\n" ‖ len(message) ‖ message where len(message) is the non-zero-padded ascii-decimal encoding of the number of bytes in message.
encode(domainSeparator : 𝔹²⁵⁶, message : 𝕊) = "\x19\x01" ‖ domainSeparator ‖ hashStruct(message) where domainSeparator and hashStruct(message) are defined below.
```

자세한 사항은 공식 문서에서 살펴 볼 수 있으며, 공식 문제의 예시대로 제대로 코드를 맞추어야 지만 서명과 검증이 가능하다.
https://eips.ethereum.org/EIPS/eip-712

만약 EIP712 서명안에 거래 정보를 넣게 된다면 유저의 거래 정보가 메세지가 되고 암호화 되어 추후에 해당 데이터를 검토하고 트랜잭션을 대신 실행시켜 줄 수도 있다.
이에 따라 유니스왑이나 오픈씨와 같은 대표적인 DAPP에서도 사용되는 것이 바로 EIP712 서명이다.

참고)
https://it-timehacker.tistory.com/316


2. 함수 살펴보기

EIP712의 경우 오픈제플린에서도 제공을 하며 오픈제플린의 EIP712를 사용할 경우 쉽게 서명을 구현할 수 있다.

컨트렉트의 경우 다음과 같다.
```
// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (utils/cryptography/EIP712.sol)

pragma solidity ^0.8.0;

import "./ECDSA.sol";

/**
 * @dev https://eips.ethereum.org/EIPS/eip-712[EIP 712] is a standard for hashing and signing of typed structured data.
 *
 * The encoding specified in the EIP is very generic, and such a generic implementation in Solidity is not feasible,
 * thus this contract does not implement the encoding itself. Protocols need to implement the type-specific encoding
 * they need in their contracts using a combination of `abi.encode` and `keccak256`.
 *
 * This contract implements the EIP 712 domain separator ({_domainSeparatorV4}) that is used as part of the encoding
 * scheme, and the final step of the encoding to obtain the message digest that is then signed via ECDSA
 * ({_hashTypedDataV4}).
 *
 * The implementation of the domain separator was designed to be as efficient as possible while still properly updating
 * the chain id to protect against replay attacks on an eventual fork of the chain.
 *
 * NOTE: This contract implements the version of the encoding known as "v4", as implemented by the JSON RPC method
 * https://docs.metamask.io/guide/signing-data.html[`eth_signTypedDataV4` in MetaMask].
 *
 * _Available since v3.4._
 */
abstract contract EIP712 {
    /* solhint-disable var-name-mixedcase */
    // Cache the domain separator as an immutable value, but also store the chain id that it corresponds to, in order to
    // invalidate the cached domain separator if the chain id changes.

    //EIP712 서명에 명시된 형태로 메세지를 만들기 위해서 정의해둔 편수 값
    bytes32 private immutable _CACHED_DOMAIN_SEPARATOR;
    uint256 private immutable _CACHED_CHAIN_ID;
    address private immutable _CACHED_THIS;

    bytes32 private immutable _HASHED_NAME;
    bytes32 private immutable _HASHED_VERSION;
    bytes32 private immutable _TYPE_HASH;

    /* solhint-enable var-name-mixedcase */

    /**
     * @dev Initializes the domain separator and parameter caches.
     *
     * The meaning of `name` and `version` is specified in
     * https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator[EIP 712]:
     *
     * - `name`: the user readable name of the signing domain, i.e. the name of the DApp or the protocol.
     * - `version`: the current major version of the signing domain.
     *
     * NOTE: These parameters cannot be changed except through a xref:learn::upgrading-smart-contracts.adoc[smart
     * contract upgrade].
     */

     //생성자에서 이름과 버젼을 가져오게 되는데 이는 나중에 메타마스크 같은 지갑에서 사람이 볼 수 있게 보여주는 데이터이다.
     //해당 이름과 버젼의 경우 다른 정보와 함께 typeHash형태로 만들어서 서명안에 들어가게 된다.
    constructor(string memory name, string memory version) {
        bytes32 hashedName = keccak256(bytes(name));
        bytes32 hashedVersion = keccak256(bytes(version));
        bytes32 typeHash = keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );
        _HASHED_NAME = hashedName;
        _HASHED_VERSION = hashedVersion;
        _CACHED_CHAIN_ID = block.chainid;
        _CACHED_DOMAIN_SEPARATOR = _buildDomainSeparator(typeHash, hashedName, hashedVersion);
        _CACHED_THIS = address(this);
        _TYPE_HASH = typeHash;
    }

    //도메인 세퍼레이터의 경우 EIP721 서명 값에 필요한 데이터로 오픈제플린 함수에서 생성자가 알아서 해시값을 통해 만들어 주게 된다.
    /**
     * @dev Returns the domain separator for the current chain.
     */
    function _domainSeparatorV4() internal view returns (bytes32) {
        if (address(this) == _CACHED_THIS && block.chainid == _CACHED_CHAIN_ID) {
            return _CACHED_DOMAIN_SEPARATOR;
        } else {
            return _buildDomainSeparator(_TYPE_HASH, _HASHED_NAME, _HASHED_VERSION);
        }
    }

    function _buildDomainSeparator(
        bytes32 typeHash,
        bytes32 nameHash,
        bytes32 versionHash
    ) private view returns (bytes32) {
        return keccak256(abi.encode(typeHash, nameHash, versionHash, block.chainid, address(this)));
    }

    //실제로 서명하는 메세지의 데이터 값들은 구조체 형태의 값들을 만들고 해쉬를 취한 값들과 생성자에서 만들어준 도메인세퍼레이터와 함께 ECDSA 서명을 하게 된다.
    //이에 따라서 추후 서명을 한 개인키와 메세지 안의 데이터에 있는 공개키 등을 비교 검토하여 각종 다양한 로직을 DAPP에 넣을 수 있다.

    /**
     * @dev Given an already https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct[hashed struct], this
     * function returns the hash of the fully encoded EIP712 message for this domain.
     *
     * This hash can be used together with {ECDSA-recover} to obtain the signer of a message. For example:
     *
     * ```solidity
     * bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
     *     keccak256("Mail(address to,string contents)"),
     *     mailTo,
     *     keccak256(bytes(mailContents))
     * )));
     * address signer = ECDSA.recover(digest, signature);
     * ```
     */
    function _hashTypedDataV4(bytes32 structHash) internal view virtual returns (bytes32) {
        return ECDSA.toTypedDataHash(_domainSeparatorV4(), structHash);
    }
}

```

3. UseCase - Uniswap V2 permit
    https://github.com/Uniswap/permit2/blob/main/src/AllowanceTransfer.sol

    * 최근에 나온 Permit2를 통해 살펴봅시다.

    signature.verify를 하게 되면 eip712 서명을 통해 검증을 하고 보내게 되는 식이다.
    트랜잭션을 2번 실행하는 대신 1번의 과정을 eip712 서명을 통해 줄인 모습이다.


    https://github.com/Uniswap/permit2/blob/main/src/libraries/PermitHash.sol
    hash의 내용의 경우 따로 라이브러리를 두어 만들어 두었다.


    https://github.com/Uniswap/permit2/blob/main/src/libraries/Allowance.sol
    라이브러리의 내용을 간략하게 담기 위해서 uin256 숫자형 자료에 여러 내용을 넣고 pack을 하는 식으로 데이터를 다룬다. (erc721A와 비슷)
    ```
    /// @notice Computes the packed slot of the amount, expiration, and nonce that make up PackedAllowance
    function pack(uint160 amount, uint48 expiration, uint48 nonce) internal pure returns (uint256 word) {
        word = (uint256(nonce) << 208) | uint256(expiration) << 160 | amount;
    }
    ```

    Struct를 인터페이스에 구현하여 데이터를 서명

    Permit의 경우 특정 기간이 있고 nonce를 통해서 토큰을 보내주는 로직
    ```
    /// @notice The permit data for a token
    struct PermitDetails {
        // ERC20 token address
        address token;
        // the maximum amount allowed to spend
        uint160 amount;
        // timestamp at which a spender's token allowances become invalid
        uint48 expiration;
        // an incrementing value indexed per owner,token,and spender for each signature
        uint48 nonce;
    }

    /// @notice The permit message signed for a single token allownce
    struct PermitSingle {
        // the permit data for a single token alownce
        PermitDetails details;
        // address permissioned on the allowed tokens
        address spender;
        // deadline on the permit signature
        uint256 sigDeadline;
    }
    ```

    AllowanceTransfer의 경우 allownace에 필요한 정보를 구조체 형태로 먼저 서명
    ```
    /// @notice Details for a token transfer.
    struct AllowanceTransferDetails {
        // the owner of the token
        address from;
        // the recipient of the token
        address to;
        // the amount of the token
        uint160 amount;
        // the token to be transferred
        address token;
    }
    ```


    Permit2 - signatureTrnasfer.sol (allownace 사용안하고 바로 보내줌) - permitTransferFrom)

    // owner가 서명한 permit 데이터 (permitTrnasfeFrom 구조체의 정보)를 받아와서 
    //데드라인과 amount를 가져와서 각각 유효성 검사를 하고
    //nonce를 가져와서 순서를 조정하고
    //verify로 실제 owner가 서명한 것인지 검증한 후에
    //safeTransferFrom을 보내줘 버린다.
    
    function _permitTransferFrom(
        PermitTransferFrom memory permit,
        SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes32 dataHash,
        bytes calldata signature
    ) private {
        uint256 requestedAmount = transferDetails.requestedAmount;

        if (block.timestamp > permit.deadline) revert SignatureExpired(permit.deadline);
        if (requestedAmount > permit.permitted.amount) revert InvalidAmount(permit.permitted.amount);

        _useUnorderedNonce(owner, permit.nonce);

        signature.verify(_hashTypedData(dataHash), owner);

        ERC20(permit.permitted.token).safeTransferFrom(owner, transferDetails.to, requestedAmount);
    }

    Permit2 - AllownaceTransfer.sol (allownace 사용)
    AllowanceTransfer를 사용한 함수는 모두 실행 됨
    ```
        /// @inheritdoc IAllowanceTransfer
        function permit(address owner, PermitSingle memory permitSingle, bytes calldata signature) external {
            if (block.timestamp > permitSingle.sigDeadline) revert SignatureExpired(permitSingle.sigDeadline);

            // Verify the signer address from the signature.
            signature.verify(_hashTypedData(permitSingle.hash()), owner);

            _updateApproval(permitSingle.details, owner, permitSingle.spender);
        }
    ```

    owner값을 통해 서명을 한 주체가 검증이 되면 그 이후에 Approve에 필요한 값을 가져와서 allowance를 업데이트 한다.
    ```
    /// @notice Sets the new values for amount, expiration, and nonce.
    /// @dev Will check that the signed nonce is equal to the current nonce and then incrememnt the nonce value by 1.
    /// @dev Emits a Permit event.
    function _updateApproval(PermitDetails memory details, address owner, address spender) private {
        uint48 nonce = details.nonce;
        address token = details.token;
        uint160 amount = details.amount;
        uint48 expiration = details.expiration;
        PackedAllowance storage allowed = allowance[owner][token][spender];

        if (allowed.nonce != nonce) revert InvalidNonce();

        allowed.updateAll(amount, expiration, nonce);
        emit Permit(owner, token, spender, amount, expiration, nonce);
    }
    ```


    transferFrom 실행
    ```
        function transferFrom(AllowanceTransferDetails[] calldata transferDetails) external {
            unchecked {
                uint256 length = transferDetails.length;
                for (uint256 i = 0; i < length; ++i) {
                    AllowanceTransferDetails memory transferDetail = transferDetails[i];
                    _transfer(transferDetail.from, transferDetail.to, transferDetail.amount, transferDetail.token);
                }
            }
        }
    ```
4. UseCase - Opensea WyvernExchange
    오픈씨의 경우 코드가 복잡하기에 아래 제가 작성한 미디엄 글을 통해서 살펴보도록 하겠습니다.

    오픈씨의 거래구조
    https://medium.com/curg/%EC%98%A4%ED%94%88%EC%94%A8-%EA%B1%B0%EB%9E%98%EC%86%8C%EC%9D%98-%EA%B5%AC%EC%A1%B0-%EC%A7%81%EC%A0%91-%EB%9C%AF%EC%96%B4%EB%B3%B4%EC%9E%90-253469a9224

    오픈씨의 EIP712 서명
    https://medium.com/curg/%EC%98%A4%ED%94%88%EC%94%A8-%EC%BB%A8%ED%8A%B8%EB%A0%89%ED%8A%B8%EC%9D%98-%EB%B0%9C%EC%A0%84-%EA%B3%BC%EC%A0%95%EA%B3%BC-%EB%B2%84%EC%A0%84%EB%B3%84-%ED%95%B5%EC%8B%AC-%EB%A1%9C%EC%A7%81-%EB%B6%84%EC%84%9D-c1c2f592242

    * 강의에서는 서명에서 빠진 내용이 있어 수정해 두었습니다. (수강생 분의 도움으로 오류를 발견할 수 있었습니다.)
    다만 메타마스크의 경우 강의를 찍을때와는 다르게 현재 예제가 더 잘 나와있기 때문에 해당 링크를 참고하시기를 바랍니다.
    https://docs.metamask.io/wallet/reference/eth_signtypeddata_v4/

