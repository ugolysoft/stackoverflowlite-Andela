"use strict";
const chai = require("chai");
const expect = require("chai").expect;
chai.use(require("chai-http"));

const app = require("../server");
const db = require("../db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let token = "",
  questionid = "",
  answerid = "";

describe("Test stackoverflowlite RESTAPI", () => {
  before(() => {});

  after(() => {
    db.runQuery("TRUNCATE TABLE users");
    db.runQuery("TRUNCATE TABLE questions");
    db.runQuery("TRUNCATE TABLE answers");
  });

  it("should create new user", () => {
    let user = {
      name: "john",
      email: "me@mail.com",
      password: "123"
    };
    return chai
      .request(app)
      .post("/api/v1/register")
      .send(user)
      .then(res => {
        expect(res).to.have.status(200);
        if (res.body.success) {
          expect(res.body.message).to.include("Resgistration was successful");
        } else {
          expect(res.body.message).to.equal(
            `Registration failed. User with this email '${user.email}' already registered.`
          );
        }
      });
  });

  it("should login user if registered", () => {
    let user = {
      email: "me@mail.com",
      password: "123"
    };
    return chai
      .request(app)
      .post("/api/v1/login")
      .send(user)
      .then(res => {
        expect(res).to.have.status(200);
        if (!res.body.success) {
          expect(res.body.message).to.include("Wrong");
        } else {
          token = res.body.token;
          expect(res.body).to.have.property("token");
          jwt.verify(res.body.token, "make-me-screet", (err, decoded) => {
            if (!err) {
              expect(decoded.email).to.equal(user.email);
            }
          });
        }
      });
  });

  it("loggin user should post question", () => {
    let qns = {
      body: "Hello world! My test",
      title: "say hello world"
    };
    return chai
      .request(app)
      .post("/api/v1/questions")
      .set("token", token)
      .send(qns)
      .then(res => {
        if (!res.body.success) {
          expect(res.body.message).to.include("Operation failed");
        } else {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal("Operation was successful");
          expect(res.body.data).to.be.an("array");
          expect(res.body.data[0].message).to.be.equal(qns.message);
          questionid = res.body.data[0].id;
        }
      });
  });

  it("loggin user can provide answer to a question", () => {
    let ans = {
      body: "This is my answer to your question"
    };
    return chai
      .request(app)
      .post("/api/v1/questions/" + questionid + "/answers")
      .set("token", token)
      .send(ans)
      .then(res => {
        if (!res.body.success) {
          expect(res.body.message).to.include("Operation failed");
        } else {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal("Operation was successful");
          answerid = res.body.data[0].id;
          console.log(answerid);
        }
      });
  });
  

  it("should be able to view all questions", () => {
    return chai
      .request(app)
      .get("/api/v1/questions")
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
      });
  });

  it("should be able to view a question", () => {
    return chai
      .request(app)
      .get("/api/v1/questions/" + questionid)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
      });
  });

  it("logged in user should be able to edit his question", () => {
    let edit = {
      title: "I am edited title",
      body: "body of the question has changed"
    };
    return chai
      .request(app)
      .put("/api/v1/questions/" + questionid)
      .set("token", token)
      .send(edit)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
      });
  });

  it("logged in user should be able to delete his question", () => {
    return chai
      .request(app)
      .delete("/api/v1/questions/" + questionid)
      .set("token", token)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
      });
  });

  it("logged in user should be able to voteup or votedown question", () => {
    let vote = {
      vote: 1
    };
    return chai
      .request(app)
      .post("/api/v1/questions/" + questionid + "/answers/" + answerid)
      .set("token", token)
      .send(vote)
      .then(res => {
        if (!res.body.success) {
          expect(res.body.message).to.include("Operation failed");
        } else {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal("Operation was successful");
        }
      });
  });
});
