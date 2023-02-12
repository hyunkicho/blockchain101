import { ethers } from "hardhat";
const contractAddress = process.env.ERC1155!;
const account = process.env.PUBLIC_KEY!;

async function getBalance(contractAddress: string, account: string, id: string) {
  console.log('getBalance from erc1155 contract')
  const Erc1155 = await ethers.getContractFactory("MyERC1155");
  const erc1155 = await Erc1155.attach(contractAddress);
  const balance = await erc1155.balanceOf(account, id); //each NFT Series has id instead of CA
  console.log(`NFT id ${id} : Balance of ${account} is ${balance}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getBalance(contractAddress, account, '1').catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
