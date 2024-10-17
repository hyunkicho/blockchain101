const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const ERC20 = await ethers.getContractAt("DAO20TOKEN","0xdA72EE523351CAd6d9452BE242429E5BF3DA38F0");
    // const balance = await ERC20.balanceOf("0x6d34B2Da8243aD705e410357e51a242178e6640c");
    // console.log("balance:", balance);


    const transferCalldata = ERC20.interface.encodeFunctionData("transfer", ["0xdA72EE523351CAd6d9452BE242429E5BF3DA38F0", 100]);
    console.log("transferCalldata :", transferCalldata)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});