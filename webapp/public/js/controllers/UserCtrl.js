angular.module('UserCtrl', []).controller('UserController', 
                                          function($scope, User, 
                                                   $routeParams, $q) {
                                                       
    $scope.channels = [];
    
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
    
    setInterval(function(){
        $scope.newChannel();
        $scope.updateChannels();
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
