var mongoose = require('mongoose').set('debug', true);
var config = require('../webapp/config/config');

var Channels = require('./channels');
var Payments = require('./payments');
var LitRPC = require('./litrpc');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, function(err) {
    if(err) {
        return console.error(err);
    }

    console.log("Connected to mongodb");

    LitRPC().then(function(rpc) {
        console.log("Connected to Lit");
        
        setInterval(function() {
            Channels.updateNewChannels(rpc).then(function(err) {
                console.log("Checked for new channels");
                Channels.updateOpenChannels(rpc).then(function(err) {
                    console.log("Updated channels");
                    Payments.matchPayments().then(function(err) {
                        console.log("Matched payments");
                    });
                });
        })}, 5000);
    });
});


