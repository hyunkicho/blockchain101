import { ethers } from "hardhat";
const contractAddress = process.env.ERC721A!;

async function getTokenURI(contractAddress: string, id: number) {
  console.log('get token uri from MyERC721A contract')
  const ERC721A = await ethers.getContractFactory("MyERC721A");
  const erc721A = await ERC721A.attach(contractAddress);
  const uri = await erc721A.tokenURI(id); //each NFT Series has id instead of CA
  console.log(`ur id ${id} : ${uri}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getTokenURI(contractAddress, 0).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
