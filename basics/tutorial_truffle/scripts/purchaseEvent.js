const fs = require('fs');
const contractABI = JSON.parse(fs.readFileSync('./build/contracts/VendingMachine.json')).abi;
var Web3 = require('web3');

//truffle migrate를 해서 나온 contract address
const contractAddress = '0xFcD846259Ff8AE19d2B36F577039f8798DF278De';
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545/'));
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function getPurchaseEvents (_from) {
  await contract.getPastEvents('Purchase', {
      filter: {purchaser: _from}, // Using an array means OR: e.g. 20 or 23
      fromBlock: 0,
      toBlock: 'latest'
  }, function(error, events){ console.log(events); })
  .then(function(events){
      console.log("all events >>", events) // same results as the optional callback above
      for(i in events) {
        console.log("i >>", i)
        console.log("blockNumber : ",events[i].blockNumber);
        console.log("blockHash : ",events[i].blockHash);
        console.log("purchaser : ",events[i].returnValues.purchaser);
        console.log("amount : ",events[i].returnValues.amount);
      }
  });
}

getPurchaseEvents("0x3787879da0794418e4a41cb8bc5b9f78c2b7fb34")

//STEP 01 : truffle develop에서 endpoint 확인
//STEP 02 : truffle migrate 명령어를 통해 배포
//SETP 03 : 배포된 컨트렉트에 상호작용 해보기 - getPastEvents