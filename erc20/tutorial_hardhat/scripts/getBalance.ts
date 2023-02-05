import { ethers } from "hardhat";
const contractAddress = process.env.ERC20!;
const account = process.env.PUBLIC_KEY!;

async function getBalance(contractAddress: string, account: string) {
  console.log(contractAddress)
  console.log(account)
  console.log('getBalance from erc20 contract')
  const Erc20 = await ethers.getContractFactory("MyERC20");
  const erc20 = await Erc20.attach(contractAddress);
  const balance = await erc20.balanceOf(account);
  console.log(`Balance of ${account} is ${balance}`)
  console.log(`Balance of ${account} is ${ethers.utils.parseUnits(balance.toString(),"ether")}`)
  console.log(`Balance of ${account} is ${ethers.utils.formatEther(balance.toString())}`)
  console.log(`Balance of ${account} is ${ethers.utils.formatUnits(balance.toString(),18)}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getBalance(contractAddress, account).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
