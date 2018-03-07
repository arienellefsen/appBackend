var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Affirmation = new mongoose.Schema({
    affirmation: String,
    googleId: String,
    picture: String,
    name: String,
    category: String
});

module.exports = mongoose.model("Affirmation", Affirmation);