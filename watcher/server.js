var mongoose = require('mongoose').set('debug', true);
var config = require('../webapp/config/config');

var Channels = require('./channels');
var LitRPC = require('./litrpc');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, function(err) {
    if(err) {
        return console.error(err);
    }

    console.log("Connected to mongodb");

    LitRPC().then(function(rpc) {
        console.log("Connected to Lit");
        
        setInterval(function(){Channels.updateNewChannels(rpc, function(err) {
            console.log("Checked for new channels");
            Channels.updateOpenChannels(rpc, function(err) {
                console.log("Updated channels");
            });
        })}, 5000);
    });
});


