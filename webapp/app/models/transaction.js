module.exports = {
    pushData: {
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
};