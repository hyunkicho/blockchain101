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

