angular.module('UserCtrl', []).controller('UserController', 
                                          function($scope, User, 
                                                   $routeParams, $q) {
                                                       
    $scope.channels = [];
    $scope.transactions = [];
    $scope.payment = {};
    
    $scope.updateChannels = function() {
        User.getChannels($routeParams.user_id).then(function(res) {
            if(res.data.success) {
                $scope.channels = res.data.channels;
            } else {
                $scope.message = res.data.message;
            }
        });
    };
    
    $scope.updateChannels();
    
    $scope.newChannel = function() {
        User.newChannel($routeParams.user_id).then(function(res) {
            if(res.data.success) {
                $scope.fundData = res.data.fundData;
            } else {
                $scope.message = res.data.message;
            }
        });
    };
    
    $scope.newChannel();
    
    $scope.updateTransactions = function() {
        var txs = [];
        for(var channel in $scope.channels) {
            for(var tx in $scope.channels[channel].transactions) {
                $scope.channels[channel].transactions[tx].pkh = $scope.channels[channel].pkh;
                $scope.channels[channel].transactions[tx].cointype = $scope.channels[channel].cointype;
                txs.push($scope.channels[channel].transactions[tx]);
            }
        }
        
        $scope.transactions = txs;
    };
    
    $scope.updateTransactions();
    
    $scope.updatePayments = function() {
        User.getPayments($routeParams.user_id).then(function(res) {
            if(res.data.success) {
                $scope.payable = res.data.payable;
                $scope.receivable = res.data.receivable;
                for(var i in $scope.payable) {
                    if(Date.parse($scope.payable[i].timeout) < Date.now()) {
                        $scope.payable[i].timeout = "Expired";
                    }
                }
                
                for(var i in $scope.receivable) {
                    if(Date.parse($scope.receivable[i].timeout) < Date.now()) {
                        $scope.receivable[i].timeout = "Expired";
                    }
                }
            } else {
                $scope.message = res.data.message;
            }
        });
    };
    
    $scope.updatePayments();
    
    $scope.newPayment = function() {
        User.newPayment($routeParams.user_id, $scope.payment).then(function(res) {
            $scope.updatePayments();
        });
    };
    
    setInterval(function(){
        $scope.newChannel();
        $scope.updateChannels();
        $scope.updateTransactions();
        $scope.updatePayments();
    }, 5000);
})

.controller('LoginController', function($scope, $http, API, 
                                        User, $location, auth, $cookies) {
    if(auth.isAuthed()) {
        $location.path("/");
    }
   
    $scope.login = function() {
        $scope.message = "Logging in...";
        var callback = function(res) {
            $scope.message = res.data.message;
            if(res.data.success) {
                var expiry = new Date();
                expiry.setDate(expiry.getDate() + (1.0/48));
                $location.path("/");
            }
        };
        
        return $http.post(API + '/authenticate', {
            name: $scope.username,
            password: CryptoJS.SHA3($scope.password).toString()
        }).then(callback, callback);
    };
    
    $scope.register = function() {
        $scope.message = "Registering...";
        var callback = function(res) {
            $scope.message = res.data.message;
            if(res.data.success) {
                $scope.login();
            }
        };
        
        return User.create({
            name: $scope.username,
            password: CryptoJS.SHA3($scope.password).toString()
        }).then(callback, callback);
    };
});
