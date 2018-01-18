var express = require('express');
var router = express.Router();

var pw = require('../helpers/password');

var User = require('../models/user');
var jwt  = require('jsonwebtoken'); 

router.post('/authenticate', function(req, res) {
    req.checkBody('name', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    
    req.getValidationResult().then(function(errors) {
        if(!errors.isEmpty()) {
            var errs = [];
            for(var i in errors.array()) {
                errs.push(errors.array()[i]["msg"]);
            }
            return res.json({success: false,
                             message: errs.join('/n')
                            });
        }
        
        User.findOne({
            name: req.body.name
        }, function(err, user) {
            if(err) {
                throw err;
            }
            
            if(!user) {
                res.json({success: false, 
                          message: 'Authentication failed. User not found.'
                         });
            } else {
                pw.comparePassword(req.body.password, 
                                      user.password, 
                function(err, passwordValid) {
                      if(err) {
                          return res.json({success: false,
                                           message: err
                                          });
                      }
                      
                      if(passwordValid) {
                          var payload = {
                              id: user.id
                          };
                          var token = jwt.sign(payload, 
                          req.app.get('superSecret'), {
                              expiresIn: 1440 * 60
                          });
                            
                          res.json({
                              success: true,
                              token: token
                          });
                      } else {
                          return res.json({success: false,
                               message: 'Authentication failed. Wrong password.'
                          });
                      }
                });
            }
        });
    });
});

module.exports = router;