var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    transactions: [Schema({
        id: {
            type: String,
            required: true
        },
        delta: {
            type: Number,
            required: true
        },
        idx: {
            type: Number,
            required: true,
            min: 0
        }
    })]
};
