angular.module('MainCtrl', []).controller('MainController', 
                                          function($scope, auth, $location) {
    $scope.auth = auth;
    
    if(auth.isAuthed()) {
        $location.path('/users/' + auth.getToken().id);
    } else {
        $location.path('/login');
    }
});
