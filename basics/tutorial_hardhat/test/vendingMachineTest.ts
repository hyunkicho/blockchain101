import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { VendingMachine } from '../typechain-types/VendigMachine.sol/VendingMachine';

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const VendingMachine = await ethers.getContractFactory("VendingMachine");
    const vendingMachine = await VendingMachine.deploy();

    return { vendingMachine, owner, otherAccount };
  }

  describe("VendingMachine", function () {
    it("should make 100 cupcake at constructor", async function () {
      const { vendingMachine } = await loadFixture(deployOneYearLockFixture);
      expect((await vendingMachine.cupcakeBalances(vendingMachine.address)).toNumber()).to.equal(100);
    });

    it("should send cupcakes correctly after purchase", async function () {
      const { vendingMachine, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);
      const accountTwoStartingBalance = (await vendingMachine.cupcakeBalances(otherAccount.address)).toNumber();
      const amount = 10;
      await expect(vendingMachine.connect(otherAccount).purchase(amount, { value: (amount*10**18).toString() }))
      .to.emit(vendingMachine, "Purchase")
      .withArgs(otherAccount.address,amount)
      
      const accountTwoEndingBalance = ((await vendingMachine.cupcakeBalances(otherAccount.address)).toNumber());
      expect(accountTwoEndingBalance).to.equal(
        accountTwoStartingBalance+amount
      );
    });

    it("should refill cupcakes correctly", async function () {
      const { vendingMachine, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);
      const amount : number = 10;
      await vendingMachine.connect(owner).refill(amount);
      expect(await (await vendingMachine.cupcakeBalances(vendingMachine.address)).toNumber()).to.equal(110);
    });
  });

  // describe("Events", function () {
  //   it("Should emit an event on withdrawals", async function () {
  //     const { lock, unlockTime, lockedAmount } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  //     await time.increaseTo(unlockTime);

  //     await expect(lock.withdraw())
  //       .to.emit(lock, "Withdrawal")
  //       .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //   });
  // });
});
