// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract EIP191{
    using ECDSA for bytes32;

    function verifySignature(
        address signer,
        string memory originalMessage,
        bytes memory signature
    ) public pure returns (bool) {
        if (getMessageHash(originalMessage).toEthSignedMessageHash().recover(signature) != signer) return false;
        else return true;
    }

    function getMessageHash(string memory _message) public pure returns (bytes32) {
        return keccak256(bytes(_message));
    }

}
