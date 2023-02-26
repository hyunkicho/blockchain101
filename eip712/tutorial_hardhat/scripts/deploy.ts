import { ethers } from "hardhat";

async function main() {
  console.log('deploying MyEIP712 contract')
  const EIP712 = await ethers.getContractFactory("MyEIP712");
  const exampleEIP712 = await EIP712.deploy();
  await exampleEIP712.deployed();
  console.log(`${exampleEIP712.address} is MyEIP712 contract address`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
