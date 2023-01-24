const fs = require('fs');
const contractABI = JSON.parse(fs.readFileSync('./build/contracts/MyERC20.json')).abi;
var Web3 = require('web3');
require('dotenv').config()

//truffle migrate를 해서 나온 contract address
const contractAddress = process.env.ERC20;
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const contract = new web3.eth.Contract(contractABI, contractAddress, {from : '0x3787879da0794418e4a41cb8bc5b9f78c2b7fb34'});

function mintERC20(_to, _value) {
  web3.eth.accounts.signTransaction({
    from: process.env.PUBLIC_KEY,
    to: contractAddress,
    gas: 1000000,
    data: contract.methods.transfer(_to, _value.toString()).encodeABI() 
  }, process.env.PRIVATE_KEY)
  .then(console.log)
}

mintERC20("0xe06da1a9bd1677d713c6bfdce9291e5e4c8741d1", 0.05*10**18)