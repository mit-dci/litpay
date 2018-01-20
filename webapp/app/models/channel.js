var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = require('./transaction');

module.exports = {
    pkh: {
        type: String
    },
    capacity: {
        type: Number,
        min: 1
    },
    balance: {
        type: Number,
        min: 0
    },
    cointype: {
        type: Number,
        min: 0,
        max: 65536
    },
    open: {
        type: Boolean,
        required: true,
        default: false
    },
    funded: {
        type: Boolean,
        required: true,
        default: false
    },
    fundData: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
        index: true
    },
    transactions: [Schema(TransactionSchema)]
};
