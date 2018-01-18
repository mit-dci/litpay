angular.module('AuthService', [])

.factory('authInterceptor', function(API, auth, $q, $location) {
    return {
        // automatically attach Authorization header
        request: function(config) {
            var token = auth.getToken();
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
                    $location.url('/');
                } else {
                    // Token expired/logged out
                    $location.url('/login');
                }
                return;
            }
            
            return $q.reject(res);
        }
    }
})

.service('auth', function($window) {
    this.parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    };

    this.saveToken = function(token) {
        $window.localStorage['jwtToken'] = token
    };

    this.logout = function(token) {
        $window.localStorage.removeItem('jwtToken');
    };

    this.getToken = function() {
        return $window.localStorage['jwtToken'];
    };

    this.isAuthed = function() {
        var token = this.getToken();
        if(token) {
            var params = this.parseJwt(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        } else {
            return false;
        }
    };
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
})

.constant('API', '//localhost/api');

