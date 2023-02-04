import { ethers } from 'hardhat';
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545/'));

const decimal = 10**18;
const exampleNumber = 100000 * decimal;
const exampleNumber2 = 1000000000000 * decimal;

function getBigNumberEx() {
    console.log("exampleNumber with Exponents >>", exampleNumber)
    const noExponentsExample = ethers.utils.parseUnits(exampleNumber.toString(),0)
    console.log("exampleNumber toString : ",noExponentsExample);
    const noExponentsExample2 = ethers.utils.parseUnits(exampleNumber2.toString(),0)
    console.log("noExponentsExample2 toString : ",noExponentsExample);

    const addResult = noExponentsExample.add(noExponentsExample2).toString();
    console.log("addResult : ",addResult);
    const one_ether = ethers.utils.parseUnits(addResult.toString(), 18);
    console.log("one_ether >>", one_ether);
}

getBigNumberEx()