angular.module('CoinService', [])

.factory('Coin', function() {
    return {
        coinTypeToName: function(cointype) {
            switch(cointype) {
                case 0:
                    return {name: "Bitcoin", 
                            ticker: "BTC"
                           };
                case 1:
                    return {name: "Bitcoin Testnet", 
                            ticker: "BTCTEST"
                           };
                case 28:
                    return {name: "Vertcoin",
                            ticker: "VTC"
                           };
                case 65536:
                    return {name: "Vertcoin Testnet",
                            ticker: "VTCTEST"
                           };
                default:
                    return {name: "Unknown",
                            ticker: "UNKNOWN"
                           };
                    
            }
        }
    }
});