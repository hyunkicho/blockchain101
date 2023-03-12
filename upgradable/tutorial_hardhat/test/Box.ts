import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
  // contracts
  let box: Contract;
   
  // Start test block
  describe('Box', function () {
    beforeEach(async function () {
      const Box = await ethers.getContractFactory("Box");
      box = await Box.deploy();
      await box.deployed();
      console.log("box deployed",box.address);
    });
   
    // Test case
    it('retrieve returns a value previously stored', async function () {
      // Store a value
      await box.store(42);
   
      // Test if the returned value is the same one
      // Note that we need to use strings to compare the 256 bit integers
      expect((await box.retrieve()).toString()).to.equal('42');
    });
  });