// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.13;

// // These files are dynamically created at test time
// import "truffle/Assert.sol";
// import "truffle/DeployedAddresses.sol";
// import "../contracts/VendingMachine.sol";

// contract TestVendingMachine {

//   VendingMachine vm = VendingMachine(DeployedAddresses.VendingMachine());
//   address vmAddress = DeployedAddresses.VendingMachine();

//   function testInitialBalanceUsingDeployedContract() public {
//     uint expected = 100;

//     Assert.equal(vm.cupcakeBalances(vmAddress), expected, "contract should have 100 cupcake initially");
//   }

// }
