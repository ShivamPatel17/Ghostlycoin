//requiring these files in this way allows us to interact with the
//smart contracts in an abstract way with truffle and the JS runtime environment
const Ghostlycoin = artifacts.require("Ghostlycoin");
const GhostlycoinSale = artifacts.require("GhostlycoinSale");


module.exports = function (deployer) {
  deployer.deploy(Ghostlycoin, 1000000).then(function(){
    //Token price is 0.001 ETH
    var tokenPrice = 10000000; //in wei (0.001 ETH)
    return deployer.deploy(GhostlycoinSale, Ghostlycoin.address, tokenPrice);
  });
};