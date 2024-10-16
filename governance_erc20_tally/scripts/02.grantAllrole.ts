const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const timelockControllerAddress = "0xDDDf43c51d9e5E533d05798373b7ad6980fd5548";
    const DaoContractAddress = "0x1f3A266BD78168f9260Ea6a03Ce8aDf07E15587E";
    const DAOTIMELOCK_FACTORY = await ethers.getContractAt("DAOTimelock",timelockControllerAddress);
    const grantAllRoleToDaoTx = await DAOTIMELOCK_FACTORY.grantAllRole(DaoContractAddress);
    await grantAllRoleToDaoTx.wait();
    console.log("grantAllRoleToDaoTx tx:", grantAllRoleToDaoTx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});