angular.module('UserCtrl', []).controller('UserController', function($scope, User) {

    $scope.tagline = 'Nothing beats a pocket protector!';
    
    User.get();

});