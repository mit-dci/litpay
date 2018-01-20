module.exports = {
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
};