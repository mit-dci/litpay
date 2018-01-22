angular.module('UserCtrl', []).controller('UserController', 
                                          function($scope, User, 
                                                   $transition$, $location,
                                                   $interval, Coin) {
                                                       
    $scope.channels = [];
    $scope.transactions = [];
    $scope.payment = {};
    
    $scope.coinTypeToName = Coin.coinTypeToName;
    
    $scope.updateChannels = function() {
        User.getChannels($transition$.params().user_id).then(function(res) {
            if(res.data.success) {
                $scope.channels = res.data.channels;
            } else {
                $scope.message = res.data.message;
            }
        });
    };
    
    $scope.updateChannels();
    
    $scope.newChannel = function() {
        User.newChannel($transition$.params().user_id).then(function(res) {
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
        User.getPayments($transition$.params().user_id).then(function(res) {
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
        User.newPayment($transition$.params().user_id, $scope.payment).then(function(res) {
            return $location.path("/users/" + $transition$.params().user_id + "/payments/" + res.data.payment._id);
        });
    };
    
    $scope.$on("$destroy", function() {
        if(angular.isDefined($scope.updateTimer)) {
            $interval.cancel($scope.updateTimer);
        }
    });
    
    $scope.updateTimer = $interval(function(){
        $scope.newChannel();
        $scope.updateChannels();
        $scope.updateTransactions();
        $scope.updatePayments();
    }, 5000);
})

.controller('LoginController', function($scope, $http, API, 
                                        User, $location, auth, $cookies) {
    if(auth.isAuthed()) {
        $location.path("/users/" + auth.getToken().id);
    }
   
    $scope.login = function() {
        $scope.message = "Logging in...";
        var callback = function(res) {
            $scope.message = res.data.message;
            if(res.data.success) {
                var expiry = new Date();
                expiry.setDate(expiry.getDate() + (1.0/48));
                auth.redirectToAttemptedUrl();
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
})

.controller('PaymentController', function($scope, User, $location, $transition$, $interval) {
    $scope.payment = {};
    $scope.timeout = "";
    $scope.paid = false;
    
    $scope.updatePayment = function() {
        User.getPayment($transition$.params().user_id, $transition$.params().payment_id).then(function(res) {
            if(!res.data.success) {
                return $location.path("/");
            }
            
            $scope.payment = res.data.payment;
            
            if($scope.payment.balance <= 0) {
                $scope.payment.balance = "Paid";
                $scope.paid = true;
            }
        });
    };
    
    $scope.updateTimeout = function() {
        var distance = Date.parse($scope.payment.timeout) - Date.now();
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if(distance > 0) {
            $scope.timeout = minutes + "m " + seconds + "s";
        } else {
            $scope.timeout = "Expired";
        }
    };
    
    $scope.updatePayment();
    
    $scope.$on("$destroy", function() {
        if(angular.isDefined($scope.updateTimer)) {
            $interval.cancel($scope.updateTimer);
        }
        
        if(angular.isDefined($scope.timeoutTimer)) {
            $interval.cancel($scope.timeoutTimer);
        }
    });
    
    $scope.updateTimer = $interval($scope.updatePayment, 5000);
    $scope.timeoutTimer = $interval($scope.updateTimeout, 500);
});
