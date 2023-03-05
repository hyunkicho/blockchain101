import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("etherStore", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function VendingMachineFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, alice, bob, eve] = await ethers.getSigners();

    const EtherStore = await ethers.getContractFactory("EtherStore");
    const etherStore = await EtherStore.deploy();
    const Attack = await ethers.getContractFactory("Attack");
    const attack = await Attack.deploy(etherStore.address);

    return { etherStore, attack, owner, alice, bob, eve };
  }

  describe("etherStore", function () {
    it("Deposit 1 Ether each from Account 1 (Alice) and Account 2 (Bob) into etherStore", async function () {
      const { etherStore, alice, bob } = await loadFixture(VendingMachineFixture);
      await etherStore.connect(alice).deposit({value: (1*(10**18)).toString()});
      await etherStore.connect(bob).deposit({value: (1*(10**18)).toString()});
    });

    it("Call Attack.attack sending 1 ether (using Account 3 (Eve))", async function () {
      const { attack, eve } = await loadFixture(VendingMachineFixture);
      console.log("before sending1 eth : ", await attack.getBalance​​());
      attack.connect(eve).attack({value: 10**18})
      console.log("after sending1 eth : ", await attack.getBalance​​());
    });
  });
});
