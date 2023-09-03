import { ethers } from "hardhat";
const contractAddress = "0xb8115C366655D0110EAf08601e9EFa6A171fFdCb";

async function attack() {
  console.log('getBalance from attack contract')
  const Attack = await ethers.getContractFactory("Attack");
  const attack = await Attack.attach(contractAddress);
  console.log("attacker balance: ", await ethers.provider.getBalance(attack.address))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
attack().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
