import { ethers } from "hardhat";
const contractAddress = process.env.ERC721!;
async function mint(to: string, tokenId: number) {
  console.log('mint from ERC721 contract')
  const Erc721 = await ethers.getContractFactory("MyERC721");
  const erc721 = await Erc721.attach(contractAddress);
  const mint = await erc721.mint(to);
  console.log('mint :', mint);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const tokenId = 1;
mint(process.env.PUBLIC_KEY!, tokenId).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
