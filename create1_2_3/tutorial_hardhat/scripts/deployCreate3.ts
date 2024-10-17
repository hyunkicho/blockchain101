const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CREATE3Factory contract
  const CREATE3Factory = await ethers.getContractFactory("CREATE3Factory");
  const create3Factory = await CREATE3Factory.deploy();
  await create3Factory.deployed();

  console.log("CREATE3Factory contract deployed to:", create3Factory.address);

  // Define a salt and the creation code for a simple contract deployment
  const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("unique_salt"));

  // Example contract with a constructor (SimpleContract)
  const SimpleContract = await ethers.getContractFactory("SimpleContract");
  const valueToSet = 100; // Set value to deploy in SimpleContract
  const creationCode = ethers.utils.solidityPack(
    ["bytes", "uint256"],
    [SimpleContract.bytecode, valueToSet]
  );

  // Deploy SimpleContract using CREATE3 through the factory
  const deployTx = await create3Factory.deploy(salt, creationCode, { value: 0 });
  const deployReceipt = await deployTx.wait();
  const deployedAddress = await create3Factory.getDeployed(deployer.address, salt);

  console.log("SimpleContract deployed via CREATE3 to:", deployedAddress);

  // Verify the deployed contract's functionality
  const simpleContract = await ethers.getContractAt("SimpleContract", deployedAddress);
  const storedValue = await simpleContract.value();
  console.log("Stored value in deployed contract:", storedValue.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
