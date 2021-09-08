const Ghostlycoin = artifacts.require("Ghostlycoin");

contract('Ghostlycoin', function(accounts){

    //tests the name initializing strings
    it('initializes the contract with the correct values', function(){
        return Ghostlycoin.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, "Ghostlycoin", "Ghostlycoin has the correct name");
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol, "GSC", "Ghostlycoin has the correct symbol");
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, "Ghostlycoin v1.0", "Ghostlycoin has the correct standard");

        })
    });

    //tests the constructor
    it('sets the total supply upon deployment', function(){
        return Ghostlycoin.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, "sets the total suppler to 1,000,000");
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, "it allocates the initial supply to the admin account")
        })
    });

    it('transfers token ownership', function(){
        return Ghostlycoin.deployed().then(function(instance){
            tokenInstance = instance;
            //Test 'require' statement first by transfering something larger than the sender's balance
            return tokenInstance.transfer.call(accounts[1], 99999999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]})
        }).then(function(success){
            assert(success, true, "transfer function returns true");
            return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 750000, 'deduces the amount from the sending account');
        })
    });

    it('approves tokens for delegated transfer', function(){
        return Ghostlycoin.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success){
            assert(success, true, 'it returns true');
            return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
        });  
    });

    it('handles delegated transfer', function(){
        return Ghostlycoin.deployed().then(function(instance){
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            //transfer some tokens to fromAccount
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then(function(receipt){
            //approve spending account to spend 10 tokens from fromAccount
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        }).then(function(receipt){
            //try transfering something larger than sender's account
            return tokenInstance.transferFrom(fromAccount, toAccount, 10000000, {from: spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
            //try transferring something larger than the approved amount
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger approved ammount');
            //try transferring something larger than the approved amount
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function(success){
            assert.equal(success, true);
            //note that we are actually invoking the transferFrom method because now we want to 
            //change the values on the blockchain. The previous tests in this didn't change anything
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[2], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[3], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 90, 'deduces amount from the sending account');
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 10, 'adds the amount to the toAccount');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 0, 'deducts the amount from the allowance');
        })

    });
    

});