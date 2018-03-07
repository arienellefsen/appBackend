'use strict';
var chai = require('chai');

const expect = require('chai').expect;
const app = require('../app.js'); // Our app


describe('Test API endpoint for return all the results', function() {
    var routeApi = require('../src/routes/appRoutes.js').router;
    it('should return all users', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
            });
    });
});