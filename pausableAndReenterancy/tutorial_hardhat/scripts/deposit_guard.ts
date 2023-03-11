import { ethers } from "hardhat";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { EtherStore } from '../typechain-types/contracts/EtherStore.sol/EtherStore';
import { Contract } from 'ethers';

async function main() {
  const accounts = await ethers.getSigners();
  let alice:SignerWithAddress = accounts[0];
  let bob:SignerWithAddress = accounts[1];
  let eve:SignerWithAddress = accounts[2];
  let etherStore:Contract;
  let attack:Contract;

  const EtherStore = await ethers.getContractFactory("EtherStoreGuard");
  etherStore = await EtherStore.deploy();
  const Attack = await ethers.getContractFactory("Attack2");
  attack = await Attack.deploy(etherStore.address);
  console.log("etherStore address : ", etherStore.address)
  console.log("attack address : ", attack.address)
  await etherStore.connect(alice).deposit({value: (1*(10**18)).toString()});

  await etherStore.connect(bob).deposit({value: (1*(10**18)).toString()});
  console.log("etherStore balance : ", await ethers.provider.getBalance(etherStore.address))
  console.log("before sending1 eth : ", await attack.getBalance());
  console.log("before sending1 eth attack: ", await ethers.provider.getBalance(attack.address))
  console.log("before sending1 eth eve : ", await ethers.provider.getBalance(eve.address))
  console.log("etherStore balance etherStore: ", await ethers.provider.getBalance(etherStore.address))

  attack.connect(eve).attack({value: (1*(10**18)).toString()})
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
