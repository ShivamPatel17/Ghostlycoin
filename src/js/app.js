App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 10000000,
  tokensSold: 0,
  tokensAvailable: 1000000,

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
   
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);

    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("GhostlycoinSale.json", function(GhostlycoinSale) {
      console.log("in the token sale init");
      App.contracts.GhostlycoinSale = TruffleContract(GhostlycoinSale);
      App.contracts.GhostlycoinSale.setProvider(App.web3Provider);
      App.contracts.GhostlycoinSale.deployed().then(function(GhostlycoinSale) {
        console.log("Ghostlycoin Sale Address:", GhostlycoinSale.address);
      });
    }).done(function() {
      $.getJSON("Ghostlycoin.json", function(Ghostlycoin) {
        App.contracts.Ghostlycoin = TruffleContract(Ghostlycoin);
        App.contracts.Ghostlycoin.setProvider(App.web3Provider);
        App.contracts.Ghostlycoin.deployed().then(function(Ghostlycoin) {
          console.log("Ghostlycoin Address:", Ghostlycoin.address);
        });

        App.listenForEvents();
        return App.render();
      });
    })
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.GhostlycoinSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })
  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    console.log("in render");

    var loader  = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      console.log("in get coinbase");
      if(err === null) {
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    })

    // Load token sale contract
    App.contracts.GhostlycoinSale.deployed().then(function(instance) {
      GhostlycoinSaleInstance = instance;
      return GhostlycoinSaleInstance.tokenPrice();
    }).then(function(tokenPrice) {
      App.tokenPrice = tokenPrice;
      $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
      return GhostlycoinSaleInstance.tokensSold();
    }).then(function(tokensSold) {
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html(App.tokensSold);
      $('.tokens-available').html(App.tokensAvailable);

      var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
      $('#progress').css('width', progressPercent + '%');

      // Load token contract
      App.contracts.Ghostlycoin.deployed().then(function(instance) {
        GhostlycoinInstance = instance;
        return GhostlycoinInstance.balanceOf(App.account);
      }).then(function(balance) {
        $('.dapp-balance').html(balance.toNumber());
        console.log("loader should be hidden");
        App.loading = false;
        loader.hide();
        content.show();
      })
    });
  },

  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    console.log("looking to buy "+numberOfTokens+" tokens");
    App.contracts.GhostlycoinSale.deployed().then(function(instance) {
      console.log("buying");
      console.log(App.tokenPrice);
      var buyresult = instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 6721975 // Gas limit
      });
      console.log(buyresult);
      return buyresult;
    }).then(function(result) {
      App.tokensSold += numberOfTokens;
      console.log("Tokens bought... total:"+ App.tokensSold);
      document.getElementById("mainForm").reset(); // reset number of tokens in form
      $('#content').show();
      $('#loader').hide();
      console.log("form should have been reset");
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});
