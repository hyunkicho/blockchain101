import { ethers } from "hardhat";
const contractAddress = process.env.ERC721A!;
const price = 0.001;

async function mint(amount: number) {
  console.log('mint from ERC721A contract')
  const Erc721A = await ethers.getContractFactory("MyERC721A");
  const erc721A = await Erc721A.attach(contractAddress);
  const mint = await erc721A.mint(amount, {value: ethers.utils.parseEther((price*amount).toString())});
  console.log('mint :', mint);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const amount = 3;
mint(amount).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
