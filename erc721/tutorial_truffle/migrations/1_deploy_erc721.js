const myErc721 = artifacts.require("MyERC721");

module.exports = function(deployer) {
  deployer.deploy(myErc721);
};
