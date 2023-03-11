import { ethers } from "hardhat";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
const contractAddress = "0x2eeca89f2c89E1735a4CAEEAD7111eb2443ba9c9";

async function attack() {
  const accounts = await ethers.getSigners();
  let eve:SignerWithAddress = accounts[2];
  console.log(contractAddress)
  const Attack = await ethers.getContractFactory("Attack2");
  const attack = await Attack.attach(contractAddress);
  const res = attack.connect(eve).attack({value: (1*(10**18)).toString()})
  console.log(res)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
attack().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
