var mongoose = require('mongoose').set('debug', true);
var ChannelSchema = require('../webapp/app/models/channel');
var TxSchema = require('../webapp/app/models/transaction');

var Channel = mongoose.model('Channel', new mongoose.Schema(ChannelSchema));

var Util = require('./util');

function openChannel(pendingChannel, realChannel) {
    return new Promise(function(resolve, reject) {
        if(realChannel.StateNum != 0) {
            // TODO: Handle this more gracefully than just giving up, it's easily recoverable
            return console.error("Channel was pushed to before opened");
        }
        
        pendingChannel.cointype = realChannel.CoinType;
        pendingChannel.capacity = realChannel.Capacity;
        pendingChannel.balance = realChannel.MyBalance;
        pendingChannel.open = !realChannel.Closed;
        pendingChannel.funded = true;
        pendingChannel.pkh = Util.toHexString(realChannel.Pkh);
        
        pendingChannel.save(function(err) {
            if(err) {
                console.error(err);
            } else {
                console.log("Found new channel");
            }
            
            resolve(err);
        });
    });
}

// Checks the database for unfunded channels, and check if they become funded
function updateNewChannels(rpc) {
    // Check database for unfunded channels
    return new Promise(function(resolve, reject) {
        Channel.find({'funded': false}, function(err, pendingChannels) {
            if(err) {
                return resolve(err);
            }
            
            // First check the channel list
            rpc.call('LitRPC.ChannelList', [null]).then(function(realChannels) {
                var promises = [];
                
                for(var idpc in pendingChannels) {
                    for(var idrc in realChannels.Channels) {
                        if(Util.arrCmp(realChannels.Channels[idrc].Data, [...Buffer.from(pendingChannels[idpc].fundData, "hex")])) {
                            promises.push(openChannel(pendingChannels[idpc], realChannels.Channels[idrc]));
                            break;
                        }
                    }
                }
                
                Promise.all(promises).then(function(err) {
                    return resolve(err);
                });
            });
        });
    });
}

// Updates the status of already open channels
function updateOpenChannels(rpc) {
    return new Promise(function(resolve, reject) {
        Channel.find({'funded': true, 'open': true}, function(err, openChannels) {
            if(err) {
                return resolve(err);
            }
            
            rpc.call('LitRPC.StateDump', [null]).then(function(states) {
                rpc.call('LitRPC.ChannelList', [null]).then(function(channels) {
                    var promises = [];
                    for(var ido in openChannels) {
                        var nTxs = openChannels[ido].transactions.length;
                        var lastBal = openChannels[ido].balance;
                        
                        // Add missing transactions from StateDump
                        for(var ids in states.Txs) {
                            if(Util.toHexString(states.Txs[ids].Pkh) == openChannels[ido].pkh) {
                                var newTx = true;
                                
                                if(nTxs > 0) {
                                    if(states.Txs[ids].Idx <= openChannels[ido].transactions[nTxs - 1].idx) {
                                        newTx = false;
                                    }
                                }
                                
                                if(newTx) {
                                    // Figure out delta
                                    var delta = states.Txs[ids].Amt - lastBal;
                                    if(delta != 0) {
                                        var tx = new mongoose.Schema(TxSchema);
                                        
                                        tx.delta = delta;
                                        tx.idx = states.Txs[ids].Idx;
                                        tx.pushData = Util.toHexString(states.Txs[ids].Data);
                                        
                                        openChannels[ido].transactions.push(tx);
                                        openChannels[ido].balance = states.Txs[ids].Amt;
                                        
                                        lastBal = states.Txs[ids].Amt;
                                        nTxs++;
                                    }
                                }
                            }
                        }
                        
                        // Update latest channel status
                        for(var idc in channels.Channels) {
                            if(Util.toHexString(channels.Channels[idc].Pkh) == openChannels[ido].pkh) {
                                if(channels.Channels[idc].StateNum == nTxs) {
                                    var delta = channels.Channels[idc].MyBalance - lastBal;
                                    if(delta != 0) {
                                        var tx = new mongoose.Schema(TxSchema);
                                        
                                        tx.delta = delta;
                                        tx.idx = channels.Channels[idc].StateNum;
                                        tx.pushData = Util.toHexString(channels.Channels[idc].Data);
                                        
                                        openChannels[ido].transactions.push(tx);
                                        
                                        openChannels[ido].balance = channels.Channels[idc].MyBalance;
                                    }
                                }
                                
                                openChannels[ido].open = !channels.Channels[idc].Closed;
                                
                                break;
                            }
                        }
                        
                        promises.push(new Promise(function(resolve, reject) {
                            openChannels[ido].save(function(err) {
                                if(err) {
                                    console.error("Failed to update channel");
                                }
                                
                                console.log("Updated channel");
                                
                                resolve(err);
                            });
                        }));
                    }
                    
                    Promise.all(promises).then(function(err) {
                        resolve(err);
                    });
                });
            });
        });
    });
}

module.exports = {
    updateNewChannels: updateNewChannels,
    updateOpenChannels: updateOpenChannels
};