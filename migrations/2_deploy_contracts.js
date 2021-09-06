const Ghostlycoin = artifacts.require("Ghostlycoin");

module.exports = function (deployer) {
  deployer.deploy(Ghostlycoin, 1000000);
};