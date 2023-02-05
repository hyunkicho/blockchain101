import { ethers } from "hardhat";
const contractAddress = process.env.ERC721!;
const account = process.env.PUBLIC_KEY!;

async function getBalance(contractAddress: string, account: string) {
  console.log(contractAddress)
  console.log(account)
  console.log('getBalance from erc721 contract')
  const Erc721 = await ethers.getContractFactory("MyERC721");
  const erc721 = await Erc721.attach(contractAddress);
  const balance = await erc721.balanceOf(account);
  console.log(`Balance of ${account} is ${balance}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getBalance(contractAddress, account).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
