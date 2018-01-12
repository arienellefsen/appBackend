var express = require('express');
var app = express();
var router = express.Router();

// Require Item model in our routes module
var User = require('../models/users');

// Defined get data(index or listing) route
router.route('/').get(function(req, res) {
    res.send('working');
});

//Save user information to database
router.route('/saved').post(function(req, res) {
    User.create({
        id: 'id2',
        name: 'ariene2',
        email: 'email2'
    }, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Saved Search");
        }
    });
});


module.exports = router;