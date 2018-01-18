var express = require('express');
var router = express.Router();

var User = require('../models/user');
var jwt  = require('jsonwebtoken'); 

router.post('/authenticate', function(req, res) {
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
            if(user.password != req.body.password) {
                res.json({success: false,
                          message: 'Authentication failed. Wrong password.'
                         });
            } else {
                var payload = {
                    id: user.id
                };
                var token = jwt.sign(payload, req.app.get('superSecret'), {
                    expiresIn: 1440 * 60
                });
                
                res.json({
                    success: true,
                    token: token
                });
            }
        }
        
        
    });
});

module.exports = router;