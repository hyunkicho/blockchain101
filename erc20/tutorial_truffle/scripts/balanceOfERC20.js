var Web3 = require('web3');
const fs = require('fs');
const contractABI = JSON.parse(fs.readFileSync('../build/contracts/MyERC20.json')).abi;require('dotenv').config()

const contractAddress = process.env.ERC20;
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function balanceOf(_account) {
    const balance = await contract.methods.balanceOf(_account).call();
    console.log(`Balance of ${_account} is ${balance}`)
}

module.exports = function() {
    balanceOf(process.env.PUBLIC_KEY)
};