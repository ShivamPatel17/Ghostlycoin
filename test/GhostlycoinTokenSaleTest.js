const GhostlycoinSale = artifacts.require("GhostlycoinSale");

contract('GhostlycoinSale', function(accounts){
    var tokenSaleInstance;
    var tokenPrice = 10000000000000000; //in wei (0.001 ETH)
    it('initializes the contract with the correct values', function(){
        return GhostlycoinSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, 'address has contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price, tokenPrice, 'token price is correct');
        })
    });

    
})