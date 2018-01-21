var mongoose = require('mongoose').set('debug', true);
var PaymentSchema = require('../webapp/app/models/payment');

var when = require('when');

var Payment = mongoose.model('Payment', new mongoose.Schema(PaymentSchema));
var Channel = mongoose.model('Channel');

function processPayment(payment) {
    return new Promise(function(resolve, reject) {              
        // Get the channels for the payer that are compatible with this payment
        Channel.find({'user': payment.from, 'cointype': payment.cointype, 'open': true}, function(err, channels) {
            if(err) {
                return resolve(err);
            }
            
            var promises = [];
            
            for(var chanIdx in channels) {
                // Check for any corresponding transactions in the channel
                for(var tx in channels[chanIdx].transactions) {
                    var curTx = channels[chanIdx].transactions[tx];
                    
                    // If the transaction's pushData matches that of the payment
                    // then the transaction is accounted
                    if(curTx.pushData == payment.pushData && !curTx.accounted) {
                        payment.balance -= curTx.delta;
                        curTx.accounted = true;
                    }
                }
                
                promises.push(new Promise(function(resolve, reject) {
                    channels[chanIdx].save(function(err) {
                        return resolve(err);
                    });
                }));
            }
            
            // The channels can be saved in parallel as they don't affect each other
            Promise.all(promises).then(function(errs) {
                for(var err in errs) {
                    if(errs[err]) {
                        console.error("Failed to save channels");
                        return resolve(errs[err]);
                    }
                }
                
                // Payment should only be saved after txs have been marked as accounted 
                // to prevent double spends due to a race condition 
                payment.save(function(err) {
                    if(err) {
                        console.error("Failed to save payment");
                    }
                    return resolve(err);
                });
            });
        });
    });
}

function matchPayments() {
    return new Promise(function(resolve, reject) {
        
        // Find payments with an outstanding balance and an un-expired timeout
        Payment.find({'balance': {$gt: 0}, 'timeout': {$gt: new Date()}}, function(err, payments) {
            if(err) {
                return resolve(err);
            }
            
            // These promises need to occur in sequence or txs/payments could be double counted
            var chain = when();
            
            for(var payment in payments) {
                chain = chain.then(function() {
                    return processPayment(payments[payment]);
                });
            }
            
            chain.then(function(err) {
                return resolve(err);
            });
        });
    });
}

module.exports = {
    matchPayments: matchPayments
};