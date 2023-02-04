/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

chai.use(solidity);

const name = 'ExampleToken';
const symbol = 'ET';
const decimals = 18;

function changeToBigInt(amount: number) {
  const answerBigint = ethers.utils.parseUnits(amount.toString(), decimals);
  return answerBigint;
}

describe('Start Example ERC20 test', async () => {
  // contracts
  let exampleERC20: Contract;
  //signers
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let amount: number;

  it('Set data for exampleERC20 test', async () => {
    amount = 100000;
    [owner, addr1, addr2] = await ethers.getSigners(); // get a test address
  });

  describe('Test Transfer exampleERC20', () => {
    it('Should get correct MetaData for the Example ERC20 Contract', async () => {
      await expect(exampleERC20.mint(addr1.address, changeToBigInt(amount)))
        .to.emit(exampleERC20, 'Transfer')
        .withArgs(ethers.constants.AddressZero, addr1.address, changeToBigInt(amount));
      expect(await exampleERC20.totalSupply()).to.equal(changeToBigInt(amount));
      expect(await exampleERC20.balanceOf(addr1.address)).to.equal(changeToBigInt(amount));
    });
  });

  describe('Test Approval exampleERC20', () => {
    it('should get approved for the Example ERC20 Contract', async () => {
      await expect(exampleERC20.connect(addr1).approve(addr2.address, changeToBigInt(amount)))
        .to.emit(exampleERC20, 'Approval')
        .withArgs(addr1.address, addr2.address, changeToBigInt(amount));
      expect(await exampleERC20.allowance(addr1.address, addr2.address)).to.equal(changeToBigInt(amount));
    });
  });

  describe('Test TransferFrom ExampleERC20', () => {
    it('Example ERC20 Contract should have erc20 token after TransferFrom', async () => {
      await expect(exampleERC20.connect(addr2).transferFrom(addr1.address, owner.address, changeToBigInt(amount)))
        .to.emit(exampleERC20, 'Transfer')
        .withArgs(addr1.address, owner.address, changeToBigInt(amount));
      expect(await exampleERC20.balanceOf(owner.address)).to.equal(changeToBigInt(amount));
    });
  });

  describe('Test burn exampleERC20', () => {
    it('Example ERC20 Contract should burn erc20 token clearly', async () => {
      await expect(exampleERC20.connect(owner).burn(changeToBigInt(amount)))
        .to.emit(exampleERC20, 'Transfer')
        .withArgs(owner.address, ethers.constants.AddressZero, changeToBigInt(amount));
      expect(await exampleERC20.balanceOf(owner.address)).to.equal(0);
    });

    it('should revert when over burned', async () => {
      await expect(exampleERC20.connect(owner).burn(changeToBigInt(amount)))
        .rejectedWith("ERC20: burn amount exceeds balance")
    });
  });
});