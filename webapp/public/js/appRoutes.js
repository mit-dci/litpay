angular.module('appRoutes', ['ui.router']).config(
function($stateProvider, $urlRouterProvider, $locationProvider) {
        
    $urlRouterProvider.otherwise('/login');
        
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    
    $stateProvider
        // home page        
        .state('pay', {
            url: '/users/{user_id}/payments/{payment_id}',
            templateUrl: 'views/pay.html',
            controller: 'PaymentController'
        })

        .state('user', {
            url: '/users/{user_id}',
            templateUrl: 'views/user.html',
            controller: 'UserController'
        })
        
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        });
});
