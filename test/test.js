'use strict';
const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));


const app = require('../config');
//const server = require('../').server;
//app.listen();

describe('API endpoint questions', () => {
	
	before(() => {
		
	});
	after(() => {
		
	});
	it('should return all questions', () => {
		chai.request(app).get('/api/v1/questions').then((res) => {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.an('array');
		});
	});
	
	it('should return a specific question', () => {
		return chai.request(app).get('/api/v1/questions/:id').then((res) => {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.an('array');
			
		});
	});
	
});