// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
contract MyEIP712 is EIP712 {
    bytes32 public immutable _MESSAGE_TYPEHASH = keccak256("Message(address from,address to,string data)");
    struct Message {
        address from;
        address to;
        string data;
    }

    constructor() EIP712("MyEIP712", "1") {

    }

    function domainSeparatorV4() public view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function hashTypedDataV4(bytes32 structHash)public view returns (bytes32) {
        return _hashTypedDataV4(structHash);
    }

    //validating Signer
    function validateSigner(bytes32 structHash, bytes memory signature) public view returns (address) {
        return ECDSA.recover(_hashTypedDataV4(structHash), signature);
    }

    //make hash struct of the order
    function hashStruct(Message memory message)
        public
        view
        returns (bytes32)
    {
        return 
        keccak256(
            abi.encode(
            _MESSAGE_TYPEHASH,
            message.from,
            message.to,
            keccak256(abi.encodePacked(message.data))
        ));
    }
}
