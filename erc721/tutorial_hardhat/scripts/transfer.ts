import { ethers } from "hardhat";
const contractAddress = process.env.ER721!;
async function transfer​​(to: string, tokenId: number) {
  console.log('transfer from ER721 contract')
  const Er721 = await ethers.getContractFactory("MyER721");
  const er721 = await Er721.attach(contractAddress);
  const mint = await er721.transfer(to, tokenId.toString());
  console.log('mint :', mint);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const tokenId = 1
transfer​​(process.env.TEST_PUBLIC_KEY!, tokenId).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
