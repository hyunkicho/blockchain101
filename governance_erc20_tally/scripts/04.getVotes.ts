const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const DAO20TOKEN = await ethers.getContractAt("DAO20TOKEN","0xdA72EE523351CAd6d9452BE242429E5BF3DA38F0");
    const balance = await DAO20TOKEN.getVotes('0x6d34B2Da8243aD705e410357e51a242178e6640c');

    const TimeLockAddress = "0xDDDf43c51d9e5E533d05798373b7ad6980fd5548";
    const transferTx = await DAO20TOKEN.transfer(TimeLockAddress, ethers.parseUnits("1000", 18));
    await transferTx.wait();
    console.log("transferTx:", transferTx);
    const balanceOfTimelock = await DAO20TOKEN.balanceOf(TimeLockAddress);
    console.log("balanceOfTimelock:", balanceOfTimelock);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});