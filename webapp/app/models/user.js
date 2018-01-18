var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    name: {
        type: String,
        required: true,
        min: [3, 'Username too short'],
        max: 24,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    payable: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Payment'
    }],
    receivable: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Payment'
    }],
    channels: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Channel'
    }]
}));