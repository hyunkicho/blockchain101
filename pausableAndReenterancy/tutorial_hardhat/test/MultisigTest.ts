/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
// import chai from 'chai';
// import { solidity } from 'ethereum-waffle';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

// chai.use(solidity);
const decimals = 18;
// const tokenURI = 'https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc721/metadata/';
function changeToBigInt(amount: number) {
  const answerBigint = ethers.utils.parseUnits(amount.toString(), decimals);
  return answerBigint;
}

function toBN(amount: number) {
  return ethers.BigNumber.from(amount.toString()).toString();
}

describe('Start Example ERC721 Governor test', async () => {
  // contracts
  let exampleERC20: Contract;
  let multisig: Contract;
  //signers
  let owner: SignerWithAddress;
  let signer1: SignerWithAddress;
  let teamAddr: SignerWithAddress;
  let transactionIds: number;
  let transferCalldata: string;
  const grantAmount = 100;

  it('Set data for Multisig wallet test', async () => {
    [owner, signer1, teamAddr] = await ethers.getSigners(); // get a test address
  });

  describe('Test Example MultisigContract deployment', () => {
    it('Should deploy correctly and get inital setting correct', async () => {
      console.log('deploying MyERC20 contract')
      const ERC20 = await ethers.getContractFactory("MyERC20");
      exampleERC20 = await ERC20.deploy();
      await exampleERC20.deployed();
    
      console.log(`erc20 contract is deployed to ${exampleERC20.address}`);
    
      const owners = [
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
      ]

      const Multisig = await ethers.getContractFactory("MultiSigWallet");
      multisig = await Multisig.deploy(owners,2);
      await multisig.deployed();
      console.log(`multisig contract is deployed to ${multisig.address}`);

      console.log('get owners : ' ,await multisig.getOwners())
    });

    it('step 01) submitTransaction', async () => {
      let currentBlockNumber = await ethers.provider.getBlockNumber();
      console.log("proposal currentBlockNumber is : ", currentBlockNumber);
      const erc20Token = await ethers.getContractAt("MyERC20", exampleERC20.address);
      console.log("exampleERC20.address : " , exampleERC20.address);

      
      //set Proposal to send token
      let teamAddress = teamAddr.address;
      console.log("team address :", teamAddress)
      await exampleERC20.mint(multisig.address, changeToBigInt(grantAmount))
      transferCalldata = erc20Token.interface.encodeFunctionData("transfer", [teamAddress, changeToBigInt(grantAmount)]);
      console.log("transferCalldata :", transferCalldata)

      await multisig.submitTransaction(
        exampleERC20.address,
        0,
        transferCalldata,
      )
      expect(toBN(await multisig.getTransactionCount(true,false))).to.equal(toBN(1))
    });

    it('step 02) get transaction ids', async () => {  
      transactionIds = await multisig.getTransactionIds(0,1,true,false)
      expect(toBN(transactionIds)).to.equal(toBN(0))
      console.log("transactionIds is ", transactionIds)
    });

    it('step 03) should check confirmTransactions and check execution', async () => {
      //internal function should be checked with internal events
      expect(await multisig.connect(signer1).confirmTransaction(0))
      .to.emit(multisig, 'Confirmation')
      .withArgs(owner.address, 0)
      .to.emit(multisig, 'Execution')
      .withArgs(0)
      .to.emit(exampleERC20, 'Transfer')
      .withArgs(multisig.address, teamAddr.address, changeToBigInt(grantAmount));
    });
  });

});