import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { AccountFactory, Counter, EntryPoint, SimpleAccount, SimpleAccountFactory } from "../typechain-types";
import { PackedUserOperationStruct } from "../typechain-types/@account-abstraction/contracts/core/BaseAccount";

describe("Account Abstraction Test with Counter", function () {
  async function deployAccountAbstractionFixture() {
    const [owner, walletOwner] = await ethers.getSigners();

    // Deploy EntryPoint contract
    const EntryPointFactory = await ethers.getContractFactory("EntryPoint");
    const entryPointFactory = await EntryPointFactory.deploy() as unknown as EntryPoint;
    const entryPointAddress = await entryPointFactory.getAddress();

    // Deploy SimpleAccountFactory contract
    const AA_accountFactory = await ethers.getContractFactory("SimpleAccountFactory");
    const aa_accountFactory = await AA_accountFactory.deploy(entryPointAddress) as unknown as SimpleAccountFactory;
    // Deploy Counter contract
    const CounterFactory = await ethers.getContractFactory("Counter");
    const counterFactory = await CounterFactory.deploy() as unknown as Counter;

    // Return the deployed contracts and signers
    return { aa_accountFactory, entryPointAddress, entryPointFactory, counterFactory, owner, walletOwner };
  }

  describe("Account Abstraction and Counter Test", function () {
    it("Should create a wallet and increment counter", async function () {
      const { aa_accountFactory, entryPointFactory, counterFactory, owner, walletOwner } = await loadFixture(deployAccountAbstractionFixture);

      const aa_owner_salt = 2; // Example salt for account creation

      // Step 1: Create a new account with the wallet owner
      console.log("owner wallet >>", walletOwner.address);
      console.log("aa_owner_salt >>", aa_owner_salt);

      //getAddress : https://it-timehacker.tistory.com/526
      const createdAccountAddress = await aa_accountFactory["getAddress(address,uint256)"](walletOwner.address, aa_owner_salt);
      console.log("createdAccountAddress >>", createdAccountAddress);
      // initCode
      let initCode = "0x";
      // await aa_accountFactory.createAccount(walletOwner.address, aa_owner_salt);
      if ((await ethers.provider.getCode(createdAccountAddress)) === "0x") {
        initCode =
        await aa_accountFactory.getAddress() +
          aa_accountFactory.interface.encodeFunctionData(
            "createAccount(address,uint256)",
            [walletOwner.address, aa_owner_salt]
          )
            .slice(2);
      }

      // Step 2: Fund the smart account with Ether
      const balance = await entryPointFactory.balanceOf(createdAccountAddress);
      if (Number(balance) == 0) {
        await entryPointFactory.depositTo(createdAccountAddress, {
          value: ethers.parseEther("10")
        });
      }

      // Step 3: Get the nonce for the wallet
      const walletNonce = await entryPointFactory.getNonce(createdAccountAddress, 0);
      console.log("Wallet Nonce: ", walletNonce);

      // Step 4: Interact with the Counter contract (increment the counter)
      const counterValueBefore = await counterFactory.counter();
      console.log("Counter before increment: ", counterValueBefore);
      const aa_accountContract = await ethers.getContractAt("SimpleAccount", createdAccountAddress) as unknown as SimpleAccount;
      const Target = await ethers.getContractFactory("Counter");
      const SimpleAccount = await ethers.getContractFactory("SimpleAccount");

      const callData = SimpleAccount.interface.encodeFunctionData(
        "execute(address,uint256,bytes)",
        [await counterFactory.getAddress(), 0, Target.interface.encodeFunctionData("up()", [])]
      );

      // Step 5: make UserOP input to send at entryPoint
      const userOp = {
        sender: createdAccountAddress,
        nonce: walletNonce,
        initCode: initCode,
        callData: callData,
        //concatenation of verificationGas (16 bytes) and callGas (16 bytes)
        accountGasLimits: ethers.solidityPacked(
          ["uint128", "uint128"],
          [9_000_000, 19_000_000]
        ),
        preVerificationGas: 0,
        //concatenation of maxPriorityFee (16 bytes) and maxFeePerGas (16 bytes)
        gasFees: ethers.solidityPacked(
          ["uint128", "uint128"],
          [ethers.parseUnits("1", "gwei"), ethers.parseUnits("1", "gwei")]
        ),
        //concatenation of paymaster fields (or empty)
        paymasterAndData: '0x',
        signature: "0x"
      };

      // Step 6: make UserOP hash to make signature - this case we use eip191 signature
      const coder = ethers.AbiCoder.defaultAbiCoder()
      const packedData = coder.encode(
        [
          "address",
          "uint256",
          "bytes32",
          "bytes32",
          "bytes32",
          "uint256",
          "bytes32",
          "bytes32",
        ],
        [
          userOp.sender,
          userOp.nonce,
          ethers.keccak256(userOp.initCode),
          ethers.keccak256(userOp.callData),
          userOp.accountGasLimits,
          userOp.preVerificationGas,
          userOp.gasFees,
          ethers.keccak256(userOp.paymasterAndData),
        ]
      );

      const enc = coder.encode(
        ["bytes32", "address", "uint256"],
        [ethers.keccak256(packedData), await entryPointFactory.getAddress(), (await ethers.provider.getNetwork()).chainId]
      );
      const userOpHash = ethers.keccak256(enc);
      const sig = await walletOwner.signMessage(
        ethers.getBytes(userOpHash)
      );
      console.log("sig >>", sig);
      userOp.signature = sig;
      console.log("userOpHash:", userOpHash);
      console.log(userOp);
      
      const handleOpsTx = await entryPointFactory.handleOps([userOp], owner.address);
      await handleOpsTx.wait();
      const entryPoint = await aa_accountContract.entryPoint();
      console.log("entryPoint:", entryPoint);
      // Step 5: Check if the counter was incremented
      const counterValueAfter = await counterFactory.counter();
      console.log("Counter after increment: ", counterValueAfter);

      expect(Number(counterValueAfter)).to.equal(Number(counterValueBefore) +1);
    });
  });
});
