angular.module('MainCtrl', []).controller('MainController', 
                                          function($scope, auth, $location) {
    $scope.auth = auth;
    
    if(!auth.isAuthed()) {
        auth.saveAttemptUrl();
        $location.path('/login');
    }
    
});
