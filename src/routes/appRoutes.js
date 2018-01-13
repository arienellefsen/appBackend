var express = require('express');
var app = express();
var router = express.Router();

// Require Item model in our routes module
var User = require('../models/users');

// // Defined get data(index or listing) route
// router.route('/').get(function(req, res) {
//     res.send('working');
// });

// Defined get data(index or listing) route
router.route('/').get(function(req, res) {
    User.find({})
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
        });
});

// READ (ONE) by ID - database id
router.route('/:id').get(function(req, res) {
    User.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such user.` });
        });
});

//Save user information to database
router.route('/saved').post(function(req, res) {
    User.create({
        id: 'id5',
        name: 'ariene5',
        email: 'email5'
    }, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Saved Search");
        }
    });
});

//Delete
router.route('/:id').delete(function(req, res) {
    User.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.json({
                success: true,
                msg: `It has been deleted.`,
                result: {
                    _id: result._id,
                    id: result.id,
                    name: result.name,
                    email: result.email
                }
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
});

//Update
router.route('/:id').put(function(req, res) {
    let updatedUser = {
        name: req.body.name,
        email: req.body.email
    };
    User.findOneAndUpdate({ _id: req.params.id }, updatedUser, { context: 'query' })
        .then((oldResult) => {
            User.findOne({ _id: req.params.id })
                .then((newResult) => {
                    res.json({
                        success: true,
                        msg: `Successfully updated!`,
                        result: {
                            _id: newResult._id,
                            name: newResult.name,
                            email: newResult.email
                        }
                    });
                })
                .catch((err) => {
                    res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
                    return;
                });
        })
        .catch((err) => {
            if (err.errors) {
                if (err.errors.name) {
                    res.status(400).json({ success: false, msg: err.errors.name.message });
                    return;
                }
                if (err.errors.email) {
                    res.status(400).json({ success: false, msg: err.errors.email.message });
                    return;
                }

                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

module.exports = router;