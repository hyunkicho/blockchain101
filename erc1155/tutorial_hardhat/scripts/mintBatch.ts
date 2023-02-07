import { ethers } from "hardhat";
const contractAddress = process.env.ERC1155!;
async function mint(to: string, id: Array<number>, amount: Array<number>) {
  console.log('mint from erc1155 contract')
  const Erc1155 = await ethers.getContractFactory("MyERC1155");
  const erc1155 = await Erc1155.attach(contractAddress);
  const mint = await erc1155.mintBatch(to,id,amount,'0x');
  console.log('mint :', mint);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const ids = [0,1,2];
const amounts = [10,11,12];
mint(process.env.PUBLIC_KEY!, ids, amounts).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
