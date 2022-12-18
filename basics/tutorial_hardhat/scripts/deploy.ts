import { ethers } from "hardhat";

async function main() {
  console.log('deploying coin contract test')
  const Coin = await ethers.getContractFactory("Coin");
  const coin = await Coin.deploy();
  await coin.deployed();

  console.log(`coin contract is deployed to ${coin.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
