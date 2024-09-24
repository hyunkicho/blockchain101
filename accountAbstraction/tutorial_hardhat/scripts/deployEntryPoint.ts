import { ethers } from "hardhat";

async function main() {
    const deployer = (await ethers.getSigners())[0];
    const entryPoint = await ethers.deployContract("EntryPoint", [], {});
    await entryPoint.waitForDeployment();
    console.log(`EntryPoint: ${await entryPoint.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}).then(() => {
    process.exit();
});
