import { ethers } from "hardhat";
const contractAddress = process.env.ERC721!;
async function transfer​​(from: string, to: string, tokenId: number) {
  console.log('transfer from ER721 contract')
  const Er721 = await ethers.getContractFactory("MyERC721");
  const er721 = await Er721.attach(contractAddress);
  const transfer = await er721.transferFrom(from, to, tokenId.toString());
  console.log('transfer :', transfer);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const tokenId = 1
transfer​​(process.env.PUBLIC_KEY!, process.env.TEST_PUBLIC_KEY!, tokenId).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
