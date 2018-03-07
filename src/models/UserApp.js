var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var UserApp = new Schema({
    name: String,
    email: String,
    picture: String,
    googleId: String,
    affirmation: [{
        type: Schema.Types.ObjectId,
        ref: 'Affirmation'
    }]
});

module.exports = mongoose.model('UserApp', UserApp);