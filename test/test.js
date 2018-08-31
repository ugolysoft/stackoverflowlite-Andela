"use strict";
const chai = require("chai");
const expect = require("chai").expect;
const app = require("../server");
const db = require("../db");
const jwt = require("jsonwebtoken");

chai.use(require("chai-http"));

let token = "",
  questionid = "",
  answerid = "";

describe("Test stackoverflowlite RESTAPI", () => {
  before(() => {
    return db.userTB();
  });

  after(() => {
    db.runQuery("DELETE FROM users_tb");
  });

  it("should create new user", () => {
    let user = {
      name: "john",
      email: "me@mail.com",
      password: "123"
    };
    return chai
      .request(app)
      .post("/api/v1/auth/signup")
      .send(user)
      .then(res => {
        expect(res).to.have.status(200);
        if (res.body.success) {
          expect(res.body.message).to.include("Resgistration was successful");
        } else {
          expect(res.body).to.be("object");
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
      .post("/api/v1/auth/login")
      .send(user)
      .then(res => {
        expect(res).to.have.status(200);
        if (!res.body.success) {
          if (typeof res.body.data === "undefined")
            expect(res.body.message).to.include("Operation failed");
          else expect(res.body.message).to.include("Wrong email or password");
        } else {
          token = res.body.data.token;
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
          expect(res.body).to.be.an("object");
          questionid = res.body.data[0].qnsid;
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
          expect(res.body).to.be.an("object");
          answerid = res.body.data[0].ansid;
        }
      });
  });

  it("should be able to view all questions", () => {
    return chai
      .request(app)
      .get("/api/v1/questions")
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
      });
  });

  it("should be able to view a question", () => {
    return chai
      .request(app)
      .get("/api/v1/questions/" + questionid)
      .then(res => {
        if (typeof res.body.success !== "undefined" && !res.body.success) {
          expect(res.body.message).to.include("Operation failed");
        } else {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
        }
      });
  });

  it("logged in user should be able to voteup or votedown question", () => {
    let vote = {
      vote: 1
    };
    return chai
      .request(app)
      .post("/api/v1/questions/answers/votes/" + answerid)
      .set("token", token)
      .send(vote)
      .then(res => {
        if (!res.body.success) {
          expect(res.body.message).to.include("Operation failed");
        } else {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
        }
      });
  });

  it("loggin user can provide comment on an answer", () => {
    let comment = {
      body: "This is my comments to this answer"
    };
    return chai
      .request(app)
      .post("/api/v1/questions/answers/comments/" + answerid)
      .set("token", token)
      .send(comment)
      .then(res => {
        if (res.body.success) {
          expect(res).to.have.status(200);
        }
      });
  });

  it("logged in user should be able to marked answer to his question as preferred answer", () => {
    return chai
      .request(app)
      .put("/api/v1/questions/" + questionid + "/answers/" + answerid)
      .set("token", token)
      .then(res => {
        if (!res.body.success) {
          expect(res.body.message).to.include("Operation failed");
        } else {
          expect(res).to.have.status(200);
        }
      });
  });

  it("logged in user should be able to view all his/her questions", () => {
    return chai
      .request(app)
      .get("/api/v1/users/questions/")
      .set("token", token)
      .then(res => {
        if (typeof res.body.success !== "undefined" && !res.body.success) {
          expect(res.body.message).to.include("Operation failed");
        } else {
          expect(res).to.have.status(200);
        }
      });
  });

  it("logged in user should be able to delete his question", () => {
    return chai
      .request(app)
      .delete("/api/v1/questions/" + questionid)
      .set("token", token)
      .then(res => {
        if (!res.body.success) {
          expect(res.body.message).to.include("Operation failed");
        } else {
          expect(res).to.have.status(200);
        }
      });
  });
});
