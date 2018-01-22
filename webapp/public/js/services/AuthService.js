angular.module('AuthService', [])

.factory('authInterceptor', function(API, auth, $q, $location) {
    return {
        // automatically attach Authorization header
        request: function(config) {
            var token = auth.getRawToken();
            if(config.url.indexOf(API) === 0 && token) {
                config.headers['x-access-token'] = token;
            }
            return config;
        },

        response: function(res) {
            if(res.config.url.indexOf(API) === 0 && res.data.token) {
                auth.saveToken(res.data.token);
            }

            return res;
        },
        
        responseError: function(res) {
            if(res.status == 401) {
                if(auth.isAuthed()) {
                    // Disallowed resource
                    $location.path('/');
                } else {
                    // Token expired/logged out
                    auth.saveAttemptUrl();
                    $location.path('/login');
                }
                return;
            }
            
            return $q.reject(res);
        }
    }
})

.service('auth', function($window, $location, $cookies) {
    this.parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    };

    this.saveToken = function(token) {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + (1.0/48));
        $cookies.put('jwtToken', token, {expires: expiry});
    };

    this.logout = function() {
        $cookies.remove('jwtToken');
        $location.path("/");
    };

    this.getRawToken = function() {
        return $cookies.get('jwtToken');
    };
    
    this.getToken = function() {
        return this.parseJwt(this.getRawToken());
    }; 

    this.isAuthed = function() {
        var token = this.getRawToken();
        if(token) {
            var params = this.parseJwt(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        } else {
            return false;
        }
    };
    
    this.saveAttemptUrl = function() {
        this.url = $location.path();
    };
    
    this.redirectToAttemptedUrl = function() {
        $location.path(this.url);
    };
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
})

.constant('API', '/api');

