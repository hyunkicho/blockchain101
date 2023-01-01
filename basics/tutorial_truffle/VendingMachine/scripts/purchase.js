var account_one = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"; // an address

var vendingMachine;
VendingMachine.deployed().then(function(instance) {
  vendingMachine = instance;
  return vendingMachine.cupcakeBalances.call(account_one, {from: account_one});
}).then(function(balance) {
  // If this callback is called, the call was successfully executed.
  // Note that this returns immediately without any waiting.
  // Let's print the return value.
  console.log(balance.toNumber());
}).catch(function(e) {
  // There was an error! Handle it.
})