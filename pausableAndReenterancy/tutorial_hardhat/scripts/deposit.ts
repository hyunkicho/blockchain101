import { ethers } from "hardhat";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { EtherStore } from '../typechain-types/contracts/EtherStore.sol/EtherStore';
import { Attack } from "../typechain-types";

async function main() {
  const accounts = await ethers.getSigners();
  let alice:SignerWithAddress = accounts[0];
  let bob:SignerWithAddress = accounts[1];
  let eve:SignerWithAddress = accounts[2];
  let etherStore:EtherStore;
  let attack:Attack;

  const EtherStore = await ethers.getContractFactory("EtherStore");
  etherStore = await EtherStore.deploy();
  console.log("etherStoreAddress : ", etherStore.address)

  const Attack = await ethers.getContractFactory("Attack");
  attack = await Attack.deploy(etherStore.address);
  console.log("attackAddress : ", attack.address)

  const deposit1 = await etherStore.connect(alice).deposit({value: (1*(10**18)).toString()});
  await deposit1.wait()

  const deposit2 = await etherStore.connect(bob).deposit({value: (1*(10**18)).toString()});
  await deposit2.wait()

  console.log("etherStore balance : ", await ethers.provider.getBalance(etherStore.address))
  console.log("before sending1 eth : ", await attack.getBalance());
  console.log("before sending1 eth attack: ", await ethers.provider.getBalance(attack.address))
  console.log("before sending1 eth eve : ", await ethers.provider.getBalance(eve.address))
  
  attack.connect(eve).attack({value: (1*(10**18)).toString()})

//채굴전이므로 조회해봤자 업데이트 안됨
  // console.log("after sending1 eth : ", await attack.getBalance());
  // console.log("after sending1 eth : attack ", await ethers.provider.getBalance(attack.address))
  // console.log("after sending1 eth : eve ", await ethers.provider.getBalance(eve.address))
  // console.log("etherStore balance : etherStore", await ethers.provider.getBalance(etherStore.address))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
