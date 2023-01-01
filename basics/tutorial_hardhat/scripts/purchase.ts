import { ethers } from "hardhat";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function purchase​​(amount: number) {
  console.log('purchase​​ from vendingMachine contract')
  const VendingMachine = await ethers.getContractFactory("VendingMachine");
  const vendingMachine = await VendingMachine.attach(contractAddress);
  const purchase = await vendingMachine.purchase(amount, {value: (amount*(10**18)).toString()});
  console.log('purchase :', purchase);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
purchase​​(10).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
