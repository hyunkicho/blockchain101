import { ethers } from "hardhat";
const contractAddress = process.env.ERC20!;

async function transferEvent() {
  const MyERC20 = await ethers.getContractFactory("MyERC20");
  const erc20 = await MyERC20.attach(contractAddress);
  const topic = [erc20.filters.Transfer().topics!].toString();
  // console.log("contractAddress.toString() >>", contractAddress.toString())

  const filter = {
    address: contractAddress.toString(),
    //fromBlock을 최근으로 조정해주어야 합니다. (노드 서비스에서 제공을 안해주는 경우가 많습니다.)
    fromBlock: 9066823,
    topics: [topic]
  };
  const logs = await ethers.provider.getLogs(filter);
  //특정 이벤트만 필터링 하기 위한 로그 값
  console.log("logs >>>", logs)
  let abi = require("../artifacts/contracts/MyERC20.sol/MyERC20.json").abi;
  let iface = new ethers.utils.Interface(abi);
  // //로그를 분석하기 위해서 abi를 가져옴
  logs.forEach(async(logs) => {
    //실제로 이벤트 로그 내용을 분석하기 위해서는 각각의 트랜잭션 receipt를 가져와서 처리해야 한다.
    const receipt = await ethers.provider.getTransactionReceipt(logs.transactionHash);
    // console.log("receipt >>>", receipt);
    //반복문을 통해서 각로그들의 내용 출력 진행
    receipt.logs.forEach((log) => {
      const parsedLog = iface.parseLog(log)
      // console.log("iface.parseLog(log) >>", iface.parseLog(log));
      if( parsedLog.topic == topic) {
        console.log("from >>",iface.parseLog(log).args.from);
        console.log("to >>",iface.parseLog(log).args.to);
        console.log("value >>",iface.parseLog(log).args.value);
      } else {
        console.log(`this topic is not Transfer`)
      }
    });
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
transferEvent().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
