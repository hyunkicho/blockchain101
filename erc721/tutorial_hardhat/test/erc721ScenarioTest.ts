/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
// import chai from 'chai';
// import { solidity } from 'ethereum-waffle';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

// chai.use(solidity);
// const tokenURI = 'https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc721/metadata/';

describe('Start Example ERC721 Scenario test', async () => {
  let exampleERC721: Contract;
  //signers
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  async function ERC721Fixture() {
      // contracts
    // Contracts are deployed using the first signer/account by default
    [owner, addr1, addr2] = await ethers.getSigners(); // get a test address

    const Erc721 = await ethers.getContractFactory("MyERC721");
    const exampleERC721 = await Erc721.deploy();

    return { exampleERC721, owner, addr1, addr2 };
  }

  it('Should get transfer correctly for the Example ERC721 Contract', async () => {
      const { exampleERC721, owner, addr1, addr2 } = await loadFixture(ERC721Fixture);
      await exampleERC721.mint(addr1.address);
      expect(await exampleERC721.ownerOf(1)).to.equal(addr1.address);
  });

  it('Example ERC721 Contract should burn and mint erc721 token clearly', async () => {
      const { exampleERC721, owner, addr1, addr2 } = await loadFixture(ERC721Fixture);
      await exampleERC721.mint(owner.address);
      expect(await exampleERC721.ownerOf(1)).to.equal(owner.address);
      await exampleERC721.burn(1);
      await exampleERC721.burn(0);
      await exampleERC721.mint(addr1.address);
      expect(await exampleERC721.ownerOf(2)).to.equal(addr1.address);
  });

  it('Example ERC721 Contract should burn and mint erc721 token clearly 2', async () => {
      const { exampleERC721, owner, addr1, addr2 } = await loadFixture(ERC721Fixture);
      await exampleERC721.mint(addr1.address);
      expect(await exampleERC721.ownerOf(1)).to.equal(addr1.address);
      await exampleERC721.connect(addr1).burn(1);
      await exampleERC721.burn(0);
      await exampleERC721.mint(addr2.address);
      expect(await exampleERC721.ownerOf(2)).to.equal(addr2.address);
  });
});
