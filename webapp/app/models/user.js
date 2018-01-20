module.exports = {
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
    }
};
