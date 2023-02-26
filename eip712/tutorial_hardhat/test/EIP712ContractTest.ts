/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
// import chai from 'chai';
// import { solidity } from 'ethereum-waffle';
import { Contract } from 'ethers';
import { keccak256 } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { message } from './struct';

describe('Start Example EIP712 test', async () => {
  // contracts
  let exampleEIP712: Contract;
  //signers
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;
  let address2: SignerWithAddress;
  let hashTypedDataV4Res: string;
  let structHash: string;
  let InfoTest: message;

  it('Set data for MyEIP712 Governor test', async () => {
    [owner, address1, address2] = await ethers.getSigners(); // get a test address
     InfoTest = {
      from: owner.address,
      to: address1.address,
      data: "some data here"
    }
    console.log(`owner address is ${owner.address}`)
    console.log(`address1 address is ${address1.address}`)
    console.log(`address2 address is ${address2.address}`)

  });

  describe('Test Example MyEIP712 Governor deployment', () => {
    it('Should get correct name, symbol, decimal for the Example ERC721 Contract', async () => {

      const EIP712 = await ethers.getContractFactory("MyEIP712");
      exampleEIP712 = await EIP712.deploy();
      await exampleEIP712.deployed();
      console.log(`${exampleEIP712.address} is MyEIP712 contract address`)
    });

    it('step 01) set a struct with contract', async () => {
      const _MESSAGE_TYPEHASH = await exampleEIP712._MESSAGE_TYPEHASH();
      console.log("_MESSAGE_TYPEHASH is : ", _MESSAGE_TYPEHASH)
      const hashStruct = await exampleEIP712.hashStruct(InfoTest);
      console.log("hash sturct is : ", hashStruct)
    })

    it('step 02) check structHash', async () => {

      structHash = await exampleEIP712.hashStruct(InfoTest);
      console.log("hash sturct is : ", structHash)

      hashTypedDataV4Res = await exampleEIP712.hashTypedDataV4(structHash);
      console.log("hashTypedDataV4Res >>", hashTypedDataV4Res)
      // const recover = await exampleEIP712.recoverSig(hashTypedDataV4Res, signature);
      // console.log("recover >>", recover)
    })

    it('step 03) get signature', async () => {      

      const network = await ethers.provider.getNetwork(); 
      const chainId = network.chainId
      
      const msgParams = {
        domain: {
          // Give a user friendly name to the specific contract you are signing for.
          name: "MyEIP712", // 메타마스크에 표시되는 컨트렉트 이름, 예를들어 0000거래소
          // Just let's you know the latest version. Definitely make sure the field name is correct.
          version: "1", // 눈에 보이는 명시하는 버전
          // Defining the chain aka Rinkeby testnet or Ethereum Main Net
          chainId: ethers.BigNumber.from(
            chainId
          ), 
          // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
          verifyingContract: exampleEIP712.address // 사인을 하는 컨트렉트의 주소, 0000거래소의 CA
        },
  
        // Defining the message signing data content.
        message: {
          /*
          - Anything you want. Just a JSON Blob that encodes the data you want to send
          - No required fields
          - This is DApp Specific
          - Be as explicit as possible when building out the message schema.
          */
          from: owner.address,
          to: address1.address,
          data: "some data here"
        },
        // Refers to the keys of the *types* object below.
        primaryType: "Message",
        types: {
          Message: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "data", type: "string" },
          ],
        },
      };

      //메타마스크와 같은 지갑에서 서명
      let signature = await owner._signTypedData(
        msgParams.domain,
        msgParams.types,
        msgParams.message
      );

      console.log("signature is : ", signature)

      const verifiedAddress = ethers.utils.verifyTypedData(
        msgParams.domain,
        msgParams.types,
        msgParams.message,
        signature
        );

      console.log("verifiedAddress from ethers is : ", verifiedAddress)
      expect(verifiedAddress).to.equal(owner.address);

      const recoverSig = await exampleEIP712.validateSigner(structHash, signature)
      console.log("verifiedAddress from contract is : ", recoverSig)
      expect(recoverSig).to.equal(owner.address);
    })
  })
})