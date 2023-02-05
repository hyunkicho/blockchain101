const ERC721 = artifacts.require("MyERC721");
const BN = web3.utils.BN;

contract('MyERC721', async (accounts) => {
  const msgSender = accounts[0];
  const accountTwo = accounts[1];
  const tokenId = 0;
  
  it('should mint 1 nft at constructor', async () => {
    const erc721Deployed = await ERC721.deployed();
    const balance = await erc721Deployed.balanceOf.call(msgSender);
    assert.equal(balance, '1', "should mint 1 nft at constructor");
  });

  it('should transfer erc721 token correctly', async () => {
    const erc721Deployed = await ERC721.deployed();
    const ownerOfNFT = await erc721Deployed.ownerOf(tokenId.toString());
    console.log(`ownerOfNFT is ${ownerOfNFT}`)
    await erc721Deployed.transferFrom(msgSender,accountTwo,tokenId.toString());
    const ownerOfNFTAfter = await erc721Deployed.ownerOf(tokenId.toString());
    console.log(`ownerOfNFTAfter is ${ownerOfNFTAfter}`)
    assert.equal(ownerOfNFTAfter, accountTwo, " owner is not correct");
  })
})