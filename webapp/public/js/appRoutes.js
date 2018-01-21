angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {

    $routeProvider

        // home page        
        .when('/users/:user_id/payments/:payment_id', {
            templateUrl: 'views/pay.html',
            controller: 'PaymentController'
        })

        .when('/users/:user_id', {
            templateUrl: 'views/user.html',
            controller: 'UserController'
        })
        
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        });

    $locationProvider.html5Mode(true);

}]);
