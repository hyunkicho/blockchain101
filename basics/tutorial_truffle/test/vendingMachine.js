const VendingMachine = artifacts.require("VendingMachine");

contract('VendingMachine', async (accounts) => {
  const accountOne = accounts[0];
  const accountTwo = accounts[1];

  it('should make 100 cupcake at constructor', async () => {
    const vendingMachineInstance = await VendingMachine.deployed();
    const balance = await vendingMachineInstance.cupcakeBalances.call(vendingMachineInstance.address);
    assert.equal(balance.valueOf(), 100, "should make 100 cupcake at vending machine first");
  });

  it('should send cupcakes correctly', async () => {
    const vendingMachineInstance = await VendingMachine.deployed();
    const accountTwoStartingBalance = (await vendingMachineInstance.cupcakeBalances.call(accountTwo)).toNumber();

    const amount = 10;
    await vendingMachineInstance.purchase(amount, { from: accountTwo, value: 10*10**18 });

    const accountTwoEndingBalance = (await vendingMachineInstance.cupcakeBalances.call(accountTwo)).toNumber();
    console.log("accountTwoEndingBalance >>", accountTwoEndingBalance)
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Cupcakes wasn't correctly sent to the receiver");
  });

  it('should refill cupcakes correctly', async () => {
    const vendingMachineInstance = await VendingMachine.deployed();
    const vendingMahcineStartingBalance = (await vendingMachineInstance.cupcakeBalances.call(vendingMachineInstance.address)).toNumber();
    console.log("vendingMahcineStartingBalance", vendingMahcineStartingBalance)
    const amount = 10;
    await vendingMachineInstance.refill(amount);

    const vendingMahcineEndingBalance = (await vendingMachineInstance.cupcakeBalances.call(vendingMachineInstance.address)).toNumber();
    console.log("vendingMahcineEndingBalance", vendingMahcineEndingBalance)

    assert.equal(vendingMahcineEndingBalance, vendingMahcineStartingBalance + amount, "Cupcakes wasn't refilled correctly");
  });
});
