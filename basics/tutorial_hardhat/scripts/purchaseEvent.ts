import { ethers } from "hardhat";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function purchase(amount: number) {
  const VendingMachine = await ethers.getContractFactory("VendingMachine");
  const vendingMachine = await VendingMachine.attach(contractAddress);
  const filter: any = {
    address: contractAddress,
    fromBlock: 0,
    toBlock: 10000000,
    topics: [vendingMachine.filters.Purchase().topics]
  };
  const logs = await ethers.provider.getLogs(filter);
  //특정 이벤트만 필터링 하기 위한 로그 값
  // console.log("logs >>>", logs)
  let abi = require("../artifacts/contracts/VendigMachine.sol/VendingMachine.json").abi;
  let iface = new ethers.utils.Interface(abi);
  //로그를 분석하기 위해서 abi를 가져옴
  logs.forEach(async(logs: any) => {
    //실제로 이벤트 로그 내용을 분석하기 위해서는 각각의 트랜잭션 receipt를 가져와서 처리해야 한다.
    const receipt = await ethers.provider.getTransactionReceipt(logs.transactionHash);
    // console.log("receipt >>>", receipt);
    //반복문을 통해서 각로그들의 내용 출력 진행
    receipt.logs.forEach((log: any) => {
      // console.log("iface.parseLog(log) >>", iface.parseLog(log));
      console.log("purchaser >>",iface.parseLog(log).args[0]);
      console.log("amount >>",iface.parseLog(log).args[1]);
    });
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
purchase(10).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
