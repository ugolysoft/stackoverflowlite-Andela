[![Build Status](https://travis-ci.org/ugolysoft/stackoverflowlite-Andela.svg?branch=develop)](https://travis-ci.org/ugolysoft/stackoverflowlite-Andela)

# StackOverFlowLite-Andela
## Introduction
This program set up a simple nodejs-restful Api using json files (users.json,questions.json,answers.json) data structure
It consist of a controller (controller.js) that contain all the business logic needed to interact with the data structure.
the server file is used to spin up the server and tells the app to listen on a specific port. The app demostrate a simple peer online questions and answers forum.
## Table of content
* features in the application
* Technoly stack used
* Getting started
* API Docs
* Running Tests
* How to contribute
## Features  
* user can create account (signup)
* user can login 
* user can have access to a question and its answers
* user can scan through list of question titles
* logged in user can post a question
* logged in user can answer a question
* logged in user should be able to vote up or vote down an answer
## Technology used
- NodeJs
- Express
- Postgresql
- Mocha
- jwt
## Getting started
Before cloning the repo
* make sure you have nodejs and postgresql installed on your local machine
* the database is by default set to port 3500 (use can change that from db.js file)
To clone the repo to your local machine run
```$ clone https://github.com/ugolysoft/stackoverflowlite-Andela.git```
change directory into the stackoverflowlite-Andela
``` $ cd stackoverflowlite-Andela ```
Install all the dependacy by running 
``` $ npm install ```
Install other tools
``` npm install --save bcrypt http jsonwebtoken lodash pg ```
Create a database (stackdb) to be used with the app
## API Docs
POST localhost:3500/api/v1/register
- to create account
POST localhost:3500/api/v1/login
- to log into your account
POST localhost:3500/api/v1/questions
- to post new question
PUT localhost:3500/api/v1/questions/:id
- to update question
GET localhost:3500/api/v1/questions
- to get list of all questions
GET localhost:3500/api/v1/questions/:id
- to get the question whose id is pass and its answers
POST localhost:3500/api/v1/questions/:id/answers
- to post answer to a question whose id is pass
DELETE localhost:3500/api/v1/questions/:id
- delete question whose id is pass
## Running test
### Server-side-tests
- create a test database
-run 
``` $ DATABASE_URL=postgresql://postgres:ugowoo@localhost:DATABASE_PORT/DATABASENAME ./node_modules/mocha/bin/mocha test --exit ```
### End-to-end Test
to run end-to-end test, make sure you have Postman installed in your local machine. Use it to run the test
## Current Limitation
- user cannot comment to a question or answer
## How to contribute
* fork the repository
* create a feature branch with feature.md file
* write tests and make them pass
* open a pull request
