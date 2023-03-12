import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { EtherStore } from '../typechain-types/contracts/EtherStore.sol/EtherStore';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe("etherStore", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  let etherStore: Contract;
  let attack: Contract
  let eve: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let owner: SignerWithAddress;

  describe("etherStore", function () {
    it("Deposit 1 Ether each from Account 1 (Alice) and Account 2 (Bob) into etherStore", async function () {
      [owner, alice, bob, eve] = await ethers.getSigners();

      const EtherStore = await ethers.getContractFactory("EtherStore");
      etherStore = await EtherStore.deploy();
      const Attack = await ethers.getContractFactory("Attack");
      attack = await Attack.deploy(etherStore.address);
      await etherStore.connect(alice).deposit({value: (1*(10**18)).toString()});
      await etherStore.connect(bob).deposit({value: (1*(10**18)).toString()});
      console.log("etherStore balance : ", await ethers.provider.getBalance(etherStore.address))
    });

    it("Call Attack.attack sending 1 ether (using Account 3 (Eve))", async function () {
      // console.log("before sending1 eth : ", await attack.getBalance());
      console.log("before sending1 eth attack: ", await ethers.provider.getBalance(attack.address))
      console.log("before sending1 eth eve : ", await ethers.provider.getBalance(eve.address))
      console.log("etherStore balance etherStore: ", await ethers.provider.getBalance(etherStore.address))

      attack.connect(eve).attack({value: (1*(10**18)).toString()})

      //채굴을 해야 이더리움의 제대로 된 업데이트 정보를 알아낼 수 있다.
      await ethers.provider.send("evm_mine", []);

      // console.log("after sending1 eth : ", await attack.getBalance());
      console.log("after sending1 eth : attack ", await ethers.provider.getBalance(attack.address))
      console.log("after sending1 eth : eve ", await ethers.provider.getBalance(eve.address))
      console.log("etherStore balance : etherStore", await ethers.provider.getBalance(etherStore.address))
    });
  });
});
