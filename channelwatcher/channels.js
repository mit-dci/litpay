var mongoose = require('mongoose').set('debug', true);
var ChannelSchema = require('../webapp/app/models/channel');

var Channel = mongoose.model('Channel', new mongoose.Schema(ChannelSchema));

function arrCmp(arr1, arr2) {
    return (arr1.length == arr2.length
    && arr1.every(function(u, i) {
        return u === arr2[i];
    }));
}

function openChannel(pendingChannel, realChannel) {
    pendingChannel.cointype = realChannel.CoinType;
    pendingChannel.capacity = realChannel.Capacity;
    pendingChannel.balance = realChannel.MyBalance;
    pendingChannel.open = !realChannel.Closed;
    pendingChannel.funded = true;
    
    pendingChannel.save(function(err) {
        if(err) {
            return console.error(err);
        }
        
        console.log("Found new channel");
    });
}

// Checks the database for unfunded channels, and check if they become funded
function updateNewChannels(rpc, callback) {
    // Check database for unfunded channels
    Channel.find({'funded': false}, function(err, pendingChannels) {
        if(err) {
            return callback(err);
        }
        
        // First check the channel list
        rpc.call('LitRPC.ChannelList', [null]).then(function(realChannels) {
            for(var idpc in pendingChannels) {
                for(var idrc in realChannels.Channels) {

                    if(arrCmp(realChannels.Channels[idrc].Data, [...Buffer.from(pendingChannels[idpc].fundData, "hex")])) {
                        openChannel(pendingChannels[idpc], realChannels.Channels[idrc]);
                        break;
                    }
                }
            }
            
            return callback(null);
        });
    });
}

module.exports = {
    updateNewChannels: updateNewChannels
};