var express = require('express');
var router = express.Router();

var auth = require('../middleware/auth');
var authUser = require('../middleware/authUser');

var User = require('../models/user');

router.get('/', auth, function(req, res) {
    User.find({}, function(err, users){
        res.json(users);
    });
});

router.post('/', function(req, res) {
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
            var user = new User();
            user.name = req.body.name;
            user.password = req.body.password;

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
        }
    });
});

router.put('/:user_id', auth, authUser, function(req, res) { 
    User.findById(req.params.user_id, function(err, user) {
       if(err) {
           return res.send(err);
       }

       user.password = req.body.password;
       
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

router.get('/:user_id', auth, authUser, function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
       if(err) {
           return res.send(err);
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