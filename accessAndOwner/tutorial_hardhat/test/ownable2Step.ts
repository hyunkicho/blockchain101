/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
// import chai from 'chai';
// import { solidity } from 'ethereum-waffle';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

// chai.use(solidity);
// const tokenURI = 'https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc1155/metadata/';

describe('Start Example Ownable 2Step test', async () => {
  // contracts
  let ownableTest: Contract;
  //signers
  let owner: SignerWithAddress;
  let newOwner: SignerWithAddress;

  it('Set data for Ownable 2Step test', async () => {
    [owner, newOwner] = await ethers.getSigners(); // get a test address
  });

  describe('Test Ownable 2Step', () => {
    it('Should deploy Ownable Contract correctly', async () => {
      const OwnableTestFactory = await ethers.getContractFactory('Ownable2StepTest');
      ownableTest = await OwnableTestFactory.deploy();
      await ownableTest.deployed();

      expect(await ownableTest.owner()).to.equal(owner.address);
    });
  });

  describe('Test transferOwnership', () => {
    it('Should  transferOwnership corrrectly for the Example Ownable Contract', async () => {
      expect(await ownableTest.transferOwnership(newOwner.address))
        .to.emit(ownableTest, 'OwnershipTransferred')
        .withArgs(owner.address, newOwner.address);
      expect(await ownableTest.owner()).to.equal(owner.address);
      expect(await ownableTest.pendingOwner()).to.equal(newOwner.address);
    });
  })

  describe('Test acceptOwnership', () => {
    it('Should  acceptOwnership corrrectly for the Example Ownable Contract', async () => {
      expect(await ownableTest.connect(newOwner).acceptOwnership())
        .to.emit(ownableTest, 'OwnershipTransferred')
        .withArgs(owner.address, newOwner.address);
        expect(await ownableTest.owner()).to.equal(newOwner.address);
      });
  })
})
