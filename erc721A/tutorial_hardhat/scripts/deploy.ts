import { ethers } from "hardhat";

async function main() {
  console.log('deploying MyERC721A contract')
  const ERC721A = await ethers.getContractFactory("MyERC721A");
  const erc721A = await ERC721A.deploy();
  await erc721A.deployed();

  console.log(`erc721A contract is deployed to ${erc721A.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
