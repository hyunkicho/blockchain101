import { ethers } from "hardhat";
const contractAddress = process.env.ERC721!;

async function transferEvent() {
  const MyERC721 = await ethers.getContractFactory("MyERC721");
  const erc721 = await MyERC721.attach(contractAddress);
  const topic = [erc721.filters.Transfer().topics!].toString();
  // console.log("topic >>", topic)
  // console.log("contractAddress.toString() >>", contractAddress.toString())

  const filter = {
    address: contractAddress.toString(),
    fromBlock: 8432738,
    topics: [topic]    
  };
  const logs = await ethers.provider.getLogs(filter);
  //특정 이벤트만 필터링 하기 위한 로그 값
  // console.log("logs >>>", logs)
  let abi = require("../artifacts/contracts/MyERC721.sol/MyERC721.json").abi;
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
        console.log("tokenId >>",iface.parseLog(log).args.tokenId);
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
