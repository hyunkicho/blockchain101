/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import chai from 'chai';
// import { solidity } from 'ethereum-waffle';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

// chai.use(solidity);



describe('Start Example ERC4626 test', async () => {
  // contracts
  let exampleERC20: Contract;
  let exampleERC4626: Contract;
  //signers
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let amount: number;
  let decimals: number;
  async function ERC4626Fixture() {
    [owner, addr1, addr2] = await ethers.getSigners(); // get a test address

    const ExampleERC20Factory = await ethers.getContractFactory('MyERC20');
    exampleERC20 = await ExampleERC20Factory.deploy();
    await exampleERC20.deployed();
    const asset = exampleERC20.address
    const decimal = await exampleERC20.decimals();
    const ExampleERC4626Factory = await ethers.getContractFactory('MyERC4626');
    exampleERC4626 = await ExampleERC4626Factory.deploy(asset);
    function changeToEthers(amount: number) {
      const answerEthers = ethers.utils.parseUnits(amount.toString(), decimals);
      return answerEthers;
    }
    await exampleERC20.mint(addr1.address,changeToEthers(100))
    await exampleERC20.connect(addr1).approve(exampleERC4626.address,changeToEthers(100))
    console.log("addr1 balance :", await exampleERC20.balanceOf(addr1.address));
    console.log(changeToEthers(100))
    return { exampleERC20, asset, decimal, exampleERC4626, owner, addr1, addr2, changeToEthers };
  }

  it('Set data for MyERC4626 test', async () => {
    amount = 10;
  });

  describe('Test deploying', () => {
    it('Should deploy correctly', async () => {
      const { exampleERC20, asset, decimal, exampleERC4626, owner, addr1, addr2, changeToEthers } = await loadFixture(ERC4626Fixture);
      await exampleERC4626.deployed();
      expect(await exampleERC4626.asset()).to.equal(asset);
      expect(await exampleERC4626.decimals()).to.equal(decimal);
    });
  });

  describe('Test deposit exampleERC4626', () => {
    it('Should deposit correctly for the Example ERC4626 Contract', async () => {
      const { exampleERC20, asset, decimal, exampleERC4626, owner, addr1, addr2, changeToEthers } = await loadFixture(ERC4626Fixture);
      const shares = await exampleERC4626.previewDeposit(changeToEthers(amount));
      await expect(exampleERC4626.connect(addr1).deposit(changeToEthers(amount), addr1.address))
        .to.emit(exampleERC4626, 'Deposit')
        .withArgs(addr1.address, addr1.address, changeToEthers(amount), shares);
      });
  });

  describe('Check max deposit and mint exampleERC4626', () => {
    it('Should max mint correctly for the Example ERC4626 Contract', async () => {
      const { exampleERC20, asset, decimal, exampleERC4626, owner, addr1, addr2, changeToEthers } = await loadFixture(ERC4626Fixture);
      const maxDeposit = await exampleERC4626.maxDeposit(asset)
      console.log("maxDeposit value is : ", maxDeposit);
    })
  });

  describe('Check max withdraw & reddem exampleERC4626', () => {
      it('Should get max withdraw & redeem correctly for the Example ERC4626 Contract', async () => {
        const { exampleERC20, asset, decimal, exampleERC4626, owner, addr1, addr2, changeToEthers } = await loadFixture(ERC4626Fixture);
        
        let maxWithdraw = await exampleERC4626.maxWithdraw(addr1.address)
        console.log("maxWithdraw value is : ", maxWithdraw);
        
        let maxRedeem = await exampleERC4626.maxWithdraw(addr1.address)
        console.log("maxRedeem value is : ", maxRedeem);

        const shares = await exampleERC4626.previewDeposit(changeToEthers(amount));
        
        await expect(exampleERC4626.connect(addr1).deposit(changeToEthers(amount), addr1.address))
        .to.emit(exampleERC4626, 'Deposit')
          .withArgs(addr1.address, addr1.address, changeToEthers(amount), shares);

        maxWithdraw = expect(await exampleERC4626.maxWithdraw(addr1.address))
        .to.equal(changeToEthers(amount))
    
        maxRedeem = expect(await exampleERC4626.maxRedeem(addr1.address))
        .to.equal(changeToEthers(amount))
      });
    })

    describe('Check max withdraw exampleERC4626', () => {
      it('Should get max withdraw correctly for the Example ERC4626 Contract', async () => {
        const { exampleERC20, asset, decimal, exampleERC4626, owner, addr1, addr2, changeToEthers } = await loadFixture(ERC4626Fixture);
        console.log("erc20 balance before : " ,await exampleERC20.balanceOf(addr1.address));

        await exampleERC4626.connect(addr1).deposit(changeToEthers(amount), addr1.address);
        console.log("erc20 balance after deposit : " ,await exampleERC20.balanceOf(addr1.address));

        let maxWithdraw = await exampleERC4626.maxWithdraw(addr1.address)
        console.log("maxWithdraw value is : ", maxWithdraw);
    
        let maxRedeem = await exampleERC4626.maxRedeem(addr1.address)
        console.log("maxRedeem value is : ", maxRedeem);

        await exampleERC4626.connect(addr1).withdraw(changeToEthers(amount), addr1.address, addr1.address);

        maxWithdraw = expect(await exampleERC4626.maxWithdraw(addr1.address))
        .to.equal('0')
    
        maxRedeem = expect(await exampleERC4626.maxRedeem(addr1.address))
        .to.equal('0')

        console.log("erc20 balance after withdraw: " ,await exampleERC20.balanceOf(addr1.address));
      });
    })
  });
