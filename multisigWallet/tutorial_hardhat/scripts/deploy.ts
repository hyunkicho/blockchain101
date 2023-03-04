import { ethers } from "hardhat";

async function main() {
  console.log('deploying MyERC20 contract')
  const ERC20 = await ethers.getContractFactory("MyERC20");
  const exampleERC20 = await ERC20.deploy();
  await exampleERC20.deployed();

  console.log(`erc20 contract is deployed to ${exampleERC20.address}`);

  const owners = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  ]
  console.log('deploying multisig contract')
  const Multisig = await ethers.getContractFactory("MultiSigWallet");
  const multisig = await Multisig.deploy(owners,2);
  await multisig.deployed();
  console.log(`multisig contract is deployed to ${multisig.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
