import { ethers } from "hardhat";
const contractAddress = process.env.ERC1155!;
const account = process.env.PUBLIC_KEY!;

async function getBalance(contractAddress: string, id: string) {
  console.log('get token uri from erc1155 contract')
  const Erc1155 = await ethers.getContractFactory("MyERC1155");
  const erc1155 = await Erc1155.attach(contractAddress);
  const uri = await erc1155.uri(id); //each NFT Series has id instead of CA
  console.log(`ur id ${id} : ${uri}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getBalance(contractAddress, '0').catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
