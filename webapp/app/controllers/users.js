var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pw = require("../helpers/password");

var auth = require('../middleware/auth');
var authUser = require('../middleware/authUser');

var UserSchema = require('../models/user');
var User = mongoose.model('User', new Schema(UserSchema));

var channels = require('./channels');

router.use('/:user_id/channels', channels);

router.get('/', auth, function(req, res) {
    User.find({}, function(err, users){
        res.json(users);
    });
});

router.post('/', function(req, res) {
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must be at least 8 characters')
       .len(8, undefined);
    req.checkBody('name', 'Username is required').notEmpty();
      
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
            
            if(user) {
                return res.json({success: false, 
                                 message: 'User already exists'
                                });
            } else {
                pw.cryptPassword(req.body.password, function(err, hash){
                    if(err) {
                        return res.json({success: false,
                                         message: err
                                        });
                    }
                    
                    var user = new User();
                    
                    user.password = hash;
                    user.name = req.body.name;
                    
                    user.save(function(err){
                        if(err) {
                            return res.json({success: false,
                                             message: err
                                            });
                        }
                        
                        res.json({success: true,
                                  message: 'User created!' 
                                 });
                    }); 
                });
            }
        });
    });
});

router.put('/:user_id', auth, authUser, function(req, res) { 
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must be at least 8 characters')
       .len(8, undefined);
      
    req.getValidationResult().then(function(errors) {
        if(!errors.isEmpty()) {
            var errs = [];
            for(var i in errors.array()) {
                errs.push(errors.array()[i]["msg"]);
            }
            return res.json({success: false,
                             message: errs
                            });
        }
        
        User.findById(req.params.user_id, function(err, user) {
           if(err) {
               return res.json({success: false,
                                message: err
                               });
           }
           
           pw.cryptPassword(req.body.password, function(err, hash) {
               if(err) {
                   return res.json({success: false,
                                    message: err
                                   });
               } 
               
               user.password = hash;
           });
           
           user.save(function(err) {
               if(err) {
                   return res.json({success: false,
                                    message: err
                                   });
               }
               
               res.json({success: true,
                         message: 'User updated'
                        });
           });
        });
    });
});

router.get('/:user_id', auth, authUser, function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
       if(err) {
           return res.json({success: false,
                            message: err
                           });
       }
       
       res.json(user);
    });
});

router.delete('/:user_id', auth, authUser, function(req, res) {
    User.remove({_id: req.params.user_id}, function(err, user) {
       if(err) {
           return res.send(err);
       }
       
       res.json({success: true,
                 message: 'Successfully deleted'
                });
    });
});

module.exports = router;
