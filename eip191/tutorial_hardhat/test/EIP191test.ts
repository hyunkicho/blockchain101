/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('Start Example EIP191 test', async () => {
  // contracts
  let EIP191: Contract;
  //signers
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;
  let address2: SignerWithAddress;

  it('Set data for test', async () => {
    [owner, address1, address2] = await ethers.getSigners(); // get a test address
 
    console.log(`owner address is ${owner.address}`)
    console.log(`address1 address is ${address1.address}`)
    console.log(`address2 address is ${address2.address}`)
  });

  describe('Test Example EIP191 deployment', () => {
    it('Should get correct name, symbol, decimal for the Example ERC721 Contract', async () => {
      let _EIP191 = await ethers.getContractFactory("EIP191");
      EIP191 = await _EIP191.deploy();
      await EIP191.deployed();
      console.log(`${EIP191.address} is EIP191 contract address`)
    });

    it('step 01) make signature and verify', async () => {
      //1 - 원본 메세지 가져오기
      const signingTEXT = "I agree with using this homepage";
      //2 - 원본 메세지에 대한 해시값 만들기
      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signingTEXT));
      //3 - 해시값에 대한 서명값 만들기
      const signed191Signature = owner.signMessage(ethers.utils.arrayify(hash));
      //4 - 서명값이랑, 서명한 주소, 서명한 원본 메세지를 통해서 해당 주소가 해당 메세지를 서명한 것이 맞는지 검증
      const signatureIsValid = await EIP191.verifySignature(owner.address, signingTEXT, signed191Signature);
      console.log("signatureIsValid is : ", signatureIsValid);

      expect(signatureIsValid).to.be.true;
    })
  })
})