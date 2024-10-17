const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CreateExample contract
  const CreateExample = await ethers.getContractFactory("CreateExample");
  const createExample = await CreateExample.deploy();
  await createExample.deployed();

  console.log("CreateExample contract deployed to:", createExample.address);

  // Call the create function to deploy SimpleContract
  const value = 100; // Set value to deploy in SimpleContract
  const tx = await createExample.create(value);
  await tx.wait();

  // Get the deployed SimpleContract address
  const deployedAddress = await createExample.deployedContract();
  console.log("SimpleContract deployed to:", deployedAddress);

  // Connect to the deployed SimpleContract and verify the value
  const simpleContract = await ethers.getContractAt("SimpleContract", deployedAddress);
  const storedValue = await simpleContract.value();
  console.log("Stored value in SimpleContract:", storedValue.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
