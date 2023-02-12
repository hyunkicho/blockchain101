import { ethers } from 'hardhat';

const decimal = 10**18;
const exampleNumber = 100000 * decimal;
const exampleNumber2 = 1000000000000 * decimal;

function noExponents(_number: number){
    var data= String(_number).split(/[eE]/);
    if(data.length== 1) return data[0];

    var  z= '', sign= _number<0? '-':'',
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
function getBigNumberEx() {
    console.log("exampleNumber with Exponents >>", exampleNumber)

    const noExponentsExample = ethers.BigNumber.from(noExponents(exampleNumber)).toString()
    console.log("exampleNumber toString : ",noExponentsExample);
    const noExponentsExample2 = ethers.BigNumber.from(noExponents(exampleNumber2)).toString()
    console.log("noExponentsExample2 toString : ",noExponentsExample2);

    const addResult = ethers.BigNumber.from(noExponentsExample).add(ethers.BigNumber.from(noExponentsExample2));
    console.log("addResult : ",addResult);
    const addDecimal = ethers.utils.parseUnits(addResult.toString(), 18);
    console.log("addDecimal >>", addDecimal);
}

getBigNumberEx()