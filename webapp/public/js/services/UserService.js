angular.module('UserService', [])

.factory('User', function($http, $q, $cookies) {
    return {
        get: function(id) {
            return $http.get('/api/users/' + id);
        },
    
        create: function(userData) {
            return $http.post('/api/users', userData);
        },
        
        getChannels: function(id) {
            return $http.get('/api/users/' + id + '/channels');
        },
        
        newChannel: function(id) {
            return $http.post('/api/users/' + id + '/channels');
        }
    }   
});

