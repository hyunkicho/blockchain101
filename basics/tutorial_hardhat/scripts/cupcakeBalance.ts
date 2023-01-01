import { ethers } from "hardhat";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

async function getBalance(contractAddress: string, account: string) {
  console.log('getBalance from vendingMachine contract')
  const VendingMachine = await ethers.getContractFactory("VendingMachine");
  const vendingMachine = await VendingMachine.attach(contractAddress);
  const balance = await vendingMachine.cupcakeBalances(account);
  console.log('cupcakeBalances :', balance);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getBalance(contractAddress,account).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
