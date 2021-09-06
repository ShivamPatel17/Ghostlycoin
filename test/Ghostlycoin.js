const Ghostlycoin = artifacts.require("Ghostlycoin");

contract('Ghostlycoin', function(accounts){
    it('sets the total supply upon deployment', function(){
        return Ghostlycoin.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, "sets the total suppler to 1,000,000");
        });
    });
})