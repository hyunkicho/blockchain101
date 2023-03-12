import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';
  // contracts
  let boxV2: Contract;

// Start test block
describe('BoxV2', function () {
  beforeEach(async function () {
    const BoxV2 = await ethers.getContractFactory("BoxV2");
    boxV2 = await BoxV2.deploy();
    await boxV2.deployed();
    console.log("boxV2 deployed",boxV2.address);
  });
 
  // Test case
  it('retrieve returns a value previously stored', async function () {
    // Store a value
    await boxV2.store(42);
 
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await boxV2.retrieve()).toString()).to.equal('42');
  });
 
  // Test case
  it('retrieve returns a value previously incremented', async function () {
    // Increment
    await boxV2.increment();
 
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await boxV2.retrieve()).toString()).to.equal('1');
  });
});