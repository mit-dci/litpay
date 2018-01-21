var express = require('express');
var router = express.Router({mergeParams: true});

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CryptoJS = require('crypto-js');

var auth = require('../middleware/auth');
var authUser = require('../middleware/authUser');

var PaymentSchema = require('../models/payment');
var Payment = mongoose.model('Payment', new Schema(PaymentSchema));

var User = mongoose.model('User');

// Dumps all the payments for a given user
router.get('/', auth, authUser, function(req, res) {
    Payment.find({'to': req.params.user_id}, function(err, receivable) {
        if(err) {
            return res.json({success: false,
                             message: err
                            });
        }
        
        Payment.find({'from': req.params.user_id}, function(err, payable) {
            if(err) {
                return res.json({success: false,
                                 message: err
                                });
            }
            
            return res.json({success: true,
                             receivable: receivable,
                             payable: payable
                            });
        });
    });
});

// Gets info about a specific payment
router.get('/:payment_id', auth, authUser, function(req, res) {
    Payment.findOne({ $or: [{'to': req.params.user_id}, {'from': req.params.user_id}], '_id': req.params.payment_id}, function(err, payment) {
        if(err) {
            return res.json({success: false,
                             message: err
                            });
        }
        
        return res.json({success: true,
                         payment: payment
                        });
    });
});

// Creates a new payment request
router.post('/', auth, authUser, function(req, res) {
    req.checkBody('to', 'Recipient is required').notEmpty();
    req.checkBody('amount', 'Amount is required').notEmpty();
    req.checkBody('amount', 'Amount must be an integer').isInt({min: 0});
    req.checkBody('cointype', 'Coin type is required').notEmpty();
    req.checkBody('cointype', 'Coin type must be an integer').isInt({min: 0, max: 65536});
   
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
        
        switch(parseInt(req.body.cointype)) {
            case 0:
            case 1:
            case 28:
            case 65536:
                break;
            default:
                return res.json({success: false,
                                 message: "Unsupported coin type"
                                });
        }
        
        // Check recipient user exists
        User.findById(req.body.to, function(err, user) {
            if(err) {
                return res.json({success: false,
                                 message: err
                                });
            }
            
            var newPayment = new Payment();
        
            newPayment.pushData = CryptoJS.lib.WordArray.random(32);
            newPayment.from = req.params.user_id;
            newPayment.to = req.body.to;
            newPayment.cointype = req.body.cointype;
            
            // Timeout 15 minutes in the future
            var now = new Date();
            now.setMinutes(now.getMinutes() + 15);            
            newPayment.timeout = now;
            
            newPayment.amount = req.body.amount;
            newPayment.balance = req.body.amount;
            
            newPayment.save(function(err) {
                if(err) {
                    return res.json({success: false,
                                     message: err
                                    });
                }
                
                return res.json({success: true,
                                 payment: newPayment
                                });
            });
        });
    });
});

module.exports = router;