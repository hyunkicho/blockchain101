const fs = require('fs');
const contractABI = JSON.parse(fs.readFileSync('./build/contracts/VendingMachine.json')).abi;
var Web3 = require('web3');

//truffle migrate를 해서 나온 contract address
const contractAddress = '0xFcD846259Ff8AE19d2B36F577039f8798DF278De';
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545/'));
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function purchase (_from, _value) {
  await contract.methods.purchase(1).send({from: _from, value: _value})
  .on('transactionHash', function(hash){
    console.log("tx hash >>", hash)
  })
  .on('receipt', function(receipt){
    console.log("tx receipt >>", receipt)
  })
  .on('error', console.error);
}

purchase("0x3787879da0794418e4a41cb8bc5b9f78c2b7fb34", 1*(10**18))

//STEP 01 : truffle develop에서 endpoint 확인
//STEP 02 : truffle migrate 명령어를 통해 배포
//SETP 03 : 배포된 컨트렉트에 상호작용 해보기 - send