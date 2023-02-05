import { ethers } from "hardhat";

async function main() {
  console.log('deploying MyERC721 contract')
  const ERC721 = await ethers.getContractFactory("MyERC721");
  const erc721 = await ERC721.deploy();
  await erc721.deployed();

  console.log(`erc721 contract is deployed to ${erc721.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
