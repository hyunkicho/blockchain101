const fs = require('fs');
const contractABI = JSON.parse(fs.readFileSync('./build/contracts/MyERC20.json')).abi;
var Web3 = require('web3');
require('dotenv').config()

//truffle migrate를 해서 나온 contract address
const contractAddress = process.env.ERC20;
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function balanceOf(_account) {
    const balance = await contract.methods.balanceOf(_account).call();
    console.log(`Balance of ${_account} is ${balance}`)
}

module.exports = function() {
    balanceOf("0xe06da1a9bd1677d713c6bfdce9291e5e4c8741d1")
};