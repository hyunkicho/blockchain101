/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
// import chai from 'chai';
// import { solidity } from 'ethereum-waffle';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

// chai.use(solidity);

const name = 'MyNFT';
const symbol = 'MNFT';
// const tokenURI = 'https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc721/metadata/';

describe('Start Example ERC721 test', async () => {
  // contracts
  let exampleERC721: Contract;
  //signers
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  it('Set data for exampleERC721 test', async () => {
    [owner, addr1, addr2] = await ethers.getSigners(); // get a test address
  });

  describe('Test Example ERC721 Metadata', () => {
    it('Should get correct name, symbol, decimal for the Example ERC721 Contract', async () => {
      const ExampleERC721Factory = await ethers.getContractFactory('MyERC721');
      exampleERC721 = await ExampleERC721Factory.deploy();
      await exampleERC721.deployed();
      expect(await exampleERC721.name()).to.equal(name);
      expect(await exampleERC721.symbol()).to.equal(symbol);
    });
  });

  describe('Test Mint exampleERC721', () => {
    it('Should  Mint corrrectly for the Example ERC721 Contract', async () => {
      expect(await exampleERC721.mint(addr1.address))
        .to.emit(exampleERC721, 'Transfer')
        .withArgs(ethers.constants.AddressZero, addr1.address, '1');
      expect(await exampleERC721.totalSupply()).to.equal('2');
      expect(await exampleERC721.balanceOf(addr1.address)).to.equal('1');
    });
  });

  describe('Test Approval exampleERC721', () => {
    it('should get approved for the Example ERC721 Contract', async () => {
      expect(await exampleERC721.connect(addr1).approve(addr2.address, '1'))
        .to.emit(exampleERC721, 'Approval')
        .withArgs(addr1.address, addr2.address, '1');
      expect(await exampleERC721.getApproved('1')).to.equal(addr2.address);
    });
  });

  describe('Test TransferFrom ExampleERC721', async () => {
    it('Example ERC721 Contract should have erc721 token after TransferFrom', async () => {
      expect(await exampleERC721.connect(addr2).transferFrom(addr1.address, owner.address, '1'))
        .to.emit(exampleERC721, 'Transfer')
        .withArgs(addr1.address, owner.address, '1');
      expect(await exampleERC721.ownerOf(1)).to.equal(owner.address);
    });
  });
});