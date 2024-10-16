const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const TALLY_ERC20_GOVERNOR = await ethers.getContractAt("TALLY_ERC20_GOVERNOR","0x1f3A266BD78168f9260Ea6a03Ce8aDf07E15587E");
    console.log(Number(await ethers.provider.getBlockNumber));
    const balance = await TALLY_ERC20_GOVERNOR.getVotes('0x6d34B2Da8243aD705e410357e51a242178e6640c', 13241477);
    console.log("balance:", balance);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});