var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new mongoose.Schema({
    author: String,
    post: String
});

module.exports = mongoose.model("Post", Post);