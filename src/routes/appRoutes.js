var express = require('express');
var app = express();
var router = express.Router();

// Require Item model in our routes module
var UserApp = require('../models/UserApp');
var Affirmation = require('../models/Affirmation.js');


// Defined get data(index or listing) route
router.route('/listAffirmation').get(function(req, res) {
    Affirmation.find({})
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
        });
});


//Populate affirmations
router.route('/affirmations').get(function(req, res) {
    UserApp.find({})
        .populate("affirmation")
        // Now, execute that query
        .exec(function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            } else {
                console.log(doc.affirmation);
                res.json(doc);
            }
        });
});

// READ (ONE) by ID - database id
router.route('/user/:id').get(function(req, res) {
    UserApp.findOne({ "_id": req.params.id })
        // ..and populate all of the notes associated with it
        .populate("affirmation")
        // now, execute our query
        .exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});

// READ (ONE) by ID - database id
router.route('/:id').get(function(req, res) {
    UserApp.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such user.` });
        });
});


//Save user AFFIRMATION
// New note creation via POST route
router.route('/addPost').post(function(req, res) {
    var newAffirmation = new Affirmation({ affirmation: req.body.affirmation, googleId: req.body.googleId, picture: req.body.picture, name: req.body.name, category: req.body.category });
    console.log('req.affirmation ' + req.body.affirmation);
    // Save the new note to mongoose
    newAffirmation.save(function(error, doc) {
        //Send any errors to the browser
        if (error) {
            res.send(error);
        }
        // Otherwise
        else {
            // Find our user and push the new note id into the User's notes array
            UserApp.findOneAndUpdate({ googleId: req.body.googleId }, {
                $push: {
                    "affirmation": doc._id
                }
            }, {
                new: true
            }, function(err, newdoc) {
                // Send any errors to the browser
                if (err) {
                    res.send(err);
                }
                // Or send the newdoc to the browser
                else {
                    res.send(newdoc);
                }
            });
        }
    });
});


//Save user authentication information to database
//Verify if user doesn't exist
router.route('/saved').post(function(req, res) {
    UserApp.find({ googleId: req.body.googleId },
        function(err, docs) {
            if (docs.length) {
                console.log('name already exists');

            } else {
                UserApp.create({
                    name: req.body.name,
                    email: req.body.email,
                    picture: req.body.picture,
                    googleId: req.body.googleId
                }, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Saved user");
                    }
                });
            }
        });
});

//Delete one affirmation by one
router.route('/delete/:id').delete(function(req, res) {
    Affirmation.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.json({
                success: true,
                msg: `It has been deleted.`,
                result: {
                    _id: result._id,
                    name: result.name,
                    email: result.email
                }
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
});


//Add a relationship between the post and the user
router.route('/addNewPost/:id').post(function(req, res) {
    var newPost = [];
    newPost.push(req.params.id);
    User.findOneAndUpdate({ "googleId": req.body.googleId }, { "posts": newPost })
        // Execute the above query
        .exec(function(err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            } else {
                // Or send the document to the browser
                res.send(doc);
            }
        });
});

//Update
router.route('/update/:id').put(function(req, res) {
    let updatedUser = {
        affirmation: req.body.affirmation,
    };
    Affirmation.findOneAndUpdate({ _id: req.params.id }, updatedUser, { context: 'query' })
        .then((oldResult) => {
            Affirmation.findOne({ _id: req.params.id })
                .then((newResult) => {
                    res.json({
                        success: true,
                        msg: `Successfully updated!`,
                        result: {
                            _id: newResult._id,
                            affirmation: newResult.affirmation,
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