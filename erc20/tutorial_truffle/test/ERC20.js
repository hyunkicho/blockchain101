const ERC20 = artifacts.require("MyERC20");
const BN = web3.utils.BN;

contract('MyERC20', async (accounts) => {
  const msgSender = accounts[0];
  const accountTwo = accounts[1];
  
  it('should mint 1 ether at constructor', async () => {
    const erc20Deployed = await ERC20.deployed();
    const balance = await erc20Deployed.balanceOf.call(msgSender);
    assert.equal(balance, web3.utils.toWei('1', 'ether'), "should mint 1 ether at constructor");
  });

  it('should transfer erc20 token correctly', async () => {
    const erc20Deployed = await ERC20.deployed();
    const initialBalanceMsgSender = await erc20Deployed.balanceOf(msgSender);
    console.log(`initialBalanceMsgSender is ${initialBalanceMsgSender}`)
    const initialBalanceTwo = await erc20Deployed.balanceOf(accountTwo);
    console.log(`initialBalanceTwo is ${initialBalanceTwo}`)
    await erc20Deployed.transfer(accountTwo, web3.utils.toWei('0.5', 'ether'));
    const endBalanceMsgSender = await erc20Deployed.balanceOf(msgSender);
    console.log(`endBalanceMsgSender is ${endBalanceMsgSender}`)
    const endBalanceTwo = await erc20Deployed.balanceOf(accountTwo);
    console.log(`endBalanceTwo is ${endBalanceTwo}`)
    assert.equal(endBalanceMsgSender, endBalanceMsgSender, " balance is not correct");
  })

  it('should burn erc20 token correctly', async () => {
    const erc20Deployed = await ERC20.deployed();
    const initialBalanceTwo = await erc20Deployed.balanceOf(accountTwo);
    console.log(`initialBalanceTwo is ${initialBalanceTwo}`)
    await erc20Deployed.burn(web3.utils.toWei('0.5', 'ether'), { from: accountTwo});
    const endBalanceMsgSender = await erc20Deployed.balanceOf(msgSender);
    console.log(`endBalanceMsgSender is ${endBalanceMsgSender}`)
    const endBalanceTwo = await erc20Deployed.balanceOf(accountTwo);
    console.log(`endBalanceTwo is ${endBalanceTwo}`)
    assert.equal(endBalanceTwo, '0', " balance is not correct");
  })
})