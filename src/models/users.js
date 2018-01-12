var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var User = new Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
});

module.exports = mongoose.model('User', User);