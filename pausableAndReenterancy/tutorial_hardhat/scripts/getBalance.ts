import { ethers } from "hardhat";
const contractAddress = "0x39e813A5c0C98066C9c8Ebe1E6a2B23Bf2bE4357";

async function attack() {
  console.log('getBalance from attack contract')
  const Attack = await ethers.getContractFactory("Attack");
  const attack = await Attack.attach(contractAddress);
  const attackres = await attack.attack();
  console.log(attackres)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
attack().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
