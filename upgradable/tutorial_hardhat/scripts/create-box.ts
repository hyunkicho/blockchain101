// scripts/create-box.js
import { ethers, upgrades } from "hardhat";

async function main() {
  const Box = await ethers.getContractFactory("Box");
  const box = await upgrades.deployProxy(Box, [42], {initializer: 'store'});
  await box.deployed();
  console.log("Box deployed to:", box.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
