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

describe('Start Example AccessControl test', async () => {
  // contracts
  let accessControl: Contract;
  //signers
  let owner: SignerWithAddress;
  let newOwner: SignerWithAddress;

  it('Set data for AccessControl test', async () => {
    [owner, newOwner] = await ethers.getSigners(); // get a test address
    console.log(`${owner} is owner`)
  });

  describe('Test AccessControl Metadata', () => {
    it('Should deploy Ownable Contract correctly', async () => {
      const AccessControlTestFactory = await ethers.getContractFactory('AccessControlTest');
      accessControl = await AccessControlTestFactory.deploy();
      await accessControl.deployed();
    });
  });

  describe('Test transferOwnership', () => {
    it('Should  transferOwnership corrrectly for the Example Ownable Contract', async () => {
      // Define a custom role
      // const DEFAULT_ADMIN_ROLE = ethers.utils.id("DEFAULT_ADMIN_ROLE");
      const isAdmin = await accessControl.hasRole(await accessControl.DEFAULT_ADMIN_ROLE(), owner.address);
      expect(isAdmin).to.be.true;
    });
  })

  // describe('Test acceptOwnership', () => {
  //   it('Should  acceptOwnership corrrectly for the Example Ownable Contract', async () => {
  //     expect(await AccessControlTest.connect(newOwner).acceptOwnership())
  //       .to.emit(AccessControlTest, 'OwnershipTransferred')
  //       .withArgs(owner.address, newOwner.address);
  //       expect(await AccessControlTest.owner()).to.equal(newOwner.address);
  //     });
  // })
})
