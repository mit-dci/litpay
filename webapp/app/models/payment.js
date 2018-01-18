var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Payment', new Schema({
    id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    cointype: {
        type: Number,
        required: true,
        min: 0,
        max: 65536
    },
    balance: {
        type: Number,
        required: true,
        min: 0
    },
    from: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
});