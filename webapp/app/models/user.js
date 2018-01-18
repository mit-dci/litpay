// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define our nerd model
// module.exports allows us to pass this to other files when it is called
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
    channel: [Schema({
        id: {
            type: Number,
            min: 0,
            required: true
        },
        capacity: {
            type: Number,
            min: 1,
            required: true
        },
        balance: {
            type: Number,
            min: 0,
            required: true
        }
    })],
    payments: [Schema({
        id: {
            type: String,
            required: true,
            unique: true
        },
        amount: {
            type: Number,
            required: true,
            min: 1
        },
        paid: {
            type: Boolean,
            required: true,
            default: false
        }
    })]
}));