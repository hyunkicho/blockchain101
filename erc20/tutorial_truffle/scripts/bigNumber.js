const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545/'));

const decimal = 10**18;
const exampleNumber = 100000 * decimal;
const exampleNumber2 = 1000000000000 * decimal;
const BN = web3.utils.BN;

Number.prototype.noExponents= function(){
    var data= String(this).split(/[eE]/);
    if(data.length== 1) return data[0];

    var  z= '', sign= this<0? '-':'',
    str= data[0].replace('.', ''),
    mag= Number(data[1])+ 1;/*from w w  w.  ja v a  2  s . c  o  m*/

    if(mag<0){
        z= sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;
    while(mag--) z += '0';
    return str + z;
}

function getBigNumberEx(exampleNumber) {
    console.log("exampleNumber with Exponents >>", exampleNumber)
    console.log("exampleNumber >>", exampleNumber.noExponents())
    const noExponentsExample = new BN(exampleNumber.noExponents())
    console.log("exampleNumber toString : ",noExponentsExample);
    const noExponentsExample2 = new BN(exampleNumber2.noExponents())
    console.log("noExponentsExample2 toString : ",noExponentsExample);

    const addResult = noExponentsExample.add(noExponentsExample2).toString();
    console.log("addResult : ",addResult);
    const one_ether = web3.utils.fromWei('1', 'ether');
    console.log("one_ether >>", one_ether);
    const one_ether_wei = web3.utils.toWei('1', 'ether');
    console.log("one_ether_wei >>", one_ether_wei);
}

getBigNumberEx(exampleNumber)