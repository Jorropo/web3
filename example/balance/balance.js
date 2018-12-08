var ready = false;
// Detecting browser mode (modern, legacy or no injection)
// See https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
// to know difference beetween modern and legacy
window.addEventListener('load', async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    console.log("Modern dapp browser detected !")
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      ready = true;
    } catch (error) {
      console.log("User denied account access.")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    console.log("Legacy dapp browser detected !")
    window.web3 = new Web3(web3.currentProvider);
    ready = true;
  }
  // Non-dapp browsers...
  else {
    console.log('Non-Ethereum browser detected. Using http provider instead.');
    window.web3 = new Web3(new web3.providers.HttpProvider());
    ready = true;
  }
});

function watchBalance() {
  if (ready) {
    // Getting coinbase address
    var coinbase = web3.eth.coinbase;

    // Getting balance of this address
    // Using call back to support MetaMask
    web3.eth.getBalance(coinbase, (err, res) => {
      // Checking if things goes wrong
      if (!err) {
        // Convert balance to number to do calculation
        var originalBalance = res.toNumber();
        // Print some data
        document.getElementById('coinbase').innerText = 'coinbase: ' + coinbase;
        document.getElementById('original').innerText = ' original balance: ' + originalBalance + '    watching...';

        // Change filter mode to latest
        web3.eth.filter('latest').watch(() => {
          // Now with this filter set we should take only mined tx
          web3.eth.getBalance(coinbase, (err, res) => {
            if (!err) {
              // Reprint and see if there is a difference
              var currentBalance = res.toNumber();
              document.getElementById("current").innerText = 'current: ' + currentBalance;
              document.getElementById("diff").innerText = 'diff:    ' + (currentBalance - originalBalance);
            } else {
              console.log(err);
            }
          });
        });
      } else {
        console.log(err);
      }
    });
  } else {
    console.log("Please wait page to load for interact with the blockchain.")
  }
}
