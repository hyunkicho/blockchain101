const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const voter2 = "0x1C6934bd97e163602346270d7F5575cc8c0Dc0a2";
    const DAO20TOKEN = await ethers.getContractAt("DAO20TOKEN","0xdA72EE523351CAd6d9452BE242429E5BF3DA38F0");
    const transferTx = await DAO20TOKEN.transfer(voter2, ethers.parseUnits("10", 18));
    await transferTx.wait();
    console.log("transferTx:", transferTx);
    const voter2Balance = await DAO20TOKEN.balanceOf(voter2);
    console.log("voter2Balance:", voter2Balance);

    const voter3 = "0x9ae272229744Ca6bD06739A2580FF4b3500EDB1d";
    const transferTx2 = await DAO20TOKEN.transfer(voter3, ethers.parseUnits("10", 18));
    await transferTx2.wait();
    console.log("transferTx2:", transferTx2);
    const voter3Balance = await DAO20TOKEN.balanceOf(voter2);
    console.log("voter3Balance:", voter3Balance);

    // transferCalldata = erc20Token.interface.encodeFunctionData("transfer", [teamAddress, changeToBigInt(grantAmount)]);
    // console.log("transferCalldata :", transferCalldata)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});