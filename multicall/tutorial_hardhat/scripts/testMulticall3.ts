import { ethers } from "hardhat";
import { Multicall, Multicall2, Multicall3, SimpleStorage } from "../typechain-types";

async function main() {
  // 1. SimpleStorage 컨트랙트 배포
  console.log("Deploying SimpleStorage contract...");
  
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy() as unknown as SimpleStorage;
  await simpleStorage.deployed();
  
  console.log(`SimpleStorage deployed at: ${simpleStorage.address}`);

  // 2. Multicall 컨트랙트 배포
  console.log("Deploying Multicall contract...");
  
  const Multicall = await ethers.getContractFactory("Multicall3");
  const multicall = await Multicall.deploy() as unknown as Multicall3;
  await multicall.deployed();
  
  console.log(`Multicall deployed at: ${multicall.address}`);

  // 3. 여러 계정에 대해 값 설정 (이 예시에서는 같은 계정이지만, 다른 값으로 설정)
  console.log("Setting values in SimpleStorage...");

  const [owner, addr1, addr2] = await ethers.getSigners();

  // 각 계정에 값을 설정
  const setValueTx1 = await simpleStorage.connect(owner).setValue(100); // owner에게 100 설정
  await setValueTx1.wait();
  
  const setValueTx2 = await simpleStorage.connect(addr1).setValue(200); // addr1에게 200 설정
  await setValueTx2.wait();
  
  const setValueTx3 = await simpleStorage.connect(addr2).setValue(300); // addr2에게 300 설정
  await setValueTx3.wait();

  console.log("Values set in SimpleStorage.");

  // 4. Multicall로 여러 주소의 getValue 호출
  console.log("Calling SimpleStorage.getValue via Multicall...");

  // Multicall 및 SimpleStorage 컨트랙트 인스턴스 생성

  // 각 주소의 getValue 호출 데이터 인코딩
  const callDataOwner = simpleStorage.interface.encodeFunctionData("getValue", [owner.address]);
  const callDataAddr1 = simpleStorage.interface.encodeFunctionData("getValue", [addr1.address]);
  const callDataAddr2 = simpleStorage.interface.encodeFunctionData("getValue", [addr2.address]);

  // Multicall의 calls 배열 생성
  const calls = [
    {
      target: simpleStorage.address,
      callData: callDataOwner
    },
    {
      target: simpleStorage.address,
      callData: callDataAddr1
    },
    {
      target: simpleStorage.address,
      callData: callDataAddr2
    }
  ];

  // Multicall의 aggregate 함수 호출
  const result = await multicall.callStatic.aggregate3(calls);
  console.log("result >>", result);

  // 각 주소의 getValue 결과 디코딩
  const decodedDataOwner = simpleStorage.interface.decodeFunctionResult("getValue", result[0][1]);
  const decodedDataAddr1 = simpleStorage.interface.decodeFunctionResult("getValue", result[1][1]);
  const decodedDataAddr2 = simpleStorage.interface.decodeFunctionResult("getValue", result[2][1]);

  // 결과 출력
  console.log(`Owner's value: ${decodedDataOwner[0].toString()}`);
  console.log(`Addr1's value: ${decodedDataAddr1[0].toString()}`);
  console.log(`Addr2's value: ${decodedDataAddr2[0].toString()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
