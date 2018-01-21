angular.module('UserService', [])

.factory('User', function($http) {
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
        },
        
        getPayments: function(id) {
            return $http.get('/api/users/' + id + '/payments');
        },
        
        newPayment: function(id, payment) {            
            return $http.post('/api/users/' + id + '/payments', payment);
        },
        
        getPayment: function(id, payment) {
            return $http.get('/api/users/' + id + '/payments/' + payment);
        }
    }   
});

