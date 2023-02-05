import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("VendingMachine", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function VendingMachineFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const VendingMachine = await ethers.getContractFactory("VendingMachine");
    const vendingMachine = await VendingMachine.deploy();

    return { vendingMachine, owner, otherAccount };
  }

  describe("VendingMachine", function () {
    it("should make 100 cupcake at constructor", async function () {
      const { vendingMachine } = await loadFixture(VendingMachineFixture);
      expect((await vendingMachine.cupcakeBalances(vendingMachine.address)).toNumber()).to.equal(100);
    });

    it("should send cupcakes correctly after purchase", async function () {
      const { vendingMachine, owner, otherAccount } = await loadFixture(VendingMachineFixture);
      console.log("vendingMachine cupcakeBalances",await vendingMachine.cupcakeBalances(vendingMachine.address))
      const accountTwoStartingBalance = (await vendingMachine.cupcakeBalances(otherAccount.address)).toNumber();
      console.log("accountTwoStartingBalance >>", accountTwoStartingBalance)
      const amount = 10;
      await expect(vendingMachine.connect(otherAccount).purchase(amount, { value: (amount*10**18).toString() }))
      .to.emit(vendingMachine, "Purchase")
      .withArgs(otherAccount.address,amount)
      const accountTwoEndingBalance = ((await vendingMachine.cupcakeBalances(otherAccount.address)).toNumber());
      console.log("accountTwoEndingBalance >>", accountTwoEndingBalance)
      console.log("vendingMachine cupcakeBalances",await vendingMachine.cupcakeBalances(vendingMachine.address))
      expect(accountTwoEndingBalance).to.equal(
        accountTwoStartingBalance+amount
      );
    });

    it("should refill cupcakes correctly", async function () {
      const { vendingMachine, owner, otherAccount } = await loadFixture(VendingMachineFixture);
      console.log("vendingMachine cupcakeBalances",await vendingMachine.cupcakeBalances(vendingMachine.address))
      const amount : number = 10;
      await vendingMachine.connect(owner).refill(amount);
      console.log("vendingMachine cupcakeBalances",await vendingMachine.cupcakeBalances(vendingMachine.address))
      expect((await vendingMachine.cupcakeBalances(vendingMachine.address)).toNumber()).to.equal(110);
    });
  });
});
