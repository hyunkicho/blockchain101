import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';
  // contracts
  let box: Contract;
  let boxV2: Contract;
// Start test block
describe('BoxV2 (proxy)', function () {
  beforeEach(async function () {
    const Box = await ethers.getContractFactory("Box");
    const BoxV2 = await ethers.getContractFactory("BoxV2");
 
    box = await upgrades.deployProxy(Box, [42], {initializer: 'store'});
    console.log("deployProxy",box.address);
    let boxV2Implentaion = await upgrades.prepareUpgrade(box.address, BoxV2);
    console.log("implementation V2 address : ",boxV2Implentaion);
    boxV2 = await upgrades.upgradeProxy(box.address, BoxV2);
    console.log("upgradeProxy",boxV2.address);
  });
 
  // Test case
  it('retrieve returns a value previously incremented', async function () {
    // Increment
    await boxV2.increment();
 
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await boxV2.retrieve()).toString()).to.equal('43');
  });
});