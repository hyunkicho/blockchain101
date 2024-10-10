import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Counter, EntryPoint, SimpleAccount, SimpleAccountFactory, VerifyingPaymaster } from "../typechain-types";

describe("Account Abstraction Test with Counter And Paymaster", function () {
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

    // Deploy SimpleBasePaymaster contract
    const PaymasterFactory = await ethers.getContractFactory("VerifyingPaymaster");
    const paymasterFactory = await PaymasterFactory.deploy(entryPointAddress, owner) as unknown as VerifyingPaymaster;
    // Return the deployed contracts and signers
    return { aa_accountFactory, entryPointAddress, entryPointFactory, counterFactory, paymasterFactory, owner, walletOwner };
  }

  describe("Account Abstraction and Counter Test", function () {
    it("Should create a wallet and increment counter", async function () {
      const { aa_accountFactory, entryPointFactory, counterFactory, paymasterFactory, owner, walletOwner } = await loadFixture(deployAccountAbstractionFixture);

      const aa_owner_salt = 2; // Example salt for account creation

      // Step 1: Create a new account with the wallet owner
      console.log("owner wallet >>", walletOwner.address);
      console.log("aa_owner_salt >>", aa_owner_salt);

      //getAddress : https://it-timehacker.tistory.com/526
      const createdAccountAddress = await aa_accountFactory["getAddress(address,uint256)"](walletOwner.address, aa_owner_salt);
      console.log("createdAccountAddress >>", createdAccountAddress);
      // initCode
      let initCode = "0x";
      // You can also manually create wallet with following code
      // await aa_accountFactory.createAccount(walletOwner.address, aa_owner_salt);
      // If wallet is not created you could create with init code and it will make smart contract wallet before other following works
      if ((await ethers.provider.getCode(createdAccountAddress)) === "0x") {
        console.log("init code start", await aa_accountFactory.getAddress());
        initCode =
          await aa_accountFactory.getAddress() +
          aa_accountFactory.interface.encodeFunctionData(
            "createAccount(address,uint256)",
            [walletOwner.address, aa_owner_salt]
          )
            .slice(2);
      }

      // Step 2: Fund the smart account with Ether, add Stake is for showing the trust of paymaster but it didn't have slashing mechanism yet
      // Deposit to function will determine how many gas entryPoint could use
      await paymasterFactory.addStake(1, { value: ethers.parseEther('2') })

      const balance = await entryPointFactory.balanceOf(createdAccountAddress);
      if (Number(balance) == 0) {
        await entryPointFactory.depositTo(createdAccountAddress, {
          value: ethers.parseEther("10")
        });
      }

      // Step 3: Get the nonce for the wallet from entryPoint
      const walletNonce = await entryPointFactory.getNonce(createdAccountAddress, 0);
      console.log("Wallet Nonce: ", walletNonce);

      // Step 4: Interact with the Counter contract (increment the counter)
      const counterValueBefore = await counterFactory.counter();
      console.log("Counter before increment: ", counterValueBefore);
      // const aa_accountContract = await ethers.getContractAt("SimpleAccount", createdAccountAddress) as unknown as SimpleAccount;
      const Target = await ethers.getContractFactory("Counter");
      const SimpleAccount = await ethers.getContractFactory("SimpleAccount");

      // if you are sending normal transaction you should put execute funcstion data into callData
      // in this case counterFactory is just making a counter to check if AA works right
      const callData = SimpleAccount.interface.encodeFunctionData(
        "execute(address,uint256,bytes)",
        [await counterFactory.getAddress(), 0, counterFactory.interface.encodeFunctionData("up()", [])]
      );

      // Step 5: make UserOP input to send at entryPoint
      // paymaster and signature must be zero because we need to make hash of userOP first
      let userOp = {
        sender: createdAccountAddress,
        nonce: walletNonce,
        initCode: initCode,
        callData: callData,
        accountGasLimits: ethers.solidityPacked(
          ["uint128", "uint128"],
          [14_000_000, 900_000]
        ),
        preVerificationGas: 0,
        gasFees: ethers.solidityPacked(
          ["uint128", "uint128"],
          [ethers.parseUnits("1", "gwei"), ethers.parseUnits("1", "gwei")]
        ),
        paymasterAndData: "0x",
        signature: "0x"
      };

      // Step 6: make paymaster data to make signature 
      // this case we use eip191 signature 
      const coder = ethers.AbiCoder.defaultAbiCoder()

      const now = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 구함 (UNIX 타임스탬프)
      const oneWeekLater = now + (7 * 24 * 60 * 60); // 현재 시간 + 1주일 (초 단위)

      const validUntil = oneWeekLater; // 1주일 후
      const validAfter = now; // 현재 시간 (즉시 유효)

      console.log("validUntil:", validUntil);
      console.log("validAfter:", validAfter);

      // set as an estimate Gase with function to execute
      const estimatedGas = await counterFactory.up.estimateGas();
      const paymasterVerificationGasLimit = estimatedGas; //from https://github.com/eth-infinitism/account-abstraction/blob/develop/test/UserOp.ts#L77
      // set if there are post Op exection 
      const paymasterPostOpGasLimit = 0;

      console.log("ethers.zeroPadValue(ethers.getBytes(numberToHex(paymasterVerificationGasLimit)), 16) >>", ethers.zeroPadValue(ethers.toBeHex(paymasterVerificationGasLimit), 16));
      console.log("ethers.zeroPadValue(ethers.getBytes(numberToHex(paymasterVerificationGasLimit)), 16) >>", ethers.zeroPadValue(ethers.toBeHex(paymasterPostOpGasLimit), 16));

      // Step 7: make paymasterAdns Data
      // first paymasterDataSig could be any value because we need to make hash first
      // second after paymasterDataSig you should sign message to get signature data and it will be in paymasterAndData
      // It is okay to use because getHash extract only Offset data of paymasyerAndData when they are caulculating hash
      let paymasterDataSig = "0x1234"; //this could be any sig cause it is the data to put in paymasterAndData

      async function makePaymasterData() {
        return ethers.concat([
          await paymasterFactory.getAddress(),
          ethers.zeroPadValue(ethers.toBeHex(paymasterVerificationGasLimit), 16), 
          ethers.zeroPadValue(ethers.toBeHex(paymasterPostOpGasLimit), 16), 
          coder.encode(['uint48', 'uint48'], [validUntil, validAfter]),
          paymasterDataSig
        ]);
      }

      console.log("await makePaymasterData() : ", await makePaymasterData());

      userOp.paymasterAndData = await makePaymasterData();

      const paymaterUserOpHash = await paymasterFactory.getHash(userOp, validUntil, validAfter);
      console.log("paymaterUserOpHash:", paymaterUserOpHash);

      paymasterDataSig = await owner.signMessage(
        ethers.getBytes(paymaterUserOpHash)
      );
      console.log("paymasterDataSig:", paymasterDataSig); //this is the real paymaster data sig

      userOp.paymasterAndData = ethers.concat([ //this logic is made up with the veryfingPaymaster logic
        await paymasterFactory.getAddress(),
        ethers.zeroPadValue(ethers.toBeHex(paymasterVerificationGasLimit), 16), 
        ethers.zeroPadValue(ethers.toBeHex(paymasterPostOpGasLimit), 16), 
        coder.encode(['uint48', 'uint48'], [validUntil, validAfter]),
        paymasterDataSig
      ]);

      // parsePaymasterAndData will revert if its not valid
      const parsePaymasterAndData = await paymasterFactory.parsePaymasterAndData(await makePaymasterData());
      console.log("parsePaymasterAndData : ", parsePaymasterAndData);

      // Step 8: Make signature from userOpHash with paymaster data including read signature
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
      userOp.signature = sig;

      console.log("userOp", userOp);
      console.log("userOpHash", userOpHash);


      // Step 8 : give paymasyer deposit
      const depositTx = await paymasterFactory.deposit({ value: ethers.parseEther("10") });
      await depositTx.wait();
      console.log("Paymasyer Deposit : ", await paymasterFactory.getDeposit());

      // Step 9 : update userOp with signature and paymaster Data and send Userop to entry point
      const handleOpsTx = await entryPointFactory.handleOps([userOp], owner.address);
      await handleOpsTx.wait();

      // Step 10: Check if the counter was incremented
      const counterValueAfter = await counterFactory.counter();
      console.log("Counter after increment: ", counterValueAfter);

      expect(Number(counterValueAfter)).to.equal(Number(counterValueBefore) + 1);
    });
  });
});
