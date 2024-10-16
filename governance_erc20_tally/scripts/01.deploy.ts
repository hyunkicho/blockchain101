const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const deployer = new ethers.Wallet(process.env.PK);
    console.log("deployer >>", deployer.address);
    const DaaoToken = await ethers.deployContract("DAO20TOKEN", [deployer.address]);

    await DaaoToken.waitForDeployment();
    console.log("DaaoToken contract deployed to:", await DaaoToken.getAddress());
    const DaaoTokenAddress = await DaaoToken.getAddress();
    const minDelay = 60;
    const timelockController = await ethers.deployContract("DAOTimelock", [minDelay, [deployer.address], [deployer.address], deployer.address]);
    const timelockControllerAddress = await timelockController.getAddress();
    console.log("timelockControllerAddress contract deployed to:", timelockControllerAddress);
    const Daao = await ethers.deployContract("TALLY_ERC20_GOVERNOR",[DaaoTokenAddress, timelockControllerAddress]);
    await Daao.waitForDeployment();
    console.log("Daao contract deployed to:", await Daao.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});