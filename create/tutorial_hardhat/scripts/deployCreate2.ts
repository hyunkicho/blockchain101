const { ethers } = require("hardhat");

async function main() {
  // 1. Deploy TestContract, Factory, and FactoryAssembly contracts
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Factory contract
  const Factory = await ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();
  await factory.deployed();
  console.log("Factory contract deployed to:", factory.address);

  // Deploy FactoryAssembly contract
  const FactoryAssembly = await ethers.getContractFactory("FactoryAssembly");
  const factoryAssembly = await FactoryAssembly.deploy();
  await factoryAssembly.deployed();
  console.log("FactoryAssembly contract deployed to:", factoryAssembly.address);

  // Define variables for deploying TestContract
  const fooValue = 42;
  const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("random_salt"));

  // 2. Deploy TestContract using create2 from Factory contract
  const deployTx = await factory.deploy(deployer.address, fooValue, salt);
  const txReceipt = await deployTx.wait();
  const deployedAddress = txReceipt.events[0].args[0];
  console.log("TestContract deployed using Factory to:", deployedAddress);

  // Connect to the deployed TestContract and verify owner and foo values
  const deployedContract = await ethers.getContractAt("TestContract", deployedAddress);
  const ownerInContract = await deployedContract.owner();
  const fooInContract = await deployedContract.foo();

  console.log("Owner in deployed contract:", ownerInContract);
  console.log("Foo value in deployed contract:", fooInContract.toString());

  // 3. Deploy using FactoryAssembly and verify predicted address
  const bytecode = await factoryAssembly.getBytecode(deployer.address, fooValue);
  const assemblySalt = 12345; // Random salt
  const predictedAddress = await factoryAssembly.getAddress(bytecode, assemblySalt);

  console.log("Predicted address (FactoryAssembly):", predictedAddress);

  // Deploy the contract using FactoryAssembly
  const deployAssemblyTx = await factoryAssembly.deploy(bytecode, assemblySalt);
  const assemblyReceipt = await deployAssemblyTx.wait();
  const deployedAssemblyAddress = assemblyReceipt.events[0].args.addr;

  console.log("TestContract deployed using FactoryAssembly to:", deployedAssemblyAddress);

  // Connect to the deployed TestContract and verify owner and foo values
  const deployedAssemblyContract = await ethers.getContractAt("TestContract", deployedAssemblyAddress);
  const ownerInAssemblyContract = await deployedAssemblyContract.owner();
  const fooInAssemblyContract = await deployedAssemblyContract.foo();

  console.log("Owner in FactoryAssembly deployed contract:", ownerInAssemblyContract);
  console.log("Foo value in FactoryAssembly deployed contract:", fooInAssemblyContract.toString());

  // // 4. Deploy contract with balance using Factory and check balance
  // const balanceSalt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("balance_salt"));
  // const deployWithBalanceTx = await factory.deploy(deployer.address, fooValue, balanceSalt);
  // const balanceTxReceipt = await deployWithBalanceTx.wait();
  // const deployedBalanceAddress = balanceTxReceipt.events[0].args.addr;

  // const deployedBalanceContract = await ethers.getContractAt("TestContract", deployedBalanceAddress);
  // const balance = await deployedBalanceContract.getBalance();

  // console.log("TestContract deployed with balance to:", deployedBalanceAddress);
  // console.log("Contract balance (in ether):", ethers.utils.formatEther(balance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
