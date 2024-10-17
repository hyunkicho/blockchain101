const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Factory and FactoryAssembly Contract", function () {
    let Factory, factory, FactoryAssembly, factoryAssembly, TestContract, owner, addr1;
    const fooValue = 42;

    before(async function () {
        [owner, addr1] = await ethers.getSigners();

        // Deploy TestContract first (since it's required by Factory)
        TestContract = await ethers.getContractFactory("TestContract");

        // Deploy Factory contract
        Factory = await ethers.getContractFactory("Factory");
        factory = await Factory.deploy();

        // Deploy FactoryAssembly contract
        FactoryAssembly = await ethers.getContractFactory("FactoryAssembly");
        factoryAssembly = await FactoryAssembly.deploy();
    });

    it("Should deploy contract using create2 from Factory", async function () {
        // Salt value for create2
        const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("random_salt"));

        // Deploy TestContract using create2
        const deployTx = await factory.deploy(owner.address, fooValue, salt);
        const txReceipt = await deployTx.wait();

        // Get deployed contract address
        const deployedAddress = txReceipt.events[0].args[0];

        // Connect to the deployed contract and verify the values
        const deployedContract = await ethers.getContractAt("TestContract", deployedAddress);
        const ownerInContract = await deployedContract.owner();
        const fooInContract = await deployedContract.foo();

        expect(ownerInContract).to.equal(owner.address);
        expect(fooInContract).to.equal(fooValue);
    });

    it("Should compute the correct address using FactoryAssembly", async function () {
        const salt = 12345; // Arbitrary salt for testing

        // Get bytecode for TestContract
        const bytecode = await factoryAssembly.getBytecode(owner.address, fooValue);

        // Compute the address using FactoryAssembly
        const predictedAddress = await factoryAssembly.getAddress(bytecode, salt);

        // Deploy TestContract using FactoryAssembly and the same salt
        const deployTx = await factoryAssembly.deploy(bytecode, salt);
        const txReceipt = await deployTx.wait();

        // Verify that the computed address matches the deployed address
        const deployedAddress = txReceipt.events[0].args.addr;
        expect(deployedAddress).to.equal(predictedAddress);

        // Check that the contract has been deployed successfully
        const deployedContract = await ethers.getContractAt("TestContract", deployedAddress);
        const ownerInContract = await deployedContract.owner();
        const fooInContract = await deployedContract.foo();

        expect(ownerInContract).to.equal(owner.address);
        expect(fooInContract).to.equal(fooValue);
    });

    it("Should return the balance of the deployed contract", async function () {
        const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("balance_salt"));

        // Deploy contract with balance
        const deployTx = await factory.deploy(owner.address, fooValue, salt);
        const txReceipt = await deployTx.wait();

        const deployedAddress = txReceipt.events[0].args[0];

        // Get the balance of the contract
        const deployedContract = await ethers.getContractAt("TestContract", deployedAddress);
        const balance = await deployedContract.getBalance();

        // Verify the contract balance is 1 ether
        expect(ethers.utils.formatEther(balance)).to.equal("0.0");
    });
});
