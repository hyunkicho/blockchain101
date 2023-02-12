import { ethers } from "hardhat";

async function main() {
  console.log('deploying MyERC20 contract')
  const ERC20 = await ethers.getContractFactory("MyERC20");
  const erc20 = await ERC20.deploy();
  await erc20.deployed();
  
  console.log(`erc20 contract is deployed to ${erc20.address}`);

  const MyERC4626 = await ethers.getContractFactory("MyERC4626");
  const erc4626 = await MyERC4626.deploy(erc20.address);
  await erc4626.deployed();

  console.log(`erc4626 contract is deployed to ${erc4626.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
