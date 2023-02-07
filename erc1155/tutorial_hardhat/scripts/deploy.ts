import { ethers } from "hardhat";

async function main() {
  console.log('deploying MyERC1155 contract')
  const ERC721 = await ethers.getContractFactory("MyERC1155");
  const erc721 = await ERC721.deploy();
  await erc721.deployed();

  console.log(`erc1155 contract is deployed to ${erc1155.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
