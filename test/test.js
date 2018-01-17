'use strict';

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../app.js'); // Our app

describe('API endpoint /', function() {
    this.timeout(5000); // How long to wait for a response (ms)
    before(function() {});
    after(function() {});
});

// GET - List all colors
it('should return all users', function() {
    return chai.request(app)
        .get('/')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
        });
});

// POST - Add new color
it('should add new user', function() {
    return chai.request(app)
        .post('/saved')
        .send({
            name: 'new test',
            email: 'test email',
        })
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
        });
});

// GET - Invalid path
it('should return Not Found', function() {
    return chai.request(app)
        .get('/test')
        .then(function(res) {
            throw new Error('Path exists!');
        })
        .catch(function(err) {
            expect(err).to.have.status(404);
        });
});