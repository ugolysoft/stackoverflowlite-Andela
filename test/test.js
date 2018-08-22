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
	/*
	it('should return a specific question', () => {
		return chai.request(app).get('/api/v1/questions/:id').then((res) => {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.an('array');
			
		});
	});
	it('should return all answers to a specific question', () => {
		return chai.request(app).get('/api/v1/questions/:questionid/answers').then((res) => {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.an('array');
			
		});
	});
	
	it('should add new question', () => {
		let qns = {
				"id":"1",
				"userid":"2",
				"title": "This is title of first question",
				"body":"This is the body of the first question",
				"date":"2018/08/06",
				"time":"12:15"
			}
		return chai.request(app).post('/api/v1/questions').send(qns).then((res) => {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.an('array');
			
		});
	});
	
	it('should update a question given the id', () => {
		let qns = {
			title: 'question title',
			body: 'body of the question'
		};
		return chai.request(app).put('/api/v1/questions/:id').send(qns).then((res)=>{
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.an('array');
		})
	});
	
	it('should delete a question given the id', () => {
		return chai.request(app).delete('/api/v1/questions/:id').then((res)=>{
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.an('array');
		})
	});
*/
});