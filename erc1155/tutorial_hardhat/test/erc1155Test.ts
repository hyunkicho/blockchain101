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

describe('Start Example ERC1155 test', async () => {
  // contracts
  let exampleERC1155: Contract;
  //signers
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  it('Set data for exampleERC1155 test', async () => {
    [owner, addr1, addr2] = await ethers.getSigners(); // get a test address
  });

  describe('Test Example ERC1155 Metadata', () => {
    it('Should deploy ERC1155 Contract correctly', async () => {
      const ExampleERC1155Factory = await ethers.getContractFactory('MyERC1155');
      exampleERC1155 = await ExampleERC1155Factory.deploy();
      await exampleERC1155.deployed();
    });
  });

  describe('Test Mint exampleERC1155', () => {
    it('Should  Mint corrrectly for the Example ERC1155 Contract', async () => {
      expect(await exampleERC1155.mint(addr1.address,1,10,'0x'))
        .to.emit(exampleERC1155, 'TransferSingle')
        .withArgs(owner, ethers.constants.AddressZero, addr1.address, 1, 10);
      expect(await exampleERC1155.balanceOf(addr1.address,1)).to.equal('10');
    });
  });

  describe('Test setApprovalForAll exampleERC1155', () => {
    it('should get setApprovalForAll for the Example ERC1155 Contract', async () => {
      expect(await exampleERC1155.setApprovalForAll(addr2.address, true))
        .to.emit(exampleERC1155, 'ApprovalForAll')
        .withArgs(owner.address, addr2.address, true);
      expect(await exampleERC1155.isApprovedForAll(owner.address, addr2.address)).to.be.true;
    });
  });

  describe('Test safeTransferFrom ExampleERC1155', async () => {
    it('Example ERC1155 Contract should have erc1155 token after safeTransferFrom', async () => {
      expect(await exampleERC1155.connect(addr2).safeTransferFrom(owner.address, addr1.address, 0, 5, '0x'))
        .to.emit(exampleERC1155, 'TransferSingle')
        .withArgs(addr2.address, owner.address, addr1.address, '1', '5');
      expect(await exampleERC1155.balanceOf(addr1.address,0)).to.equal('5');
    });
  });
});