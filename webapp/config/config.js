var mongoServer = process.env.MONGO_HOST || 'localhost';
var mongoDatabase = process.env.MONGO_DB || 'litpay';
var secret = process.env.RANDOM_SECRET || 'MY_RANDOM_SECRET';

module.exports = {
    database : 'mongodb://' + mongoServer + '/' + mongoDatabase,
    secret: 'MY_RANDOM_SECRET'
};
