var express = require('express');
var router = express.Router({mergeParams: true});

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CryptoJS = require('crypto-js');

var auth = require('../middleware/auth');
var authUser = require('../middleware/authUser');

var Channel = require('../models/channel');

// Dumps all the channels for a given user
router.get('/', auth, authUser, function(req, res) {
    Channel.find({'user': req.params.user_id}, function(err, channels) {
        if(err) {
            return res.json({success: false,
                             message: err
                            });
        }
        
        return res.json({success: true,
                         channels: channels
                        });
    });
});

// Gets info about a specific channel
router.get('/:channel_id', auth, authUser, function(req, res) {
    Channel.findOne({'user': req.params.user_id, '_id': req.params.channel_id}, function(err, channel) {
        if(err) {
            return res.json({success: false,
                             message: err
                            });
        }
        
        return res.json({success: true,
                         channel: channel
                        });
    });
});

// Creates a new channel open request
router.post('/', auth, authUser, function(req, res) {    
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
        
        Channel.find({'user': req.params.user_id, 'funded': false}, function(err, channels) {
            if(err) {
                return res.json({
                    success: false,
                    message: err
                });
            }
            
            if(channels.length == 0) {
                var channel = new Channel();
        
                channel.user = req.params.user_id;
                channel.fundData = CryptoJS.lib.WordArray.random(32);
            
                channel.save(function(err) {
                    if(err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    }
            
                    return res.json({
                        success: true,
                        fundData: channel.fundData
                    });
                });
            } else {
                return res.json({
                    success: true,
                    fundData: channels[0].fundData
                });
            }
        });        
    });
});

module.exports = router;
