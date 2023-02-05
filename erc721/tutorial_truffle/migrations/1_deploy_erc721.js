const myErc721 = artifacts.require("MyERC20");

module.exports = function(deployer) {
  deployer.deploy(myErc20);
};
