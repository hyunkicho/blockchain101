import { ethers } from "hardhat";
const contractAddress = process.env.ERC20!;
async function transfer(to: string, amount: number) {
  console.log('transfer from ERC20 contract')
  const Erc20 = await ethers.getContractFactory("MyERC20");
  const erc20 = await Erc20.attach(contractAddress);
  const transfer = await erc20.transfer(to, ethers.utils.parseUnits(amount.toString(),18));
  console.log('transfer :', transfer);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const amount = 1
transfer(process.env.PUBLIC_KEY!, amount).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
