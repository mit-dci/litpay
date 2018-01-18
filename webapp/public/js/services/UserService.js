angular.module('UserService', [])

.factory('User', function($http, $q, $cookies) {
    return {
        get: function(id) {
            return $http.get('/api/users/' + id);
        },
    
        create: function(userData) {
            return $http.post('/api/users', userData);
        }
    }   
});

