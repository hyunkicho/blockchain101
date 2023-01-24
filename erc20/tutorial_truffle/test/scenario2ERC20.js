const ERC20 = artifacts.require("MyERC20");
const BN = web3.utils.BN;
const truffleAssert = require('truffle-assertions');

contract('testERC20 case with large amount of ether', async (accounts) => {
  const msgSender = accounts[0];
  const accountTwo = accounts[1];
  const accountThree = accounts[2];
  const mintAmount = web3.utils.toWei('999', 'ether');
  const sendAmount = web3.utils.toWei('1000', 'ether');
  const approveAmount = web3.utils.toWei('1000', 'ether');
  const burnAmount = web3.utils.toWei('1000', 'ether');

  it('should mint erc20 token correctly', async () => {
    const erc20Deployed = await ERC20.deployed();
    await erc20Deployed.mint(msgSender, mintAmount)
    const msgSenderBalance = await erc20Deployed.balanceOf(msgSender)
    assert.equal(msgSenderBalance, sendAmount, " balance is not correct");
  })

  it('should transfer erc20 token correctly', async () => {
    const erc20Deployed = await ERC20.deployed();
    await erc20Deployed.transfer(accountTwo, sendAmount);
    const accountTwoBalance = await erc20Deployed.balanceOf(accountTwo)
    assert.equal(accountTwoBalance, sendAmount, " balance is not correct");
  })

  it('should approve right amount of erc20 token correctly', async () => {
    const erc20Deployed = await ERC20.deployed();
    await erc20Deployed.approve(accountTwo, approveAmount)
    const approvedAmount = await erc20Deployed.allowance(msgSender,accountTwo)
    assert.equal(approvedAmount, approveAmount, " allownace is not correct");
  })

  it('should send right transferFrom of erc20 token correctly', async () => {
    const erc20Deployed = await ERC20.deployed();
    await erc20Deployed.mint(msgSender, approveAmount)
    await erc20Deployed.transferFrom(msgSender, accountThree, approveAmount, {from: accountTwo});
    const accountThreeBalance = await erc20Deployed.balanceOf(accountThree)
    assert.equal(approveAmount, accountThreeBalance, "balanceOf is not correct");
  })

  it('should revert when over burned', async () => {
    const erc20Deployed = await ERC20.deployed();
    await truffleAssert.reverts(
      erc20Deployed.burn(burnAmount),
      "ERC20: burn amount exceeds balance"
    );            
  })
})
