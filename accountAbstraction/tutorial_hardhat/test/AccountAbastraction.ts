import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { AccountFactory, Counter, EntryPoint } from "../typechain-types";
const hre = require("hardhat"); //for using function which is not included in hardhat ethers

describe("Basic AA wallet", function () {
  async function deployAccountAbstractionFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, walletOwner] = await hre.ethers.getSigners();
    const EntryPointFactory = await ethers.getContractFactory("EntryPoint");
    const entryPointFactory = await EntryPointFactory.deploy() as unknown as EntryPoint;
    const entryPointAddress =  await entryPointFactory.getAddress();
    console.log("entryPointAddress >>", entryPointAddress);
    const AA_accountFactory = await ethers.getContractFactory("SimpleAccountFactory");
    const aa_accountFactory = await AA_accountFactory.deploy(entryPointAddress) as unknown as AccountFactory;
    const CouterFactory = await ethers.getContractFactory("Counter");
    const counterFactory = await CouterFactory.deploy() as unknown as Counter;
    const walletFactory = await ethers.getContractFactory("SimpleAccount");
    return { aa_accountFactory, entryPointAddress, entryPointFactory, counterFactory, walletFactory, owner, walletOwner };
  }

  describe("testing ERC4337", async function () {
    it("Should make AA wallet correctly", async function () {
      const { aa_accountFactory, entryPointAddress, entryPointFactory, counterFactory, walletFactory, owner, walletOwner } = await loadFixture(
        deployAccountAbstractionFixture
      );
      const aa_owner_salt = 1; //example salt it could be any number
      const aaAccountFactoryAddress = await aa_accountFactory.getAddress(walletOwner.address, aa_owner_salt);
      console.log("📮aa account address is : ",aaAccountFactoryAddress)
      await aa_accountFactory.createAccount(walletOwner.address, aa_owner_salt);
      // console.log("✅created aa account address is same as expected");
      const aa_accountContract = await ethers.getContractAt("SimpleAccount", aaAccountFactoryAddress);

      // /* Pre-funding the smart account with Ether to cover transaction fees */
      const balance = await entryPointFactory.balanceOf(aaAccountFactoryAddress);
      console.log(`Balance: ${balance}`);
      if (Number(balance) == 0) {
        const txDepositTo = await entryPointFactory.depositTo(aaAccountFactoryAddress, {
          value: hre.ethers.parseEther("10")
        });
        const txDepositToRes = await txDepositTo.wait();
        console.log(`DepositTo: ${txDepositToRes?.hash}`);
      }

      const balanceAfter = await entryPointFactory.balanceOf(aaAccountFactoryAddress);
      console.log(`balanceAfter: ${balanceAfter}`);

      const walletNonce = await entryPointFactory.getNonce(walletOwner.address, 0);
      console.log("walletNonce :", walletNonce);

      const counterView = await counterFactory.counter();
      console.log("check counter :", counterView);
      const iFaceCounter = new ethers.Interface([
        "function up()"
      ])
      const callData = iFaceCounter.encodeFunctionData(
        "up",
        []
      );

      console.log("STEP01) make raw userOP");
      //to get userOP hash you need to make raw userOP without signature
      const userOp = {
        sender: aaAccountFactoryAddress, //aa contract Address here
        nonce: walletNonce,
        // initCode: initCode,
        initCode: "0x",
        callData: callData,
        callGasLimit: 200_000,
        verificationGasLimit: 200_000,
        preVerificationGas: 50_000,
        maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
        paymasterAndData: "0x",
        signature: "0x"
      };

      console.log("STEP02) make userOpDataHash data and signature");

      const coder = hre.ethers.AbiCoder.defaultAbiCoder()

      const DataEnc = coder.encode(
        [
          "address", "uint256", "bytes32", "bytes32", "uint256", "uint256", "uint256", "uint256", "uint256",
          "uint256", "address", "uint48", "uint48"
        ],
        [
          userOp.sender,
          userOp.nonce,
          hre.ethers.keccak256(userOp.initCode),
          hre.ethers.keccak256(userOp.callData),
          userOp.callGasLimit,
          userOp.verificationGasLimit,
          userOp.preVerificationGas,
          userOp.maxFeePerGas,
          userOp.maxPriorityFeePerGas,
          (await hre.ethers.provider.getNetwork()).chainId,
          ethers.ZeroAddress,
          (await hre.ethers.provider.getBlock('latest')).timestamp + 1000,
          (await hre.ethers.provider.getBlock('latest')).timestamp - 1
        ]
      );

      const userOpDataHash = hre.ethers.keccak256(DataEnc);
      console.log("userOpDataHash:", userOpDataHash);
      const dataSig = await owner.signMessage(
        hre.ethers.getBytes(userOpDataHash)
      );
      console.log("paymasterDataSig:", dataSig);
      userOp.signature = dataSig;

      console.log("STEP03) call");
      const packedUserOp = {
        sender: aaAccountFactoryAddress, //aa contract Address here
        nonce: walletNonce,
        initCode: "0x",
        callData: callData,
        callGasLimit: 200_000,
        accountGasLimits: 200_000,
        preVerificationGas: 50_000,
        paymasterAndData: "0x",
        signature: dataSig
      };
      await entryPointFactory.handleOps([packedUserOp], owner.address);
    });
  });
});
